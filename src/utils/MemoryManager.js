export class MemoryManager {
  constructor(plugin) {
    this.plugin = plugin;
    this.interval = 2000;
    this.timer = null;
    this.spanPool = [];
  }
  start() {
    if (this.timer) return;
    this.timer = setInterval(() => {
      this.tick();
    }, this.interval);
  }
  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
  setIntervalMs(ms) {
    this.interval = ms;
    if (this.timer) {
      this.stop();
      this.start();
    }
  }
  tick() {
    try {
      if (performance && performance.memory) {
        const usedMB = performance.memory.usedJSHeapSize / (1024 * 1024);
        if (usedMB > 800) {
          try {
            if (this.plugin._regexCache) this.plugin._regexCache.clear();
          } catch (_) {}
          // DISABLED: Clearing bloom filter breaks fastTest because entries are not recompiled
          // try { if (this.plugin._bloomFilter) this.plugin._bloomFilter.reset(); } catch (_) {}
        }
      }
    } catch (_) {}
  }
  getSpan(text) {
    let span = null;
    if (this.spanPool.length) {
      const wr = this.spanPool.pop();
      const obj = wr && wr.deref ? wr.deref() : null;
      if (obj) span = obj;
    }
    if (!span) span = document.createElement("span");
    span.textContent = text || "";
    return span;
  }
  returnSpan(span) {
    try {
      span.textContent = "";
      this.spanPool.push(new WeakRef(span));
    } catch (_) {}
  }
  hintGC() {
    try {
      const arr = new Array(100000);
      for (let i = 0; i < arr.length; i++) arr[i] = i;
      setTimeout(() => {
        arr.length = 0;
      }, 0);
    } catch (_) {}
  }
}
