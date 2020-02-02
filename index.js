/* eslint-disable guard-for-in */
'use strict';

const express = require('express'), // temporally
  { getModels, getControllers } = require('./services/utils/helpers'),
  { createDefaultCRUD } = require('./services/utils'),
  controllers = getControllers() || {},
  entities = getModels() || {},
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
  require('./services/database');
}

module.exports.init = app => {
  loadServices();
  setMiddlewares(app);

  for (const entity in entities) {
    const entityModel = entities[entity].model,
      entityMiddleware = entities[entity].middleware || [],
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
