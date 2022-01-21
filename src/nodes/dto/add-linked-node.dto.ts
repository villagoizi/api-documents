import { Nodes, WayCondtions } from '../../interfaces/linked-node.type';
export type CreateDto = {
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

export type AddQuestions = { template: string; params: CreateDto };
