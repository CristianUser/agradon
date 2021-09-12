import express, { Express } from 'express';
import { EntitiesFileSet, getFileGroup, readDirectory } from './services/files';
import db from './services/database';
import { createMongooseModels } from './models';

require('dotenv').config();

const _get = require('lodash/get');
const { createDefaultCRUD } = require('./crud');
const log = require('./services/log')({ file: __filename });
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
  auth: any;
};

function setHeaders(app: any) {
  app.use((req: any, res: any, next: any) => {
    res.set('X-Powered-By', `Agradon V-${pkg.version}`);
    next();
  });
}

/**
 * Set global middlewares
 * @param {object} app
 */
export function setMiddlewares(app: any) {
  app.use(express.json());
  setHeaders(app);
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
    const entityMiddleware = _get(modelModules, [entity, 'middleware'], []);
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
 * @param {Function[]} plugins
 * @param {object} app
 * @param {object} agradonConfig
 * @param {EntitiesFileSet} fileSets
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
