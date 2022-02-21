import { Body, Controller, Get, Post } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AddTemplateNode } from 'src/nodes/dto/add-template-node.dto';
import { BuildDocumentDto } from './dtos/build-document.dto';
import { TemplatesService } from './templates.service';
import { CreateTemplateDto } from './dtos/create-template.dto';

@Controller()
export class TemplatesController {
  constructor(private readonly service: TemplatesService) {}

  @MessagePattern('templates:create')
  buildDocument(@Body() body: CreateTemplateDto) {
    return this.service.create(body);
  }

  @MessagePattern('templates:getAll')
  getAllTemplates() {
    return this.service.findAll();
  }

  @MessagePattern('templates:update')
  updateTemplate(@Body() body: CreateTemplateDto & { template: string }) {
    return this.service.update(body);
  }

  @MessagePattern('templates:setup')
  setupTemplate(@Body() body: AddTemplateNode) {
    return this.service.setupTemplate(body);
  }
}
