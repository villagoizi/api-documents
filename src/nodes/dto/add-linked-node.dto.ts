import { Nodes, WayCondtions } from '../../interfaces/linked-node.type';
export type CreateLinkDto = {
  data:
    | Array<
        Nodes & {
          prev: WayCondtions[] | null;
        }
      >
    | (Nodes & {
        prev: WayCondtions[] | null;
      });
  operation: 'u' | 'i' | 'c' | 'r';
};
