import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ArgumentTemplate } from '../interfaces/template.interface';
import {
  TemplateNode,
  TemplateNodeDocument,
} from './schema/template-nodes.schema';
import { Model } from 'mongoose';
import { LinkedNodeService } from './providers/linked-node/linked-node.service';
import { AddTemplateNode } from './dto/add-template-node.dto';
import { ILinkedNode } from '../interfaces/linked-node.type';

@Injectable()
export class NodesService {
  constructor(
    @InjectModel(TemplateNode.name) private model: Model<TemplateNodeDocument>,
    private readonly linkedService: LinkedNodeService,
  ) {}

  async addLinkedNode(data: AddTemplateNode) {
    const { info, template, type } = data;
    const currentTemplate = {
      info: { groups: [] },
      type,
      template,
    };
    const exist = await this.findByTemplate(template);
    const linkedGroups = this.linkedService.process(
      exist ?? (currentTemplate as any),
      info,
    );
    if (exist) {
      return await this.update({ ...exist, info: linkedGroups as ILinkedNode });
    }
    return await this.add({
      ...currentTemplate,
      info: linkedGroups as ILinkedNode,
    });
  }

  async add(params: ArgumentTemplate) {
    try {
      const create = new this.model(params);
      await create.save();
      return create;
    } catch (error) {
      throw error;
    }
  }

  async update(params: Partial<TemplateNode>) {
    try {
      const update = await this.model.findOneAndUpdate(
        { id: (params as any).id },
        params,
        { new: true },
      );
      return update;
    } catch (error) {
      throw error;
    }
  }

  async findByTemplate(template: string) {
    try {
      const found = await this.model.findOne({ template });
      return found;
    } catch (error) {
      throw error;
    }
  }
}
