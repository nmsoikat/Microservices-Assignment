import { Catch, ExceptionFilter } from '@nestjs/common';
import { MongoServerError } from 'mongodb';
import { MicroserviceException } from '../exceptions/microservice.exception';

@Catch(MongoServerError)
export class MongoExceptionFilter implements ExceptionFilter {
    catch(exception: MongoServerError) {
        if (exception.code === 11000) {
            return new MicroserviceException('Duplicate key error', 'DUPLICATE_KEY');
        }

        return new MicroserviceException(exception.message, 'MONGO_ERROR');
    }
}