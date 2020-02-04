/* eslint-disable guard-for-in */
'use strict';

const express = require('express'), // temporally
  { getModels, getControllers } = require('./services/utils/helpers'),
  { createDefaultCRUD } = require('./services/utils'),
  controllers = getControllers() || {},
  entities = getModels() || {};

module.exports = app => {
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

  return app;
};
