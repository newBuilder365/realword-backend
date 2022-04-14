/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1649139419997_4193';

  // add your middleware config here
  config.middleware = ['errorHandler'];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1/realword',
      options: {
        useUnifiedTopology: true
      },
      // mongoose global plugins, expected a function or an array of function and options
      plugins: [],
    },
  };

  config.security = {
    csrf: {
      enable: false,
      ignoreJSON: true
    },
    domainWhiteList: ['http://localhost:8080']
  }

  config.cors = {
    origin:'*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH'
  };

  config.jwt = {
    secret: "45f58c08-49e9-49be-8186-b0fb3cd575a0",
    expiresIn: '1d'
  }

  return {
    ...config,
    ...userConfig,
  };
};
