'use strict';
const { loadEntities, loadServices, setMiddlewares } = require('./lib'),
  pkg = require('./package.json');

/**
 * Initializes Agradon
 * @param {Express.Application} app
 * @returns {Express.Application}
 */
module.exports.init = function(app) {
  loadServices();
  setMiddlewares(app);
  loadEntities(app);
  console.log(`Agradon ${pkg.version} Loaded 👀 ⭐️`);

  return app;
};
