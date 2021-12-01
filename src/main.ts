import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: process.env.APP_HOST,
        port: +process.env.APP_PORT,
      },
    },
  );
  app
    .listen()
    .then(() =>
      console.log(
        `Microservice api-document running in http://${process.env.APP_HOST}:${process.env.APP_PORT}`,
      ),
    );
}
bootstrap();