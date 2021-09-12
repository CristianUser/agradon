'use strict';
const mongoose = require('mongoose'),
  { registerRoutes, registerPlugins, setMiddlewares } = require('./src'),
  { createMongooseModels } = require('./src/models'),
  entitites = createMongooseModels(),
  db = require('./src/services/database'),
  log = require('./src/services/log')({ file: __filename }),
  pkg = require('./package.json');

const { readDirectory } = require('./src/services/files.ts');

/**
 * Initializes Agradon
 * @param {Object} config
 * @returns {Promise<Express.Application>}
 * @throws when express app is not loaded
 */
module.exports.init = function(config: any) {
  const app = config.app || config || {};

  if (app.use) {
    setMiddlewares(app);

    readDirectory('src/entities');

    return db().then(() => {
      registerPlugins(config.plugins, app, mongoose, config);
      registerRoutes(config, entitites);
      log.info('Agradon Loaded 👀 ⭐️', { version: pkg.version });
      return app;
    });
  } else {
    throw new Error('Is missing Express instance');
  }
};
