import { Catch, ExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let code = 'ERROR';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const res = exception.getResponse() as any;
            message = res.message || exception.message;
            code = res.code || 'HTTP_ERROR';

        } else if (exception instanceof RpcException || (exception.message && exception.success === false)) {
            const error = exception instanceof RpcException ? exception.getError() : exception;
            const errorObj = typeof error === 'object' ? error : { message: error };

            status = HttpStatus.BAD_REQUEST;
            message = errorObj.message || 'Microservice error';
            code = errorObj.code || 'MICROSERVICE_ERROR';

        } else {
            message = exception?.message || 'Internal server error';
            code = exception?.code || 'INTERNAL_ERROR';
        }

        response.status(status).json({
            success: false,
            message,
            code,
            timestamp: new Date().toISOString(),
        });
    }
}