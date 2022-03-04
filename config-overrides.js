const rewireReactHotLoader = require('react-app-rewire-hot-loader');

function overrideConfig(config, env) {
  // eslint-disable-next-line
  config = rewireReactHotLoader(config, env);
  return config;
}

/* config-overrides.js */
module.exports = overrideConfig;
