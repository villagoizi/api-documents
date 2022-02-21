import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IArgumentTemplate } from '../interfaces/template.interface';
import {
  TemplateNode,
  TemplateNodeDocument,
} from './schema/template-nodes.schema';
import { Model } from 'mongoose';
import { LinkedNodeService } from './providers/linked-node/linked-node.service';
import { AddTemplateNode } from './dto/add-template-node.dto';
import { ILinkedNode } from '../interfaces/linked-node.type';
import { FillNodeService } from './providers/fill-node/fill-node.service';
import { CreateLinkDto } from './dto/add-linked-node.dto';
import { CreateFillDto } from './dto/add-fill-node.dto';

@Injectable()
export class NodesService {
  constructor(
    @InjectModel(TemplateNode.name) private model: Model<TemplateNodeDocument>,
    private readonly linkedService: LinkedNodeService,
    private readonly fillService: FillNodeService,
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
      info as CreateLinkDto | CreateLinkDto[],
    );
    if (exist) {
      return await this.update({ ...exist, info: linkedGroups as ILinkedNode });
    }
    return await this.add({
      ...currentTemplate,
      info: linkedGroups as ILinkedNode,
    });
  }

  async addFillNode(data: AddTemplateNode) {
    const { info, template, type } = data;
    const currentTemplate = {
      info: { groups: [] },
      type,
      template,
    };
    const exist = await this.findByTemplate(template);
    const fillGroups = this.fillService.process(info as CreateFillDto);
    if (exist) {
      return await this.update({ ...exist, info: fillGroups });
    }
    return await this.add({
      ...currentTemplate,
      info: fillGroups,
    });
  }

  async add(params: IArgumentTemplate) {
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
