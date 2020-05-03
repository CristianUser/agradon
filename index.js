'use strict';
const mongoose = require('mongoose'),
  { registerRoutes, registerPlugins, setMiddlewares } = require('./lib'),
  { createMongooseModels } = require('./lib/models'),
  entitites = createMongooseModels(),
  db = require('./lib/services/database'),
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

    db().then(() => {
      registerPlugins(config.plugins, app, mongoose, config);
      registerRoutes(config, entitites);
      log.info('Agradon Loaded 👀 ⭐️', { version: pkg.version });
    });
  } else {
    throw new Error('Is missing Express instance');
  }

  return app;
};
