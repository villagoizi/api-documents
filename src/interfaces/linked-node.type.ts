export type WayCondtions = {
  code: number;
  condition: boolean;
};

type Variables = {
  title: string;
  key: string;
  isBoth?: boolean;
  condition: boolean | null;
};

type Paragrahp = {
  key: string;
  value: string;
  condition: boolean;
};

type Data = {
  question: string;
  variables: Variables[];
  paragraph: Paragrahp[];
};

export type Nodes = {
  next: WayCondtions[];
  code: number;
  data: Data;
  validatePrevious: Array<WayCondtions & { next: number }> | null;
  finish: WayCondtions | null;
};

export interface ILinkedNode {
  groups: Nodes[];
}
