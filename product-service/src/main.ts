import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PRODUCT_QUEUE } from './common/constants';
import { MicroserviceValidationPipe } from './common/pipes/validation.pipe';
import { MongoExceptionFilter } from './common/filters/mongo-exception.filter';
import { MongooseCastFilter } from './common/filters/mongoose-cast.filter';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@rabbitmq-mb:5672'],
      queue: PRODUCT_QUEUE,
      queueOptions: {
        durable: true,
      },
    },
  });

  app.useGlobalPipes(MicroserviceValidationPipe);


  app.useGlobalFilters(
    new MongoExceptionFilter(),
    new MongooseCastFilter(),
    new AllExceptionsFilter(),
  );


  await app.listen();
  console.log(`Product microservice is running...`);
}
bootstrap();
