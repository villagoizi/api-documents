import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { UploadResponse } from './interfaces/upload.response';
import * as pizzip from 'pizzip';
import { promisify } from 'util';
// @ts-ignore
const Docxtemplater: any = require('docxtemplater');

const DIST = path.join(__dirname, `../`);
const OUTPUT_FOLDER = path.join(__dirname, '../outputs');

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  async buildDocument(
    variables: any,
    template: Express.Multer.File,
  ): Promise<string> {
    const OUTPUT_PATH = path.join(
      __dirname,
      `../outputs/${template.originalname}`,
    );
    const content = fs.readFileSync(`${DIST}${template.path}`, 'binary');
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
      this.clearFolderTemp(path.join(__dirname, `/temp`));
      // const upload = (await this.upload(OUTPUT_PATH)) as unknown;
      // const hash = this._parseName(upload as UploadResponse);
      // TODO: send hash to normalizador.
    } catch (error) {
      this.logger.error(error);
      return error;
    }
    // TODO: Generate services to send hash to normalizador
    this.logger.log(`archivo ${template.originalname} generado. `);
    return (await this.getFile(OUTPUT_PATH)).toString();
  }

  async getFile(path: string): Promise<string | Buffer> {
    const readFile = promisify(fs.readFile);
    const file = readFile(path, 'utf8');
    this.clearFolderTemp(OUTPUT_FOLDER);
    return file;
  }

  clearFolderTemp(folder: string) {
    fs.readdir(folder, (err, files) => {
      if (err) throw err;

      for (const file of files) {
        fs.unlink(path.join(folder, file), (err) => {
          if (err) throw err;
        });
      }
    });
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
