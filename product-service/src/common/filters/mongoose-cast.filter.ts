import { Catch, ExceptionFilter } from '@nestjs/common';
import { Error as MongooseError } from 'mongoose';
import { MicroserviceException } from '../exceptions/microservice.exception';

@Catch(MongooseError.CastError)
export class MongooseCastFilter implements ExceptionFilter {
    catch() {
        return new MicroserviceException('Invalid ObjectId', 'INVALID_OBJECT_ID');
    }
}