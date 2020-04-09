// eslint-disable-next-line no-undef, import/no-extraneous-dependencies
const { getConfig } = require('@airbnb/config-babel');

const config = getConfig({
  library: true,
  react: true,
  next: true,
  node: process.env.NODE_ENV === 'test',
  typescript: true,
  env: {
    targets: false,
  },
});

if (process.env.NODE_ENV !== 'test') {
  config.presets[0][1].modules = false;
}

// Override to allow transpile es modules inside vega-lite
config.ignore = config.ignore.filter(item => item !== 'node_modules/');
config.ignore.push('node_modules/(?!(vega-lite|lodash-es))');

// eslint-disable-next-line no-undef
module.exports = config;

// module.exports = {
//   "ignore": [
//     "coverage/",
//     "node_modules/",
//     "public/",
//     "esm/",
//     "lib/",
//     "tmp/",
//     "dist/",
//     "*.d.ts",
//     "__tests__",
//     "__mocks__"
//   ],
//   "plugins": [
//     [
//       "babel-plugin-transform-dev",
//       {
//         "evaluate": false
//       }
//     ],
//     "babel-plugin-typescript-to-proptypes",
//     "@babel/plugin-proposal-class-properties"
//   ],
//   "presets": [
//     [
//       "@babel/preset-env",
//       {
//         "loose": true,
//         "modules": false,
//         "shippedProposals": true,
//         "targets": false
//       }
//     ],
//     "@babel/preset-react",
//     "@babel/preset-typescript"
//   ]
// };

// module.exports = {
//   "ignore": [
//     "coverage/",
//     "node_modules/",
//     "public/",
//     "esm/",
//     "lib/",
//     "tmp/",
//     "dist/",
//     "*.d.ts",
//     "__tests__",
//     "__mocks__"
//   ],
//   "plugins": [
//     [
//       "babel-plugin-transform-dev",
//       {
//         "evaluate": false
//       }
//     ],
//     "babel-plugin-dynamic-import-node",
//     "babel-plugin-typescript-to-proptypes",
//     "@babel/plugin-proposal-class-properties"
//   ],
//   "presets": [
//     [
//       "@babel/preset-env",
//       {
//         "loose": true,
//         "modules": "commonjs",
//         "shippedProposals": true,
//         "targets": {
//           "node": "current"
//         }
//       }
//     ],
//     "@babel/preset-react",
//     "@babel/preset-typescript"
//   ]
// };
