import { FillNode } from './fill-node.type';
import { ILinkedNode } from './linked-node.type';

export type ArgumentTemplate = {
  type: 'linked' | 'fill';
  info: ILinkedNode | FillNode;
  template: string; //parent template
};

export interface GeneralTemplate {
  name: string;
  uid: string;
  path: string;
  document: ArgumentTemplate; //child arguments
  globalVariables: Array<string>;
}
