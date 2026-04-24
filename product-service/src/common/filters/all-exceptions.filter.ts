import { Catch, ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any) {
        if (exception?.name === 'CastError') {
            return {
                success: false,
                message: 'Invalid ObjectId'
            };
        }

        if (exception instanceof RpcException) {
            return exception.getError();
        }

        return {
            success: false,
            message: exception?.message || 'Internal server error',
            code: exception?.code || 'ERROR'
        };
    }
}