const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');
const adminBuildDir = path.join(projectRoot, 'build');
const adminIndexPath = path.join(adminBuildDir, 'index.html');
const fallbackBuildDir = path.join(
  projectRoot,
  'node_modules',
  '@strapi',
  'admin',
  'dist',
  'server',
  'server',
  'build'
);

if (!fs.existsSync(adminIndexPath)) {
  console.error(`Admin build not found at ${adminIndexPath}`);
  process.exit(1);
}

fs.cpSync(adminBuildDir, fallbackBuildDir, { recursive: true, force: true });
console.log(`Synced admin build to ${fallbackBuildDir}`);
