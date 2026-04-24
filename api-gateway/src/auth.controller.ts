import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { AUTH_PATTERNS, AUTH_SERVICE_RMQ } from './common/constants';
import { JwtAuthGuard } from './guard/jwt.guard';

@Controller('auth')
export class AuthController {
    constructor(
        @Inject(AUTH_SERVICE_RMQ) private authClient: ClientProxy
    ) { }

    @Post('register')
    register(@Body() dto: any) {
        return this.authClient.send(AUTH_PATTERNS.REGISTER, dto);
    }

    @Post('login')
    login(@Body() dto: any) {
        return this.authClient.send(AUTH_PATTERNS.LOGIN, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('refresh-token')
    refreshToken(@Req() req: any, @Body() dto: any) {
        const data = {
            ...dto,
            userId: req.user.userId,
        }
        return this.authClient.send(AUTH_PATTERNS.REFRESH_TOKEN, data);
    }
}
