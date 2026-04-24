import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './models/user.model';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { HelperService } from './utils/helper.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly helperService: HelperService,
  ) { }

  async register(data: RegisterDto) {
    const existing = await this.userModel.findOne({ email: data.email });
    if (existing) {
      return { success: false, message: 'Email already in use' };
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.userModel.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return {
      success: true,
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
    };
  }

  async login(data: LoginDto) {
    const user = await this.userModel.findOne({ email: data.email });
    if (!user) return { success: false, message: 'Invalid email or password' };
    if (!user.isActive) return { success: false, message: 'Account is inactive' };

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) return { success: false, message: 'Invalid email or password' };

    const tokens = await this.helperService.generateTokens(
      String(user._id), user.email, user.name,
    );
    await this.helperService.storeHashedRefreshToken(String(user._id), tokens.refresh_token);

    return {
      success: true,
      ...tokens,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
    };
  }

  async refreshToken(data: RefreshTokenDto) {
    // 1. Verify the refresh token signature & expiry
    const isValid = await this.helperService.verifyRefreshToken(data.refreshToken);
    if (!isValid) {
      return { success: false, message: 'Invalid or expired refresh token' };
    }

    // 2. Find user and compare stored hashed refresh token
    const user = await this.userModel.findById(data.userId);
    if (!user || !user.refreshToken || !user.isActive) {
      return { success: false, message: 'Access denied' };
    }

    const tokenMatches = await bcrypt.compare(data.refreshToken, user.refreshToken);
    if (!tokenMatches) {
      return { success: false, message: 'Refresh token is invalid' };
    }

    // 3. Issue a new token pair (rotation)
    const tokens = await this.helperService.generateTokens(
      String(user._id), user.email, user.name,
    );
    await this.helperService.storeHashedRefreshToken(String(user._id), tokens.refresh_token);

    return {
      success: true,
      ...tokens,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
    };
  }

  async logout(userId: string) {
    await this.userModel.findByIdAndUpdate(userId, { refreshToken: null });
    return { success: true, message: 'Logged out successfully' };
  }
}


