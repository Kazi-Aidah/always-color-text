// To build, run: "npm run build.js" or "node build.js"

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  execSync('esbuild src/main.js --bundle --outfile=main.js --platform=node --external:obsidian --loader:.json=json', { stdio: 'inherit' });
} catch (err) {
  console.error('Noooo Build failed:', err && err.message ? err.message : err);
  process.exit(1);
}
