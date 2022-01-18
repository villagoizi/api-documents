import { Injectable } from '@nestjs/common';
import { LinkedNodeDocument, LinkedNode } from '../../schema/linked.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import {
  ILinkedNode,
  WayCondtions,
} from '../../../interfaces/linked-node.type';
import { TemplateNode } from '../../schema/template-nodes.schema';
import { Nodes } from '../../../interfaces/linked-node.type';
import { CustomLinked } from './custom-linked.class';
import { CreateDto } from '../../dto/add-linked-node.dto';

@Injectable()
export class LinkedNodeService {
  temp: Map<string, ILinkedNode[]> = new Map();
  constructor(
    @InjectModel(LinkedNode.name) private model: Model<LinkedNodeDocument>,
  ) {}

  add(template: TemplateNode, params: CreateDto) {
    const instance = new CustomLinked();
    instance.poblate(template.info.groups as Nodes[]);
    const result = instance.add(params);
    return { groups: result };
  }

  addBulk(template: TemplateNode, params: CreateDto[]) {
    let temp = template;
    params.forEach((v) => {
      const groups = this.add(temp, v);
      (temp.info as any).groups = groups;
    });
    return { groups: temp.info.groups };
  }

  getAll() {}
}
