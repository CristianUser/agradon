/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import express, { Express } from 'express';
import { EntitiesFileSet, getFileGroup, readDirectory } from './services/files';
import { createDefaultCRUD } from './crud';
import { createLogger } from './services/log';
// eslint-disable-next-line import/no-cycle
import { AgradonPlugin } from './plugins/base';
import { DbAdapter } from './services/db';

const log = createLogger({ file: __filename });
const pkg = require('../package.json');

export type AgradonConfig = {
  app: Express;
  rootPath?: string;
  db: DbAdapter;
  plugins: AgradonPlugin[];
};

/**
 * Register routes in Express app
 * @param {object} config
 * @param {object} entities
 */
export function registerRoutes(
  app: Express,
  { rootPath, db }: AgradonConfig,
  fileSets: EntitiesFileSet
) {
  const controllers = getFileGroup(fileSets, 'controller') || {};

  for (const entity in db.models) {
    const entityModel = db.models[entity];
    const entityRouter = express.Router();

    if (controllers[entity]) {
      controllers[entity](entityRouter, entityModel);
    }
    createDefaultCRUD(entityRouter, entity, db);

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
  const { app, db } = config;

  app.use(express.json());
  app.use((req, res, next) => {
    res.set('X-Powered-By', `Agradon V-${pkg.version}`);
    next();
  });

  return db
    .loadModels(fileSets)
    .connect()
    .then(() => {
      loadPlugins(app, fileSets, config);
      registerRoutes(app, config, fileSets);
      log.info('Agradon Loaded 👀 ⭐️', { version: pkg.version });
      return app;
    })
    .catch(log.error);
}
