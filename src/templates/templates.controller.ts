import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AddTemplateNode } from 'src/nodes/dto/add-template-node.dto';
import { BuildDocumentDto } from './dtos/build-document.dto';
import { TemplatesService } from './templates.service';

@Controller()
export class TemplatesController {
  constructor(private readonly service: TemplatesService) {}

  @MessagePattern('templates:create')
  buildDocument(@Body() body: BuildDocumentDto) {
    return this.service.buildDocument(body);
  }

  @MessagePattern('templates:getAll')
  getAllTemplates() {
    return this.service.getAllTemplates();
  }

  @MessagePattern('templates:setup')
  addTemplate(@Body() body: AddTemplateNode) {
    return this.service.setupTemplate(body);
  }
}
