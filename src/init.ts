require('dotenv').config();

import _ from 'lodash';
import express, { Express } from 'express';
import { EntitiesFileSet, getFileGroup, readDirectory } from './services/files';
import db from './services/database';
import { createMongooseModels } from './models';
import { createDefaultCRUD } from './crud';
import createLogger from './services/log';


const log = createLogger({ file: __filename });
const pkg = require('../package.json');

export type AgradonPlugin = (
  app: Express,
  fileSets: EntitiesFileSet,
  config: AgradonConfig
) => void;
export type AgradonConfig = {
  app?: Express;
  rootPath?: string;
  plugins: AgradonPlugin[];
};

/**
 * Set global middlewares
 * @param {Express} app
 */
export function setMiddlewares(app: Express) {
  app.use(express.json());
  app.use((req, res, next) => {
    res.set('X-Powered-By', `Agradon V-${pkg.version}`);
    next();
  });
}

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
  const modelModules = getFileGroup(fileSets, 'model') || {};
  const controllers = getFileGroup(fileSets, 'controller') || {};

  for (const entity in mongooseModels) {
    const entityModel = mongooseModels[entity];
    const entityMiddleware = _.get(modelModules, [entity, 'middleware'], []);
    const entityRouter = express.Router();

    if (controllers[entity]) {
      controllers[entity](entityRouter, entityModel, entityMiddleware);
    }
    createDefaultCRUD(entityRouter, entityModel, entityMiddleware);

    app.use(`${rootPath || ''}/${entity}`, entityRouter);
  }
}

/**
 * Register plugins
 * @param {Express} app
 * @param {EntitiesFileSet} fileSets
 * @param {AgradonConfig} agradonConfig
 */
export function registerPlugins(
  app: Express,
  fileSets: EntitiesFileSet,
  agradonConfig: AgradonConfig
) {
  const { plugins = [] } = agradonConfig;

  plugins.forEach((plugin: AgradonPlugin) => {
    plugin(app, fileSets, agradonConfig);
  });
}

/**
 * Initializes Agradon
 * @param {Object} config
 * @returns {Promise<Express.Application>}
 * @throws when express app is not loaded
 */
export function init(config: Express | AgradonConfig | any) {
  const fileSets = readDirectory('src/entities');
  const mongooseModels = createMongooseModels(getFileGroup(fileSets, 'schema'));
  const app: Express = config.app || config || {};

  if (app.use || false) {
    setMiddlewares(app);

    return db().then(() => {
      registerPlugins(app, fileSets, config);
      registerRoutes(app, config, mongooseModels, fileSets);
      log.info('Agradon Loaded 👀 ⭐️', { version: pkg.version });
      return app;
    });
  }
  throw new Error('Is missing Express instance');
}
