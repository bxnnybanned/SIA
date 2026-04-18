const path = require('node:path');

async function main() {
  const projectRoot = path.resolve(__dirname, '..');
  const strapiRoot = path.join(projectRoot, 'node_modules', '@strapi', 'strapi', 'dist', 'src');
  const { build } = require(path.join(strapiRoot, 'node', 'build.js'));
  const { createLogger } = require(path.join(strapiRoot, 'cli', 'utils', 'logger.js'));
  const { loadTsConfig } = require(path.join(strapiRoot, 'cli', 'utils', 'tsconfig.js'));

  const logger = createLogger({
    debug: process.argv.includes('--debug'),
    silent: process.argv.includes('--silent'),
    timestamp: false,
  });

  const tsconfig = loadTsConfig({
    cwd: projectRoot,
    path: 'tsconfig.json',
    logger,
  });

  await build({
    cwd: projectRoot,
    logger,
    tsconfig,
    bundler: 'vite',
    minify: true,
    sourcemap: false,
    stats: false,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
