import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoaderModule } from './loader/loader.module';

@Module({
  imports: [LoaderModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
