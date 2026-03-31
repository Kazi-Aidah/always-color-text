export class RegexCache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.map = new Map();
    this.hits = 0;
    this.misses = 0;
    this.entryMap = new WeakMap();
  }
  _key(pattern, flags) {
    return `${pattern}::${flags || ""}`;
  }
  getOrCreate(pattern, flags) {
    const k = this._key(pattern, flags);
    if (this.map.has(k)) {
      const r = this.map.get(k);
      this.map.delete(k);
      this.map.set(k, r);
      this.hits++;
      return r;
    }
    let r;
    try {
      // Validate regex pattern to prevent ReDoS attacks
      if (pattern && typeof pattern === "string" && pattern.length > 10000) {
        return null; // Reject patterns longer than 10KB
      }
      r =
        flags && flags !== ""
          ? new RegExp(pattern, flags)
          : new RegExp(pattern);
    } catch (_) {
      r = null;
    }
    this.misses++;
    if (r) {
      this.map.set(k, r);
      if (this.map.size > this.maxSize) {
        const oldestKey = this.map.keys().next().value;
        this.map.delete(oldestKey);
      }
    }
    return r;
  }
  associate(entry, regex) {
    if (entry && regex) {
      try {
        this.entryMap.set(entry, regex);
      } catch (_) {}
    }
  }
  clear() {
    this.map.clear();
    this.hits = 0;
    this.misses = 0;
  }
  stats() {
    return { hits: this.hits, misses: this.misses, size: this.map.size };
  }
}
