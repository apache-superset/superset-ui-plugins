/**
 * Build only plugins specified by globs
 */
const { spawnSync, spawn } = require('child_process');

const glob = process.argv[2];

process.env.PATH = `./node_modules/.bin:${process.env.PATH}`;

const run = (cmd) => {
  console.log(`>> ${cmd}`);
  const [p, ...args] = cmd.split(' ');
  const runner = spawnSync;
  const { status } = runner(p, args, { stdio: 'inherit' });
  if (status !== 0) {
    process.exit(status);
  }
};

if (glob) {
  run(`eslint --color --quiet packages/${glob}/{src,test}/**/*.{js,jsx,ts,tsx}`);
  run(`nimbus prettier --check --workspaces=\"@superset-ui/${glob}"`);
  run(`nimbus babel --clean --workspaces=\"@superset-ui/${glob}"`);
  run(`nimbus babel --clean --workspaces=\"@superset-ui/${glob}" --esm`);
  run(`nimbus typescript --build --workspaces=\"@superset-ui/${glob}"`);
  require('./buildAssets');
} else {
  run('yarn build');
}
