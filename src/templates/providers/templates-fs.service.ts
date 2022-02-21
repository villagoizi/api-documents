import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fsP from 'fs/promises';
import * as fs from 'fs';
import slugify from 'slugify';
import { nanoid } from 'nanoid';
import { GeneralTemplate } from '../schema/template.schema';

@Injectable()
export class TemplatesFileSystemService {
  private pathfiles: string;
  constructor() {
    this.pathfiles = path.join(__dirname, '/../../../templates');
  }
  async onModuleInit() {
    const exist = fs.existsSync(this.pathfiles);
    if (!exist) {
      await fsP.mkdir(this.pathfiles);
    }
  }

  private async writeTemplate(data: Buffer, filename: string) {
    await fsP.writeFile(path.join(this.pathfiles, filename), data);
  }

  async saveTemplate(data: Buffer, filename: string, ext: string) {
    const path = this.pathfiles;
    const uid = slugify(filename, {
      lower: false,
      strict: true,
      trim: true,
    });
    const customName = `${uid}-${nanoid(10)}`;
    await this.writeTemplate(data, customName.toUpperCase() + ext);
    return {
      path,
      uid: customName.toUpperCase(),
    };
  }

  async updateTemplate(
    schema: GeneralTemplate,
    params: Partial<GeneralTemplate>,
    ext: string,
    data: Buffer,
  ) {
    const { path: pathFile, uid } = schema;
    const filepath = path.join(pathFile, uid + ext);
    const exist = fs.existsSync(filepath);
    if (exist) {
      await fsP.unlink(filepath);
    }
    let customName = schema.uid;
    if (params?.name !== schema.name) {
      const uid = slugify(params.name, {
        lower: false,
        strict: true,
        trim: true,
      });
      customName = `${uid}-${nanoid(10)}`;
    }
    await this.writeTemplate(data, customName.toUpperCase() + ext);
    return {
      path: this.pathfiles,
      uid: customName.toUpperCase(),
    };
  }

  async getTemplate(template: GeneralTemplate, ext: string) {
    const { path: pathFile, uid } = template;
    const filename = uid + ext;
    const file = await fsP.readFile(path.join(pathFile, filename), {
      encoding: 'binary',
    });
    return file;
  }
}
