import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UploadService {
  constructor(@Inject('UPLOAD_SERVICE') private client: ClientProxy) {}

  async upload(file: Express.Multer.File) {
    const obs = await this.client
      .send<string>('upload:create', file)
      .toPromise();
    return obs;
  }
}
