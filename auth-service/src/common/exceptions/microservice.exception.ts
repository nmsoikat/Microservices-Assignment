import { RpcException } from '@nestjs/microservices';

export class MicroserviceException extends RpcException {
    constructor(message: string, code = 'ERROR') {
        super({
            success: false,
            message,
            code
        });
    }
}