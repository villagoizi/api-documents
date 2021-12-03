import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import FormData from 'form-data';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
