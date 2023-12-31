'use strict';
// * Every now and then, we adopt best practices from CRA
// * https://tinyurl.com/yakv4ggx

// ? https://nodejs.org/en/about/releases
const NODE_LTS = 'maintained node versions';
// TODO: replace with 'package'
const pkgName = require('./package.json').name;
const debug = require('debug')(`${pkgName}:babel-config`);

debug('NODE_ENV: %O', process.env.NODE_ENV);

/**
 * @type {import('@babel/core').TransformOptions}
 */
module.exports = {
  comments: false,
  parserOpts: { strictMode: true },
  assumptions: {
    constantReexports: true
  },
  plugins: [
    '@babel/plugin-proposal-export-default-from',
    [
      'module-resolver',
      {
        root: '.',
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
        // ! If changed, also update these aliases in tsconfig.json,
        // ! webpack.config.js, next.config.ts, eslintrc.js, and jest.config.js
        alias: {
          '^universe/(.*)$': './src/\\1',
          '^multiverse/(.*)$': './lib/\\1',
          '^testverse/(.*)$': './test/\\1',
          '^externals/(.*)$': './external-scripts/\\1',
          '^types/(.*)$': './types/\\1',
          '^package$': `./package.json`
        }
      }
    ]
  ],
  // ? Sub-keys under the "env" config key will augment the above
  // ? configuration depending on the value of NODE_ENV and friends. Default
  // ? is: development
  env: {
    // * Used by Jest and `npm test`
    test: {
      comments: true,
      sourceMaps: 'both',
      presets: [
        ['@babel/preset-env', { targets: { node: true } }],
        ['@babel/preset-typescript', { allowDeclareFields: true }]
        // ? We don't care about minification
      ],
      plugins: [
        // ? Only active when testing, the plugin solves the following problem:
        // ? https://stackoverflow.com/q/40771520/1367414
        'explicit-exports-references',
        // TODO: this is required here for whatever reason. Why?
        '@babel/plugin-syntax-import-attributes'
      ]
    },
    // * Used by `npm run build` for compiling CJS to code output in ./dist
    'production-cjs': {
      presets: [
        [
          '@babel/preset-env',
          {
            // ? https://babeljs.io/docs/en/babel-preset-env#modules
            modules: 'cjs',
            targets: NODE_LTS,
            useBuiltIns: 'usage',
            corejs: '3.34',
            shippedProposals: true,
            exclude: ['proposal-dynamic-import']
          }
        ],
        ['@babel/preset-typescript', { allowDeclareFields: true }]
      ],
      plugins: [
        [
          'babel-plugin-transform-rewrite-imports',
          {
            appendExtension: '.js',
            replaceExtensions: {
              '^../package.json$': '../../package.json',
              '../debug-extended.js': '../debug-extended/index.js',
              '^(([^/]*/)?lib/[^/]+)$': '$1/index'
            }
          }
        ]
      ]
    },
    // * Used by `npm run build` for fixing declaration file imports in ./dist
    'production-types': {
      comments: true,
      plugins: [
        ['@babel/plugin-syntax-typescript', { dts: true }],
        [
          'transform-rewrite-imports',
          {
            // TODO: this came from monorepo, is this needed here?
            replaceExtensions: {
              // ? Ensure deep package.json imports resolve properly
              '^../../../package.json$': '../../package.json',
              // ? Ensure deep imports resolve properly
              '^../../../(.*)$': '../$1'
            }
          }
        ]
      ]
    }
  }
};

debug('exports: %O', module.exports);
