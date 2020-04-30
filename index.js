'use strict';
const mongoose = require('mongoose'),
  { registerRoutes, loadServices, loadPlugins, setMiddlewares } = require('./lib'),
  log = require('./lib/services/log')({ file: __filename }),
  pkg = require('./package.json');

/**
 * Initializes Agradon
 * @param {Object} config
 * @returns {Express.Application}
 * @throws when express app is not loaded
 */
module.exports.init = function(config) {
  const app = config.app || config || {};

  if (app.use) {
    setMiddlewares(app);
    loadServices();
    loadPlugins([require('./lib/services/auth')(config.auth)], app, mongoose, config);
    registerRoutes(config);
    log.info('Agradon Loaded 👀 ⭐️', { version: pkg.version });
  } else {
    throw new Error('Is missing Express instance');
  }

  return app;
};
