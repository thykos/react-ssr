// Enable NewRelic
// require('newrelic');
require('babel-register')({
  presets: [
    ['env', { targets: { node: 6 } }],
    'react', 'es2017', 'stage-0'
  ],
  plugins: [
    'syntax-dynamic-import',
    'dynamic-import-node',
    '@7rulnik/react-loadable/babel',
    'lodash'
  ],
  env: {
    production: [
      'transform-remove-console'
    ]
  }
});
require('babel-polyfill');
require('./server.js');
