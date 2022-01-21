import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { UploadModule } from '../upload/upload.module';
import { NodesModule } from '../nodes/nodes.module';

@Module({
  imports: [UploadModule, NodesModule],
  controllers: [TemplatesController],
  providers: [TemplatesService],
  exports: [TemplatesService],
})
export class TemplatesModule {}
