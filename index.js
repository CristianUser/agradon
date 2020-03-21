'use strict';
const { loadEntities, loadServices, setMiddlewares } = require('./lib'),
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
    loadServices();
    setMiddlewares(app);
    loadEntities(config);
    console.log(`Agradon ${pkg.version} Loaded 👀 ⭐️`);
  } else {
    throw new Error('Is missing Express instance');
  }

  return app;
};
