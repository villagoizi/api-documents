import { CreateFillDto } from './add-fill-node.dto';
import { CreateLinkDto } from './add-linked-node.dto';

type InfoTemplateNode = CreateLinkDto[] | CreateLinkDto | CreateFillDto;

export type AddTemplateNode = {
  type: 'linked' | 'fill';
  info: InfoTemplateNode;
  template: string; //parent template
};
