import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async register(data: any) {
    return { message: 'user registered' };
  }

  async login(data: any) {
    const user = { id: '123', email: data.email };
    const token = 'sdfsdf123123dfsdf';
    return { access_token: token };
  }
}
