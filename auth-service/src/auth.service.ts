import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './models/user.model';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { HelperService } from './utils/helper.service';
import { MicroserviceException } from './common/exceptions/microservice.exception';
import { ResponseHelper } from './common/responses/response.helper';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly helperService: HelperService,
  ) { }

  async register(data: RegisterDto) {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) {
      throw new MicroserviceException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userModel.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return ResponseHelper.success('User registered successfully', {
      id: user._id,
      name: user.name,
      email: user.email
    });
  }

  async login(data: LoginDto) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) throw new MicroserviceException('Invalid email or password');
    if (!user.isActive) throw new MicroserviceException('Account is inactive');

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new MicroserviceException('Invalid email or password');

    const tokens = await this.helperService.generateTokens(
      String(user._id), user.email, user.name,
    );
    await this.helperService.storeHashedRefreshToken(String(user._id), tokens.refresh_token);

    return ResponseHelper.success('User logged in successfully', {
      ...tokens,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
    });
  }

  async refreshToken(data: RefreshTokenDto) {
    const { refreshToken } = data;
    // 1. Verify the refresh token signature & expiry
    const payload = await this.helperService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new MicroserviceException('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
    }

    // 2. Find user and compare stored hashed refresh token
    const user = await this.userModel.findById(payload.userId);
    if (!user || !user.refreshToken || !user.isActive) {
      throw new MicroserviceException('Access denied', 'ACCESS_DENIED');
    }

    const tokenMatches = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!tokenMatches) {
      throw new MicroserviceException('Refresh token is invalid', 'INVALID_REFRESH_TOKEN');
    }

    // 3. Issue a new token pair (rotation)
    const tokens = await this.helperService.generateTokens(
      String(user._id), user.email, user.name,
    );
    await this.helperService.storeHashedRefreshToken(String(user._id), tokens.refresh_token);

    return ResponseHelper.success('Token refreshed successfully', {
      ...tokens,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
    });
  }

  async logout(data: RefreshTokenDto) {
    const { refreshToken } = data;
    // 1. Verify the refresh token signature & expiry
    const payload = await this.helperService.verifyRefreshToken(refreshToken);
    if (!payload) {
      throw new MicroserviceException('Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN');
    }

    await this.userModel.findByIdAndUpdate(payload.userId, { refreshToken: null });
    return ResponseHelper.success('Logged out successfully', {});
  }
}


