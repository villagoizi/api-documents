import { Nodes, WayCondtions } from '../../../interfaces/linked-node.type';

export class CustomLinked {
  data: Array<Nodes>;
  mapData: Map<number, Nodes>;
  constructor() {
    this.data = [];
    this.mapData = new Map();
  }

  poblate(data: Array<Nodes> = []) {
    if (data.length) {
      this.sort(data, 'asc').forEach((v) => {
        this.mapData.set(v.code, { ...v });
      });
      this.data = [...this.mapData].map(([code, value]) => value);
    }
  }

  create(node: Nodes & { prev: WayCondtions[] }) {
    if (this.exist(node.code))
      throw new Error(
        `Code exist, should be unique or the operation should be 'i': ${node.code}`,
      );
    if (node?.prev) {
      this._modifyPrev(node);
      delete node.prev;
    }
    this._setValue(node);
    return this.mapValues();
  }

  update(code: number, node: Nodes & { prev: WayCondtions[] }) {
    if (!this.exist(code)) throw new Error(`Code not found: ${code}`);
    this._setValue({ ...node, code });
    return this.mapValues();
  }

  remove(code: number) {
    if (!this.exist(code)) throw new Error(`Code not found: ${code}`);
    const node = this.get(code);
    const temp: Nodes[] = [];
    this.data.forEach((v) => {
      if (v.next) {
        const has = v.next.find((n) => n.code === node.code);
        if (has) temp.push(v);
      }
    });
    temp.forEach((v) => {
      const next = v.next.map((v) => {
        if (v.code - 1 > 0 && v.code === code) {
          return { ...v, code: v.code - 1 };
        }
        return v;
      });
      this.mapData.set(v.code, { ...v, next });
    });
    this.mapData.delete(code);
    return this.mapValues();
  }

  insert(node: Nodes & { prev: WayCondtions[] }) {
    this.validatePositions(node);
    this.findAndModifyNext(node);
    return this.mapValues();
  }

  private _setValue(node: (Nodes & { prev: WayCondtions[] }) | Nodes) {
    if ((node as any)?.prev) {
      delete (node as any)?.prev;
    }
    this.mapData.set(node.code, node);
  }
  private _modifyPrev(node: Nodes & { prev: WayCondtions[] }) {
    node.prev.forEach((v) => {
      if (!this.exist(v.code)) return;
      const nodeFound = this.mapData.get(v.code) as Nodes & {
        prev: WayCondtions[];
      };
      const next = nodeFound.next.find((n) => n.condition === v.condition);
      if (next) {
        this.update(v.code, {
          ...nodeFound,
          next: [
            ...nodeFound.next.filter((nn) => nn.code !== next.code),
            { ...next, code: node.code },
          ],
        });
      }
    });
  }

  private mapValues() {
    return this.sort(
      [...this.mapData.values()].map((value) => {
        if ((value as any)?.prev) {
          delete (value as any)?.prev;
        }
        return value;
      }),
      'asc',
    );
  }

  private exist(code: number) {
    return this.mapData.has(code);
  }

  private get(code: number) {
    return this.mapData.get(code);
  }

  private sort<T = Nodes>(data = [], key = null): T[] {
    if (key === 'asc') return data.sort((a, b) => a.code - b.code);
    return data.sort((a, b) => b.code - a.code);
  }

  private validatePositions(params) {
    const { prev, next } = params;

    if (!prev && !next && this.data.length)
      throw new Error(
        'Invalid positions, it should have a prev or next values',
      );
  }

  private findAndModifyNext(node: Nodes & { prev: WayCondtions[] }) {
    const temp: Array<{ old: Nodes; new: Nodes }> = [];
    const nodesIncrease = this.regretion(node, temp);
    if (nodesIncrease.length) {
      nodesIncrease.forEach((v) => {
        this.mapData.set(v.new.code, v.new);
        this.modifyNext(v.old, v.new);
        this.modifyPrevious(v.old, v.new);
      });
    }
    this._setValue(node);
  }
  private regretion(
    node: Nodes,
    temp: Array<{ old: Nodes; new: Nodes }> = [],
  ): Array<{ old: Nodes; new: Nodes }> {
    if (!this.exist(node.code)) return temp;
    const nodeToModify = this.get(node.code);
    temp.push({
      old: nodeToModify,
      new: { ...nodeToModify, code: nodeToModify.code + 1 },
    });
    if (this.exist(nodeToModify.code + 1))
      return this.regretion(this.get(nodeToModify.code + 1), temp);
    return temp;
  }

  private modifyNext(oldNode: Nodes, newNode: Nodes) {
    const currentNodes = this.mapValues();
    currentNodes.forEach((v) => {
      this._forEachNext(v, { oldNode, newNode });
    });
  }

  private modifyPrevious(oldNode: Nodes, newNode: Nodes) {
    const currentNodes = this.mapValues();
    currentNodes.forEach((v) => {
      this._forEachPrevious(v, { oldNode, newNode });
    });
  }

  private _forEachNext(
    node: Nodes,
    values: { oldNode: Nodes; newNode: Nodes },
  ) {
    if (!node.next) return;
    const { oldNode, newNode } = values;
    const nextFound = node.next.find((nn) => nn.code === oldNode.code);
    if (nextFound) {
      this.mapData.set(node.code, {
        ...node,
        next: [
          ...node.next.filter((nn) => nn.code !== oldNode.code),
          { ...nextFound, code: newNode.code },
        ],
      });
    }
  }
  private _forEachPrevious(
    node: Nodes,
    values: { oldNode: Nodes; newNode: Nodes },
  ) {
    if (!node.validatePrevious) return;
    const { oldNode, newNode } = values;
    const validateFound = node.validatePrevious.find(
      (p) => p.code === oldNode.code,
    );
    if (validateFound) {
      this.mapData.set(node.code, {
        ...node,
        validatePrevious: [
          ...node.validatePrevious.filter((nn) => nn.code !== oldNode.code),
          { ...validateFound, code: newNode.code },
        ],
      });
    }
    const nextFound = node.validatePrevious.find(
      (p) => p.next === oldNode.code,
    );
    if (nextFound) {
      this.mapData.set(node.code, {
        ...node,
        validatePrevious: [
          ...node.validatePrevious.filter((nn) => nn.next !== oldNode.code),
          { ...validateFound, next: newNode.code },
        ],
      });
    }
  }
}
