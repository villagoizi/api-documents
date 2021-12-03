import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000, () =>
    console.log(
      `Microservice api-gateway running http://${process.env.APP_HOST}:${process.env.APP_PORT}`,
    ),
  );
}
bootstrap();
