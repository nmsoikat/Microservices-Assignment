import { ValidationPipe } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export const MicroserviceValidationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    exceptionFactory: (errors) => {
        const formattedErrors = errors.map((err) => {
            const constraints = err.constraints
                ? Object.values(err.constraints)
                : [];

            return {
                field: err.property,
                message: constraints[0]
            };
        });

        return new RpcException({
            success: false,
            message: 'Validation failed',
            errors: formattedErrors,
            code: 'VALIDATION_FAILED'
        });
    },
});