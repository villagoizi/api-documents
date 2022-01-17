import { FillNode } from './fill-node.type';
import { LinkedNode } from './linked-node.type';

export type ArgumentTemplate = {
  type: 'linked' | 'fill';
  arguments: LinkedNode | FillNode;
  template: string; //parent template
};

export interface GeneralTemplate {
  name: string;
  uid: string;
  path: string;
  document: ArgumentTemplate; //child arguments
  globalVariables: Array<string>;
}
