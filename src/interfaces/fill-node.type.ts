type FieldGroupSchema = {
  title: string;
  fields: Array<FieldSchema>;
};
type FieldSchema = { name: string; id: string };

export interface FillNode {
  groups: Array<FieldGroupSchema>;
}
