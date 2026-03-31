export class CircuitBreaker {
  constructor(threshold = 5, timeoutMs = 5000) {
    this.threshold = threshold;
    this.timeoutMs = timeoutMs;
    this.failures = 0;
    this.state = "closed";
    this.openedAt = 0;
  }
  canExecute() {
    if (this.state === "open") {
      const now = Date.now();
      if (now - this.openedAt > this.timeoutMs) {
        this.state = "half";
        return true;
      }
      return false;
    }
    return true;
  }
  recordSuccess() {
    this.failures = 0;
    if (this.state !== "closed") this.state = "closed";
  }
  recordFailure() {
    this.failures++;
    if (this.failures >= this.threshold) {
      this.state = "open";
      this.openedAt = Date.now();
    }
  }
}
