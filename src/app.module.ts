import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { TemplatesModule } from './templates/templates.module';

@Module({
  imports: [ConfigModule.forRoot(), UploadModule, TemplatesModule],
})
export class AppModule {}
