const { spawn } = require('node:child_process');
const path = require('node:path');

const cliPath = path.resolve(__dirname, '..', 'node_modules', '@strapi', 'strapi', 'dist', 'cli.js');
const projectRoot = path.resolve(__dirname, '..');

const env = {
  ...process.env,
  XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME || path.join(projectRoot, '.strapi', 'xdg'),
};

const child = spawn(process.execPath, [cliPath, ...process.argv.slice(2)], {
  cwd: projectRoot,
  env,
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
