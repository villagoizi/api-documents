import { Injectable } from '@nestjs/common';
import * as pizzip from 'pizzip';
import { BuildDocumentDto } from '../dtos/build-document.dto';
import { GeneralTemplate } from '../schema/template.schema';
import { TemplatesFileSystemService } from './templates-fs.service';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
const Docxtemplater = require('docxtemplater');

@Injectable()
export class BuildDocumentService {
  constructor(
    private readonly templatesFsService: TemplatesFileSystemService,
  ) {}

  async buildDocument(
    payload: BuildDocumentDto['variables'],
    hash: string,
    schema: GeneralTemplate,
  ) {
    if (!payload.length) {
      throw new Error(
        'Variables must be a instance of Object with properties [id doc template]: value',
      );
    }
    const parserVariables = this._validateAndMapVariables(schema, payload);
    const content = await this.templatesFsService.getTemplate(schema, '.docx');
    const zip = new pizzip(content);
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    await doc.setData(parserVariables);
    await doc.render();
    const buffer = doc.getZip().generate({ type: 'nodebuffer' });
    const base64 = Buffer.from(buffer).toString('base64');
    return {
      base64,
      name: `${schema.uid}-${hash}-${Date.now()}.docx`,
      typeFile: '.docx',
    };
  }

  private _validateAndMapVariables(
    schema: GeneralTemplate,
    variables: BuildDocumentDto['variables'],
  ) {
    const parserVariables = {};
    const keys = variables.map((v) => v.uid);
    schema.globalVariables.forEach((g) => {
      if (!keys.includes(g)) {
        throw new Error(`Invalid variable ${JSON.stringify(g)}`);
      }
      variables.forEach((v) => {
        !v[g]
          ? (parserVariables[v.uid] = '')
          : (parserVariables[v.uid] = v.value);
      });
    });
    return parserVariables;
  }
}
