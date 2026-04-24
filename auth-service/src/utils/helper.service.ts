import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from '../models/user.model';

@Injectable()
export class HelperService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    async generateTokens(userId: string, email: string, name: string) {
        const payload = {
            sub: userId,
            email,
            name
        };

        const access_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET', 'super_secret_key'),
            expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m') as any,
        });

        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'super_refresh_secret_key'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN', '7d') as any,
        });

        return { access_token, refresh_token };
    }

    async storeHashedRefreshToken(userId: string, refreshToken: string) {
        const hashed = await bcrypt.hash(refreshToken, 10);
        await this.userModel.findByIdAndUpdate(userId, { refreshToken: hashed });
    }

    verifyRefreshToken(token: string): boolean {
        try {
            this.jwtService.verify(token, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET', 'super_refresh_secret_key'),
            });
            return true;
        } catch {
            return false;
        }
    }
}
