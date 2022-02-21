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
import { CreateLinkDto } from '../../dto/add-linked-node.dto';

type Priority = {
  [key in 'c' | 'u' | 'i' | 'r']: {
    process: Array<
      Nodes & {
        prev: WayCondtions[] | null;
      }
    >;
    p: number;
  };
};

@Injectable()
export class LinkedNodeService {
  temp: Map<string, ILinkedNode[]> = new Map();
  constructor(
    @InjectModel(LinkedNode.name) private model: Model<LinkedNodeDocument>,
  ) {}

  process(template: TemplateNode, params: CreateLinkDto[] | CreateLinkDto) {
    const priority: Priority = {
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
    const temp = Object.assign({}, template);
    const isListParams = Array.isArray(params);
    if (isListParams) {
      params.forEach((v) => {
        this._setPriority(priority, v.operation, v.data);
      });
    } else {
      this._setPriority(priority, params.operation, params.data);
    }
    Object.values(priority)
      .sort((a, b) => a.p - b.p)
      .forEach((v) => {
        temp.info.groups = this._processGroups(
          v,
          instance,
          template.info.groups as Nodes[],
        );
      });

    return { groups: temp.info.groups };
  }

  private _processGroups(
    v: {
      process: Array<
        Nodes & {
          prev: WayCondtions[] | null;
        }
      >;
      p: number;
    },
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

  private _setPriority(
    priority: Priority,
    operation: CreateLinkDto['operation'],
    data: CreateLinkDto['data'],
  ) {
    if (Array.isArray(data)) {
      priority[operation].process = [...priority[operation].process, ...data];
      return;
    }
    priority[operation].process.push(data);
    return;
  }
}
