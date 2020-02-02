/* eslint-disable guard-for-in */
'use strict';

const express = require('express'), // temporally
  _ = require('lodash'),
  { getModels, getControllers } = require('./lib/utils'),
  { createMongooseModels } = require('./lib/model'),
  { createDefaultCRUD } = require('./lib/crud'),
  controllers = getControllers() || {},
  entities = createMongooseModels() || {},
  modelModules = getModels() || {},
  pkg = require('./package.json');

function setHeaders(app) {
  app.set('x-powered-by', false);
  app.use(`${process.env.REST_PATH || ''}`, function(req, res, next) {
    res.set('X-Powered-By', `Agradon V${pkg.version}`);
    next();
  });
}

function setMiddlewares(app) {
  app.use(require('body-parser').json());
  setHeaders(app);
}

function loadServices() {
  require('./lib/services/database');
}

module.exports.init = app => {
  loadServices();
  setMiddlewares(app);

  for (const entity in entities) {
    const entityModel = entities[entity],
      entityMiddleware = _.get(modelModules, `${entity}.middleware`, []),
      entityRouter = express.Router();

    if (controllers[entity]) {
      controllers[entity](entityRouter, entityModel, entityMiddleware);
    }
    createDefaultCRUD(entityRouter, entityModel, entityMiddleware);

    app.use(`${process.env.REST_PATH || ''}/${entity}`, entityRouter);
  }
  console.log(`Agradon ${pkg.version} Loaded`);

  return app;
};
