export type BuildDocumentVariables = { uid: string; value: string };

export interface BuildDocumentDto {
  template: string;
  variables: Array<BuildDocumentVariables>;
  hash: string;
}
