import { Injectable, Logger } from '@nestjs/common';
import { UploadFileDto } from '../interfaces/upload.response';
import { BuildDocumentDto } from './dtos/build-document.dto';
import { UploadService } from '../upload/upload.service';
import { NodesService } from '../nodes/nodes.service';
import { AddTemplateNode } from 'src/nodes/dto/add-template-node.dto';
import { CreateTemplateDto } from './dtos/create-template.dto';
import { TemplatesFileSystemService } from './providers/templates-fs.service';
import { BuildDocumentService } from './providers/builder-template.service';
import { InjectModel } from '@nestjs/mongoose';
import {
  GeneralTemplate,
  GeneralTemplateDocument,
} from './schema/template.schema';
import { Model } from 'mongoose';

@Injectable()
export class TemplatesService {
  private readonly logger = new Logger(TemplatesService.name);
  constructor(
    @InjectModel(GeneralTemplate.name)
    private readonly schema: Model<GeneralTemplateDocument>,
    private readonly uploaderService: UploadService,
    private readonly nodesService: NodesService,
    private readonly templatesFs: TemplatesFileSystemService,
    private readonly buildService: BuildDocumentService,
  ) {}

  async buildDocument(payload: BuildDocumentDto) {
    const { template, hash, variables } = payload;
    const schemaTemplate = await this.findById(template, true);
    const result = await this.buildService.buildDocument(
      variables,
      hash,
      schemaTemplate,
    );
    await this.upload(result);
    return result;
  }

  async setupTemplate(data: AddTemplateNode) {
    let result = {};
    const template = await this.findById(data.template, true);
    if (data.type === 'linked') {
      result = await this.nodesService.addLinkedNode(data);
    }
    if (data.type === 'fill') {
      result = await this.nodesService.addFillNode(data);
    }
    if (!data.type || !['fill', 'linked'].includes(data.type)) {
      throw new Error('Data type invalid');
    }
    const finish = await this.updateTemplate(template.id, {
      ...template,
      document: (result as any)._id,
    });
    return finish;
  }

  async create(data: CreateTemplateDto) {
    const { globalVariables, name, file } = data;
    const { buffer } = file;
    const ext = '.docx';
    const saveFile = await this.templatesFs.saveTemplate(
      Buffer.from(buffer),
      name,
      ext,
    );
    const { path, uid } = saveFile;
    const template = new this.schema({
      globalVariables,
      name,
      path,
      uid,
    });
    await template.save();
    return template;
  }

  async update(data: CreateTemplateDto & { template: string }) {
    const { template, file, ...rest } = data;
    const oldTemplate = await this.findById(template, true);
    const dirTemplate = {
      path: oldTemplate.path,
      uid: oldTemplate.uid,
    };
    if (file) {
      const { buffer } = file;
      const ext = '.docx';
      const saveFile = await this.templatesFs.updateTemplate(
        oldTemplate,
        data,
        ext,
        Buffer.from(buffer),
      );
      dirTemplate.path = saveFile.path;
      dirTemplate.uid = saveFile.uid;
    }
    const update = await this.updateTemplate(oldTemplate.id, {
      ...oldTemplate,
      ...dirTemplate,
      ...rest,
    });
    return update;
  }

  async findById(id: string, launcException = false) {
    try {
      const found = await this.schema.findOne({ _id: id });
      if (!found && launcException) {
        throw new Error("Template doesn't exist");
      }
      return found;
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      const templates = await this.schema.find().populate('document');
      return templates;
    } catch (error) {
      throw error;
    }
  }

  async updateTemplate(id: string, params: Partial<GeneralTemplate>) {
    try {
      const update = await this.schema.findOneAndUpdate({ id }, params, {
        new: true,
      });
      return update;
    } catch (error) {
      throw error;
    }
  }

  async upload(file: UploadFileDto) {
    try {
      return await this.uploaderService.uploadInternal(file);
    } catch (error) {
      throw error;
    }
  }
}
