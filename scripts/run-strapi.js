const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

function syncAdminBuild(projectRoot) {
  const adminIndexPath = path.join(projectRoot, 'build', 'index.html');

  if (!fs.existsSync(adminIndexPath)) {
    return;
  }

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
  fs.cpSync(path.join(projectRoot, 'build'), fallbackBuildDir, { recursive: true, force: true });
}

async function startStrapi(projectRoot) {
  const { createStrapi } = require('@strapi/core');

  try {
    await createStrapi({
      appDir: projectRoot,
      distDir: projectRoot,
    }).start();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

const cliPath = path.resolve(__dirname, '..', 'node_modules', '@strapi', 'strapi', 'dist', 'cli.js');
const projectRoot = path.resolve(__dirname, '..');
const command = process.argv[2];

const env = {
  ...process.env,
  XDG_CONFIG_HOME: process.env.XDG_CONFIG_HOME || path.join(projectRoot, '.strapi', 'xdg'),
};

if (command === 'start') {
  process.env = env;
  startStrapi(projectRoot);
  return;
}

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

  if (code === 0 && command === 'build') {
    try {
      syncAdminBuild(projectRoot);
    } catch (error) {
      console.error(error);
      process.exit(1);
    }
  }

  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
