import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as fsPromises from 'fs/promises';
import { UploadResponse, UploadFileDto } from '../interfaces/upload.response';
import * as pizzip from 'pizzip';
import { promisify } from 'util';
import {
  GeneralSchema,
  TemplatesAvailables,
} from '../interfaces/document.request';
import { BuildDocumentDto } from './dtos/build-document.dto';
const templates: GeneralSchema[] = JSON.parse(
  fs
    .readFileSync(path.join(__dirname, '/../../schemas/', 'templates.json'))
    .toString(),
);
const dirTemplates = path.join(__dirname, '/../../templates');

// @ts-ignore
const Docxtemplater: any = require('docxtemplater');
// import Docxtemplater from 'docxtemplater';
import { UploadService } from '../upload/upload.service';

const DIST = path.join(__dirname, `../`);
const OUTPUT_FOLDER = path.join(__dirname, '../outputs');

@Injectable()
export class TemplatesService {
  private readonly logger = new Logger(TemplatesService.name);
  private variablesTemplate: Map<TemplatesAvailables, GeneralSchema['groups']>;
  constructor(private readonly uploaderService: UploadService) {
    this.variablesTemplate = new Map();
    templates.forEach((v) => this.variablesTemplate.set(v.id, v.groups));
  }

  getAllTemplates() {
    return templates;
  }

  async buildDocument(payload: BuildDocumentDto) {
    const { template, variables, hash } = payload;
    const isValidTemplate = this._validateTemplate(template);
    if (!isValidTemplate) throw new Error('Invalid Template');
    const hasVariables = this._validateVariables(template, variables);
    if (!hasVariables) throw new Error('Invalid Variables');
    const content = await fsPromises.readFile(
      path.resolve(dirTemplates, `${template}.docx`),
      'binary',
    );
    const zip = new pizzip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    const parserVariables = this._parserVariables(variables);
    await doc.setData(parserVariables);
    await doc.render();
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    const base64 = Buffer.from(buffer).toString('base64');
    const upload = await this.upload({
      base64,
      name: `${template}-${hash}-${Date.now()}.docx`,
      typeFile: '.docx',
    });
    return { base64, upload };
  }

  private _validateTemplate(template: TemplatesAvailables) {
    return this.variablesTemplate.has(template);
  }

  private _validateVariables(
    template: TemplatesAvailables,
    variables: BuildDocumentDto['variables'],
  ) {
    const groups = this.variablesTemplate.get(template);
    const requireds = groups.reduce((acc, v) => {
      v.fields.forEach((v) => (acc = [...acc, v.id]));
      return acc;
    }, []);
    const isValid = variables.every(
      (v) => requireds.includes(v.id) && !!v.value?.trim(),
    );
    return isValid;
  }

  private _parserVariables(variables: BuildDocumentDto['variables']) {
    return variables.reduce((acc, v) => {
      acc[v.id] = v.value;
      return acc;
    }, {});
  }

  //   async buildDocument(
  //     variables: any,
  //     template: Express.Multer.File,
  //   ): Promise<string> {
  //     const OUTPUT_PATH = path.join(
  //       __dirname,
  //       `../outputs/${template.originalname}`,
  //     );
  //     const content = fs.readFileSync(`${DIST}${template.path}`, 'binary');
  //     const zip = new pizzip(content);
  //     const doc = new Docxtemplater(zip, {
  //       paragraphLoop: true,
  //       linebreaks: true,
  //     });
  //     try {
  //       doc.setData(JSON.parse(variables));
  //       doc.render();
  //       const buf = doc.getZip().generate({ type: 'nodebuffer' });
  //       fs.writeFileSync(OUTPUT_PATH, buf, 'utf-8');
  //       this.clearFolderTemp(path.join(__dirname, `/temp`));
  //       // const upload = (await this.upload(OUTPUT_PATH)) as unknown;
  //       // const hash = this._parseName(upload as UploadResponse);
  //       // TODO: send hash to normalizador.
  //     } catch (error) {
  //       this.logger.error(error);
  //       return error;
  //     }
  //     // TODO: Generate services to send hash to normalizador
  //     this.logger.log(`archivo ${template.originalname} generado. `);
  //     return (await this.getFile(OUTPUT_PATH)).toString();
  //   }

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

  async upload(file: UploadFileDto) {
    try {
      return await this.uploaderService.uploadInternal(file);
      // result = await this.uploaderService.upload(filepath);
    } catch (error) {
      throw error;
    }
  }

  //TODO: armar un type para la respuesta.
  // private _parseName(data: UploadResponse) {
  //   const { hash, extension } = data;
  //   return `${hash}${extension}`;
  // }
}
