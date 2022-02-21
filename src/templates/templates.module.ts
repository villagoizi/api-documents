import { Module } from '@nestjs/common';
import { TemplatesController } from './templates.controller';
import { TemplatesService } from './templates.service';
import { UploadModule } from '../upload/upload.module';
import { NodesModule } from '../nodes/nodes.module';
import { TemplatesFileSystemService } from './providers/templates-fs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BuildDocumentService } from './providers/builder-template.service';
import {
  GeneralTemplate,
  GeneralTemplateSchema,
} from './schema/template.schema';

@Module({
  imports: [
    UploadModule,
    NodesModule,
    MongooseModule.forFeature([
      { name: GeneralTemplate.name, schema: GeneralTemplateSchema },
    ]),
  ],
  controllers: [TemplatesController],
  providers: [
    TemplatesService,
    TemplatesFileSystemService,
    BuildDocumentService,
  ],
  exports: [TemplatesService, TemplatesFileSystemService, BuildDocumentService],
})
export class TemplatesModule {}
