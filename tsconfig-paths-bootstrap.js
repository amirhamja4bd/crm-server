'use strict';
const path = require('path');
const tsConfigPaths = require('tsconfig-paths');

// Resolve @/* to dist/src/* so compiled JS can use path aliases at runtime
const distDir = path.join(__dirname, 'dist');
tsConfigPaths.register({
  baseUrl: distDir,
  paths: { '@/*': ['src/*'] },
});
