import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AUTH_QUEUE } from './common/constants';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';
import { MongooseCastFilter } from './common/filters/mongoose-cast.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { MicroserviceValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: ['amqp://guest:guest@rabbitmq-mb:5672'],
        queue: AUTH_QUEUE,
        queueOptions: {
          durable: true,
        },
      },
    },
  );

  app.useGlobalPipes(MicroserviceValidationPipe);


  app.useGlobalFilters(
    new MongoExceptionFilter(),
    new MongooseCastFilter(),
    new AllExceptionsFilter(),
  );


  await app.listen();
  console.log('Auth microservice is listening...');
}

bootstrap();