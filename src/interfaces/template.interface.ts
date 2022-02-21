import { FillNode } from './fill-node.type';
import { ILinkedNode } from './linked-node.type';

export type IArgumentTemplate = {
  type: 'linked' | 'fill';
  info: ILinkedNode | FillNode;
  template: string; //parent template
};

export interface IGeneralTemplate {
  name: string;
  uid: string;
  path: string;
  document: IArgumentTemplate; //child arguments
  globalVariables: Array<string>;
}
