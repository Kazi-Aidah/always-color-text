// To build, run: "npm run build.js" or "node build.js"

const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/main.js'],
  bundle: true,
  outfile: 'main.js',
  platform: 'node',
  format: 'cjs',
  external: ['obsidian'],
  loader: { '.json': 'json' },
  logLevel: 'info',
  footer: {
    js: 'module.exports = module.exports.default ?? module.exports;',
  },
}).catch(() => process.exit(1));
