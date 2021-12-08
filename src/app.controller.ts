import { Controller, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { DocumentRequest } from './interfaces/document.request';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  buildDocument(request: DocumentRequest) {
    return this.appService.buildDocument(request.variables, 'entro al archivo');
  }
}
