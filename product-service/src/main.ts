import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PRODUCT_QUEUE } from './common/constants';

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

  await app.listen();
  console.log(`Product microservice is running...`);
}
bootstrap();
