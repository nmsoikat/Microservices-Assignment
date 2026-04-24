import {
    CanActivate,
    ExecutionContext,
    Injectable,
} from '@nestjs/common';
import { JsonWebTokenError, JwtService, TokenExpiredError } from '@nestjs/jwt';
import { MicroserviceException } from 'src/common/exceptions/microservice.exception';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();

        const authHeader = req.headers.authorization;
        if (!authHeader) throw new MicroserviceException('No token', 'NO_TOKEN');

        const token = authHeader.split(' ')[1];

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET || 'super_secret_key',
            });

            req.user = payload;

            return true;
        } catch (err) {
            if (err instanceof TokenExpiredError) {
                throw new MicroserviceException('Token expired', 'TOKEN_EXPIRED');
            }

            if (err instanceof JsonWebTokenError) {
                throw new MicroserviceException('Invalid token', 'INVALID_TOKEN');
            }

            throw new MicroserviceException('Unauthorized', 'UNAUTHORIZED');
        }
    }
}