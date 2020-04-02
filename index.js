'use strict';
const mongoose = require('mongoose'),
  { loadEntities, loadServices, loadPlugins, setMiddlewares } = require('./lib'),
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
    loadPlugins([require('./lib/services/auth')(config.auth)], app, mongoose);
    loadEntities(config);
    console.log(`Agradon ${pkg.version} Loaded 👀 ⭐️`);
  } else {
    throw new Error('Is missing Express instance');
  }

  return app;
};

module.exports.getMongoose = function() {
  return mongoose;
};
