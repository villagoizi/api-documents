import {
  Variables,
  TemplatesAvailables,
} from '../../interfaces/document.request';
export type BuildDocumentVariables = { id: Variables; value: string };

export interface BuildDocumentDto {
  template: TemplatesAvailables;
  variables: Array<BuildDocumentVariables>;
  hash: string;
}
