import { Catch, ExceptionFilter } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any) {
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