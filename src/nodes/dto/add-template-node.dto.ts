import { CreateDto } from './add-linked-node.dto';

export type AddTemplateNode = {
  type: 'linked' | 'fill';
  info: CreateDto[];
  template: string; //parent template
};
