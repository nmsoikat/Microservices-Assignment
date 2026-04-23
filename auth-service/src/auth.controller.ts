import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AUTH_PATTERNS } from './common/constants';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @MessagePattern(AUTH_PATTERNS.REGISTER)
  register(data: any) {
    return this.authService.register(data);
  }

  @MessagePattern(AUTH_PATTERNS.LOGIN)
  login(data: any) {
    return this.authService.login(data);
  }
}
