import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { AUTH_PATTERNS } from './common/constants';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  register(@Payload() data: RegisterDto) {
    return this.authService.register(data);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  login(@Payload() data: LoginDto) {
    return this.authService.login(data);
  }

  @MessagePattern(AUTH_PATTERNS.REFRESH_TOKEN)
  refreshToken(@Payload() data: RefreshTokenDto) {
    return this.authService.refreshToken(data);
  }

  @MessagePattern(AUTH_PATTERNS.LOGOUT)
  logout(@Payload() data: RefreshTokenDto) {
    return this.authService.logout(data);
  }
}


