import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { UploadFileDto, UploadResponse } from '../interfaces/upload.response';

@Injectable()
export class UploadService {
  constructor(@Inject('UPLOAD_SERVICE') private client: ClientProxy) {}

  async uploadInternal(file: UploadFileDto) {
    const obs = await this.client
      .send<UploadResponse>('upload:createInternal', file)
      .toPromise();
    return obs;
  }
}
