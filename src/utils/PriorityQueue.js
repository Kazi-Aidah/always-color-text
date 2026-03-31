export class PriorityQueue {
  constructor() {
    this.a = [];
  }
  push(item, pr) {
    this.a.push({ item, pr });
    this.a.sort((x, y) => y.pr - x.pr);
  }
  pop() {
    return this.a.length ? this.a.shift().item : null;
  }
  size() {
    return this.a.length;
  }
  clear() {
    this.a.length = 0;
  }
}
