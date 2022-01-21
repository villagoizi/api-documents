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

  process(template: TemplateNode, params: CreateDto[] | CreateDto) {
    const priority = {
      c: {
        process: [],
        p: 1,
      },
      u: {
        process: [],
        p: 2,
      },
      i: {
        process: [],
        p: 3,
      },
      r: {
        process: [],
        p: 4,
      },
    };
    const instance = new CustomLinked();
    instance.poblate(template.info.groups as Nodes[]);
    console.log(instance.mapData, 'CURRENT GROUP');
    const temp = template;
    if (Array.isArray(params)) {
      params.forEach((v) => {
        this._setPriority(priority, v.operation, v.data);
      });
      Object.values(priority)
        .sort((a, b) => a.p - b.p)
        .forEach((v) => {
          (temp.info as any).groups = this._processGroups(
            v,
            instance,
            template.info.groups as Nodes[],
          );
        });
    } else {
      priority[params.operation].process.push(params.data);
      (temp.info as any).groups = this._processGroups(
        priority[params.operation],
        instance,
        template.info.groups as Nodes[],
      );
    }
    return { groups: temp.info.groups };
  }

  private _processGroups(
    v: { p: number; process: Array<Nodes & { prev: WayCondtions[] }> },
    instance: CustomLinked,
    initialGroup: Nodes[],
  ) {
    let groups = initialGroup;
    if (v.p === 1) {
      v.process.forEach((v) => (groups = instance.create(v)));
    }
    if (v.p === 2) {
      v.process.forEach((v) => (groups = instance.update(v.code, v)));
    }
    if (v.p === 3) {
      v.process.forEach((v) => (groups = instance.insert(v)));
    }
    if (v.p === 4) {
      v.process.forEach((v) => (groups = instance.remove(v.code)));
    }
    return groups;
  }

  private _setPriority(priority, operation, data) {
    if (priority[operation].length) {
      Array.isArray(data)
        ? (priority[operation].process = [
            ...priority[operation].process,
            ...data,
          ])
        : [...priority[operation].process, data];
      return;
    }
    priority[operation].process = Array.isArray(data) ? data : [data];
  }
}
