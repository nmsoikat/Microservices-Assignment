import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AuthController } from './auth.controller';
import { ProductController } from './product.controller';
import { AUTH_QUEUE, AUTH_SERVICE_RMQ, PRODUCT_QUEUE, PRODUCT_SERVICE_RMQ } from './common/constants';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'super_secret_key',
      signOptions: { expiresIn: '15m' },
    }),
    ClientsModule.register([
      {
        name: AUTH_SERVICE_RMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@rabbitmq-mb:5672'],
          queue: AUTH_QUEUE,
          queueOptions: {
            durable: true
          },
        },
      },
      {
        name: PRODUCT_SERVICE_RMQ,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@rabbitmq-mb:5672'],
          queue: PRODUCT_QUEUE,
          queueOptions: {
            durable: true
          },
        },
      },
    ]),
  ],
  controllers: [AuthController, ProductController],
  providers: [],
})
export class AppModule { }
