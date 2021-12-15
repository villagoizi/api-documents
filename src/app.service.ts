import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import FormData from 'form-data';
import { UploadService } from './upload/upload.service';
import { UploadResponse } from './interfaces/upload.response';
import * as pizzip from 'pizzip';
import { promisify } from 'util';
// @ts-ignore
const Docxtemplater: any = require('docxtemplater');

const OUTPUT_PATH = path.join(__dirname, '../outputs/output.docx');

@Injectable()
export class AppService {
  constructor(private uploaderService: UploadService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async buildDocument(
    variables: any,
    template: Express.Multer.File,
  ): Promise<string> {
    const content = fs.readFileSync(
      path.join(__dirname, `../${template.path}`),
      'binary',
    );
    const zip = new pizzip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    try {
      doc.setData(JSON.parse(variables));
      doc.render();
      const buf = doc.getZip().generate({ type: 'nodebuffer' });
      fs.writeFileSync(OUTPUT_PATH, buf, 'utf-8');
      this.clearFolderTemp();
      // const upload = (await this.upload(OUTPUT_PATH)) as unknown;
      // const hash = this._parseName(upload as UploadResponse);
      // TODO: send hash to normalizador.
    } catch (error) {
      console.log(error);
      return error;
    }
    // TODO: Generate services to send hash to normalizador
    return (await this.getFile(OUTPUT_PATH)).toString();
  }

  clearFolderTemp() {
    fs.readdir(path.join(__dirname, `/temp`), (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(path.join(__dirname, `/temp`), file), (err) => {
          if (err) throw err;
        });
      }
    });
  }

  async getFile(path: string): Promise<string | Buffer> {
    const readFile = promisify(fs.readFile);
    return readFile(path, 'utf8');
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
