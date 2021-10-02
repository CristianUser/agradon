/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import express, { Express } from 'express';
import { Mongoose } from 'mongoose';
import { EntitiesFileSet, getFileGroup, readDirectory } from './services/files';
import { createDefaultCRUD } from './crud';
import { createLogger } from './services/log';
import { loadMongooseModels } from './services/mongoose';
// eslint-disable-next-line import/no-cycle
import { AgradonPlugin } from './plugins/base';

require('dotenv').config();

const log = createLogger({ file: __filename });
const pkg = require('../package.json');

export type AgradonConfig = {
  app: Express;
  rootPath?: string;
  mongooseConnection: Mongoose;
  plugins: AgradonPlugin[];
};

/**
 * Register routes in Express app
 * @param {object} config
 * @param {object} entities
 */
export function registerRoutes(
  app: Express,
  { rootPath }: AgradonConfig,
  mongooseModels: any,
  fileSets: EntitiesFileSet
) {
  const controllers = getFileGroup(fileSets, 'controller') || {};

  for (const entity in mongooseModels) {
    const entityModel = mongooseModels[entity];
    const entityRouter = express.Router();

    if (controllers[entity]) {
      controllers[entity](entityRouter, entityModel);
    }
    createDefaultCRUD(entityRouter, entityModel);

    app.use(`${rootPath || ''}/${entity}`, entityRouter);
  }
}

/**
 * Load and run plugins
 * @param {Express} app
 * @param {EntitiesFileSet} fileSets
 * @param {AgradonConfig} agradonConfig
 */
export function loadPlugins(app: Express, fileSets: EntitiesFileSet, agradonConfig: AgradonConfig) {
  const { plugins = [] } = agradonConfig;

  plugins.forEach((plugin: AgradonPlugin) => {
    plugin.load(app, fileSets, agradonConfig);
  });
}

/**
 * Initializes Agradon
 * @param {Object} config
 * @returns {Promise<Express.Application>}
 * @throws when express app is not loaded
 */
export function init(config: AgradonConfig) {
  const fileSets = readDirectory('src/entities');
  const mongooseModels = loadMongooseModels(fileSets);
  const { app, mongooseConnection } = config;

  app.use(express.json());
  app.use((req, res, next) => {
    res.set('X-Powered-By', `Agradon V-${pkg.version}`);
    next();
  });

  return mongooseConnection.connection
    .asPromise()
    .then(() => {
      loadPlugins(app, fileSets, config);
      registerRoutes(app, config, mongooseModels, fileSets);
      log.info('Agradon Loaded 👀 ⭐️', { version: pkg.version });
      return app;
    })
    .catch(log.error);
}
