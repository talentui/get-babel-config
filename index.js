// const envConst = require("../constants.js");
const path = require('path');
module.exports = function(options = {}) {
  let {
    targets: tgt,
    transformInclude = [],
    engines = ['react'],
    loose = true,
    modules = false,
    typescript = false,
    corejs = 2,
    buildProd
  } = options;

  let strDev = 'development';
  let strProd = 'production';
  const env = process.env.NODE_ENV || strDev;

  let isProd = typeof buildProd === 'boolean' ? buildProd : env === strProd;

  targets = tgt || {
    chrome: '45',
    edge: '14',
    ie: '10'
  };

  let presets = [
      [
        '@babel/preset-env',
        {
          targets,
          modules: env === 'test' ? 'commonjs' : modules,
          include: transformInclude,
          useBuiltIns: 'usage',
          debug: !isProd,
          corejs,
          loose
        }
      ]
    ],
    plugins = [
      '@babel/plugin-syntax-dynamic-import',
      [
        '@babel/plugin-proposal-decorators',
        {
          legacy: true
        }
      ],
      [
        '@babel/plugin-proposal-class-properties',
        {
          loose
        }
      ],
      '@babel/plugin-proposal-export-default-from', //https://babeljs.io/docs/en/babel-plugin-proposal-export-default-from
      '@babel/plugin-transform-runtime'
    ];

  let hasReact = engines.indexOf('react') !== -1;

  if (hasReact) {
    plugins = [
      [
        'babel-plugin-styled-components',
        {
          ssr: false,
          displayName: !isProd,
          fileName: !isProd,
          pure: isProd
        }
      ],
      ...plugins
    ];
    presets.push([
      '@babel/preset-react',
      {
        development: !isProd
      }
    ]);
  }

  if (typescript) {
    presets.push(['@babel/preset-typescript']);
  }

  return {
    presets,
    plugins
  };
};
