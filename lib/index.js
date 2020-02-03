/* eslint-disable guard-for-in */
'use strict';

const express = require('express'),
  _get = require('lodash/get'),
  { getModels, getControllers } = require('./utils'),
  { createMongooseModels } = require('./models'),
  { createDefaultCRUD } = require('./crud'),
  controllers = getControllers() || {},
  entities = createMongooseModels() || {},
  modelModules = getModels() || {},
  pkg = require('../package.json');

function setHeaders(app) {
  app.set('x-powered-by', false);
  app.use(`${process.env.REST_PATH || '/'}`, function(req, res, next) {
    res.set('X-Powered-By', `Agradon V${pkg.version}`);
    next();
  });
}

function setMiddlewares(app) {
  app.use(require('body-parser').json());
  setHeaders(app);
}

function loadServices() {
  require('./services/database')();
}

function loadEntities(app) {
  for (const entity in entities) {
    const entityModel = entities[entity],
      entityMiddleware = _get(modelModules, `${entity}.middleware`, []),
      entityRouter = express.Router();

    if (controllers[entity]) {
      controllers[entity](entityRouter, entityModel, entityMiddleware);
    }
    createDefaultCRUD(entityRouter, entityModel, entityMiddleware);

    app.use(`${process.env.REST_PATH || ''}/${entity}`, entityRouter);
  }
}

module.exports = {
  loadServices,
  setMiddlewares,
  loadEntities
};