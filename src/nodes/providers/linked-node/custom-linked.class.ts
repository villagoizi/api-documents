import { Nodes } from '../../../interfaces/linked-node.type';
import { CreateDto } from '../../dto/add-linked-node.dto';

export class CustomLinked {
  data: Array<Nodes> = [];
  constructor() {}

  poblate(data: Array<Nodes> = []) {
    this.data = data;
  }

  private exist(code: number) {
    const index = this.data.findIndex((v) => v.code === code);
    return index;
  }

  private update(code: number, node: Nodes) {
    const index = this.exist(code);
    if (index === -1) return;
    this.data = [
      ...this.data.filter((v) => v.code !== code && v.data !== node.data),
      node,
    ];
  }

  private get(code: number) {
    return this.data.find((v) => v.code === code);
  }

  private sort<T = Nodes>(data = [], key = null): T[] {
    if (key === 'asc') return data.sort((a, b) => a.code - b.code);
    return data.sort((a, b) => b.code - a.code);
  }

  add(params: CreateDto) {
    let { prev, next, code } = params;
    this.validatePositions(params);
    if (this.exist(code) > -1) {
      const node = this.get(code);
      //First position
      if (!prev && next) {
        this.findAndModifyNext(node);
      }
      //Between position
      if (prev && next) {
        this.findAndModifyPrev(node, prev);
      }
    }
    this.insert(params);
    return this.data;
  }

  private insert(node) {
    this.data.push(node);
  }

  private validatePositions(params) {
    const { prev, next } = params;
    if (!prev && !next)
      throw new Error(
        'Invalid positions, it should have a prev or next values',
      );
  }

  private regretion(nodes: Nodes['next'], currentNode = null) {
    const temp = [];
    if (currentNode) {
      temp.push(currentNode);
    }
    nodes.forEach((v) => {
      const nextNode = this.get(v.code);
      if (!nextNode) return temp;
      if (temp.find((t) => t.code == nextNode.code)) return temp;
      temp.push(nextNode);
      if (nextNode.next?.length) {
        return this.regretion(nextNode.next);
      }
    });
    return temp;
  }

  private findAndModifyNext(node: Nodes) {
    const nodes = this.regretion(node.next, node);
    const sort = this.sort(nodes);
    sort.forEach((v) => {
      this.update(v.code, {
        ...v,
        code: v.code + 1,
        next: v.next ? v.next.map((n) => ({ ...n, code: n.code + 1 })) : null,
        validatePrevious: this.modifyPrevious(sort, v.code),
      });
    });
  }

  private findAndModifyPrev(node: Nodes, prev: CreateDto['prev']) {
    const replaceNode = this.get(node.code - 1);
    replaceNode.next = prev;
    this.findAndModifyNext(node);
  }

  private modifyPrevious(modify: Nodes[], code: number) {
    const exist = modify.find((v) => v.code === code);
    if (!exist) return null;
    return exist.validatePrevious.map((v) => {
      if (v.code === code) return { ...v, code: v.code + 1 };
      return v;
    });
  }
}
