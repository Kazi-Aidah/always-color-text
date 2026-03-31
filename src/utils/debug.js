import { IS_DEVELOPMENT } from '../core/constants.js';

// Helper function for conditional debug logging
export const debugLog = (tag, ...args) => {
  if (IS_DEVELOPMENT) {
    console.log(`[ACT][${tag}]`, ...args);
  }
};

export const debugError = (tag, ...args) => {
  if (IS_DEVELOPMENT) {
    console.error(`[ACT][ERROR][${tag}]`, ...args);
  }
};

export const debugWarn = (tag, ...args) => {
  // Disabled for production
};

export const escapeHtml = (str) => {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
};
