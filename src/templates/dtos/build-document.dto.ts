//Ex: {uid: "KEY_INSIDE_OF_DOCUMENT", value: "replace variable inside the document by it"}
export type BuildDocumentVariables = { uid: string; value: string };

export interface BuildDocumentDto {
  template: string;
  variables: Array<BuildDocumentVariables>;
  hash: string;
}
