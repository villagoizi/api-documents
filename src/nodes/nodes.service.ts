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
    let currentTemplate = {
      info: { groups: [] },
      type,
      template,
    };
    const exist = await this.findByTemplate(template);
    const linkedGroups = this.linkedService.addBulk(
      exist ?? (currentTemplate as any),
      info,
    );
    const templateNode = await this.add({
      ...currentTemplate,
      info: linkedGroups as ILinkedNode,
    });
    return templateNode;
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

  async findByTemplate(template: string) {
    try {
      const found = await this.model.findOne({ template });
      return found;
    } catch (error) {
      throw error;
    }
  }
}
