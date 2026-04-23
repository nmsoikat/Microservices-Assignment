import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AUTH_QUEUE } from './common/constants';

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

  await app.listen();
  console.log('Auth microservice is listening...');
}

bootstrap();