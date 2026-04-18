const fs = require('node:fs');
const path = require('node:path');
const { spawn, spawnSync } = require('node:child_process');

function ensureAdminBuild(projectRoot, cliPath, env) {
  const adminIndexPath = path.join(projectRoot, 'build', 'index.html');

  if (fs.existsSync(adminIndexPath)) {
    return;
  }

  const result = spawnSync(process.execPath, [cliPath, 'build'], {
    cwd: projectRoot,
    env,
    stdio: 'inherit',
  });

  if (result.signal) {
    process.kill(process.pid, result.signal);
    return;
  }

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

async function startStrapi(projectRoot, cliPath, env) {
  const { createStrapi } = require('@strapi/core');

  try {
    ensureAdminBuild(projectRoot, cliPath, env);

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
  startStrapi(projectRoot, cliPath, env);
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

  process.exit(code ?? 0);
});

child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
