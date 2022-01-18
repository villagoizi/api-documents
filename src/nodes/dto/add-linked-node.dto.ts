import { Nodes, WayCondtions } from '../../interfaces/linked-node.type';
export type CreateDto = Nodes & { prev: WayCondtions[] | null };
export type AddQuestions = { template: string; params: CreateDto };
