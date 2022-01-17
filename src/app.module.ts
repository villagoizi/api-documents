import { Module } from '@nestjs/common';
import { UploadModule } from './upload/upload.module';
import { ConfigModule } from '@nestjs/config';
import { TemplatesModule } from './templates/templates.module';
import { NodesModule } from './nodes/nodes.module';

@Module({
  imports: [ConfigModule.forRoot(), UploadModule, TemplatesModule, NodesModule],
})
export class AppModule {}
