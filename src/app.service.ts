import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import FormData from 'form-data';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async upload(filepath: string) {
    const url = '/upload';
    let result;
    const name = path.basename(filepath);
    try {
      const form = new FormData();
      form.append('file', fs.createReadStream(filepath), name);
      const uploadResponse = await APIClient.post(url, form, { headers: form.getHeaders() });
      result = axiosHelper.handleResponse(url, uploadResponse);
    } catch (error) {
      result = axiosHelper.handleError(url, error);
      console.log(error);
    }
    if (!result.success) {
      return false;
    }
    return result.payload;
  }
  }
}
