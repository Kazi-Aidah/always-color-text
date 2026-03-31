import { CircuitBreaker } from './CircuitBreaker.js';

export class ErrorRecovery {
  constructor() {
    this.breakers = new Map();
  }
  getBreaker(key) {
    const b = this.breakers.get(key) || new CircuitBreaker();
    this.breakers.set(key, b);
    return b;
  }
  wrap(key, fn, fallback) {
    const br = this.getBreaker(key);
    if (!br.canExecute()) {
      return typeof fallback === "function" ? fallback() : null;
    }
    try {
      const res = fn();
      br.recordSuccess();
      return res;
    } catch (_) {
      br.recordFailure();
      try {
        return typeof fallback === "function" ? fallback() : null;
      } catch (_) {
        return null;
      }
    }
  }
}
