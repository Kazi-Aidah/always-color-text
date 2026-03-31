import { PriorityQueue } from './PriorityQueue.js';

export class SmartEventManager {
  constructor() {
    this.registry = [];
    this.rafQueue = new Set();
    this.pq = new PriorityQueue();
    this.running = false;
  }
  add(el, event, handler, opts = {}) {
    const priority = opts.priority || 0;
    const debounceMs =
      typeof opts.debounceMs === "number"
        ? opts.debounceMs
        : this._defaultDebounce(event, opts.viewType);
    const useRaf = !!opts.useRaf;
    let wrapped = handler;
    if (debounceMs > 0) {
      let t;
      wrapped = (...args) => {
        clearTimeout(t);
        t = setTimeout(() => handler(...args), debounceMs);
      };
    }
    if (useRaf) {
      const key = `${event}:${Math.random()}`;
      const fn = (...args) => {
        this.rafQueue.add(() => handler(...args));
        this._drainRaf();
      };
      wrapped = fn;
    }
    el.addEventListener(event, wrapped, opts);
    this.registry.push({ el, event, wrapped, priority });
    return wrapped;
  }
  remove(el, event, wrapped) {
    try {
      el.removeEventListener(event, wrapped);
    } catch (_) {}
    this.registry = this.registry.filter(
      (r) => r.el !== el || r.event !== event || r.wrapped !== wrapped,
    );
  }
  _drainRaf() {
    if (this.running) return;
    this.running = true;
    const run = () => {
      const tasks = Array.from(this.rafQueue);
      this.rafQueue.clear();
      for (const fn of tasks) {
        try {
          fn();
        } catch (_) {}
      }
      if (this.rafQueue.size > 0) {
        requestAnimationFrame(run);
      } else {
        this.running = false;
      }
    };
    requestAnimationFrame(run);
  }
  _defaultDebounce(event, viewType) {
    if (viewType === "editor") {
      if (event === "scroll" || event === "resize") return 50;
      if (event === "mousemove") return 25;
      return 0;
    }
    if (event === "scroll" || event === "resize") return 100;
    if (event === "mousemove") return 50;
    return 0;
  }
  clear() {
    for (const r of this.registry) {
      try {
        r.el.removeEventListener(r.event, r.wrapped);
      } catch (_) {}
    }
    this.registry = [];
    this.rafQueue.clear();
    this.pq.clear();
  }
}
