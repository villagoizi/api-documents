export type FieldGroupSchema = {
  title: string;
  fields: Array<FieldSchema>;
};
export type FieldSchema = { name: string; uid: string };

export interface FillNode {
  groups: Array<FieldGroupSchema>;
}
