import {
  Body,
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentRequest } from './interfaces/document.request';
import { diskStorage } from 'multer';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './dist/temp',
        filename: (req, file, cb) => {
          cb(null, `${file.originalname}`);
        },
      }),
    }),
  )
  buildDocument(@UploadedFile() template: Express.Multer.File, @Body() body) {
    return this.appService.buildDocument(body.variables, template);
  }
}
