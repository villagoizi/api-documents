import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import FormData from 'form-data';
import { UploadService } from './upload/upload.service';
import Docxtemplater from 'docxtemplater';
import { UploadResponse } from './interfaces/upload.response';
import JSZip from 'jszip';

const OUTPUT_PATH = path.join(__dirname, '../../outputs/output.docx');

@Injectable()
export class AppService {
  constructor(private uploaderService: UploadService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async buildDocument(variables: any, idTemplate: string): Promise<boolean> {
    console.log(idTemplate);
    // const content = fs.readFileSync(
    //   path.join(__dirname, `../../templates/tag-example-${idTemplate}.docx`),
    //   'binary',
    // );
    try {
      //   const jszip = new JSZip(content);
      //   const doc = new Docxtemplater(jszip, {
      //     paragraphLoop: true,
      //     linebreaks: true,
      //   });
      //   doc.setData(variables);
      //   doc.render();
      //   const buf = doc.getZip().generate({ type: 'nodebuffer' });
      // fs.writeFileSync(OUTPUT_PATH, buf, 'utf-8');
      // const upload = (await this.upload(OUTPUT_PATH)) as unknown;
      // const hash = this._parseName(upload as UploadResponse);
      // TODO: send hash to normalizador.
    } catch (error) {
      return false;
    }
    // TODO: Generate services to send hash to normalizador
    return true;
  }

  async upload(filepath: string) {
    let result;
    try {
      // TODO: ver como enviar todo un archivo directamente.
      // result = await this.uploaderService.upload(filepath);
    } catch (error) {
      throw error;
    }
    return result;
  }

  //TODO: armar un type para la respuesta.
  private _parseName(data: UploadResponse) {
    const { hash, extension } = data;
    return `${hash}${extension}`;
  }
}
