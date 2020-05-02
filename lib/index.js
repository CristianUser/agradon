/* eslint-disable guard-for-in */
'use strict';

require('dotenv').config();
const express = require('express'),
  _get = require('lodash/get'),
  { getModels, getControllers } = require('./utils'),
  { createMongooseModels, loadSchemas } = require('./models'),
  { createDefaultCRUD } = require('./crud'),
  pkg = require('../package.json');

function setHeaders(app) {
  app.set('x-powered-by', false);
  app.use(`${process.env.REST_PATH || '/'}`, function(req, res, next) {
    res.set('X-Powered-By', `Agradon V-${pkg.version}`);
    next();
  });
}

/**
 * Set global middlewares
 * @param {object} app
 */
function setMiddlewares(app) {
  app.use(express.json());
  setHeaders(app);
}

/**
 * Initialize internal services
 */
function loadServices() {
  require('./services/database')();
}

/**
 * Register routes in Express app
 * @param {object} config
 */
function registerRoutes({ app, rootPath }) {
  const entities = createMongooseModels(),
    modelModules = getModels() || {},
    controllers = getControllers() || {};

  for (const entity in entities) {
    const entityModel = entities[entity],
      entityMiddleware = _get(modelModules, `${entity}.middleware`, []),
      entityRouter = express.Router();

    if (controllers[entity]) {
      controllers[entity](entityRouter, entityModel, entityMiddleware);
    }
    createDefaultCRUD(entityRouter, entityModel, entityMiddleware);

    app.use(`${rootPath || ''}/${entity}`, entityRouter);
  }
}

/**
 * Register plugins
 * @param {Function[]} plugins
 * @param {object} app
 * @param {object} mongoose
 * @param {object} agradonConfig
 */
function registerPlugins(plugins = [], app, mongoose, agradonConfig) {
  plugins.forEach(plugin => {
    plugin(app, mongoose, loadSchemas(), agradonConfig);
  });
}

module.exports = {
  loadServices,
  setMiddlewares,
  registerRoutes,
  registerPlugins
};
