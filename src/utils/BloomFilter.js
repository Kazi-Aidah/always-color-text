export class BloomFilter {
  constructor(size = 2048) {
    this.size = size;
    this.bits = new Uint8Array(size);
    this._singleChars = "";
  }
  reset() {
    this.bits.fill(0);
    this._singleChars = "";
  }
  _hashes(s) {
    let h1 = 0,
      h2 = 0,
      h3 = 0;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      h1 = ((h1 << 5) - h1 + c) >>> 0;
      h2 = ((h2 << 7) ^ c) >>> 0;
      h3 = (h3 * 33 + c) >>> 0;
    }
    return [h1 % this.size, h2 % this.size, h3 % this.size];
  }
  _setToken(token) {
    const idx = this._hashes(token);
    for (const i of idx) this.bits[i] = 1;
  }
  addPattern(pattern, isRegex) {
    if (!pattern) return;
    const p = String(pattern).toLowerCase();
    let base = p;
    if (isRegex) {
      // Improved literal extraction: find sequences of characters that are likely literal
      const literals = p.match(/[a-z0-9\u4e00-\u9fa5]{1,}/gi);
      if (literals && literals.length > 0) {
        for (const lit of literals) {
          // Skip common regex meta-characters if they are escaped
          if (lit.length === 1 && /[bdswrtn]/.test(lit)) {
            const idx = p.indexOf("\\" + lit);
            if (idx !== -1) continue;
          }
          this._addLiteralToBase(lit);
        }
        return; // Already added all tokens
      }
    }
    this._addLiteralToBase(base);
  }

  _addLiteralToBase(base) {
    if (!base) return;
    if (base.length === 1) {
      if (!this._singleChars.includes(base)) {
        this._singleChars += base;
      }
      return;
    }
    if (base.length < 3) {
      this._setToken(base);
    } else {
      for (let i = 0; i <= base.length - 3; i++) {
        const tok = base.slice(i, i + 3);
        this._setToken(tok);
      }
    }
  }
  mightContain(text) {
    if (!text) return false;
    const t = String(text).toLowerCase();
    if (this._singleChars) {
      for (let i = 0; i < this._singleChars.length; i++) {
        if (t.includes(this._singleChars[i])) {
          return true;
        }
      }
    }
    const L = t.length;
    if (L < 2) return true;
    for (let i = 0; i < L; i++) {
      if (i <= L - 3) {
        const tok3 = t.slice(i, i + 3);
        const [a3, b3, c3] = this._hashes(tok3);
        if (this.bits[a3] && this.bits[b3] && this.bits[c3]) return true;
      }
      if (i <= L - 2) {
        const tok2 = t.slice(i, i + 2);
        const [a2, b2, c2] = this._hashes(tok2);
        if (this.bits[a2] && this.bits[b2] && this.bits[c2]) return true;
      }
    }
    return false;
  }
}
