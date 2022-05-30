/* eslint-disable no-param-reassign */
import { AgradonConfig, AgradonPlugin, EntitiesFileSet, getFileGroup } from '@agradon/core';
import { Router } from 'express';
import passport from 'passport';
import guard from './guard';
import routes from './routes';
import defaultStrategies from './strategies';

/**
 * Register strategies in the passport instance
 * @param {Array} strategies
 */
export function registerStrategies(strategies: passport.Strategy[] = []) {
  strategies.forEach((strategy) => {
    passport.use(strategy);
  });
}

/**
 * Merges strategies without repeating the same twice
 *
 * @param {object[]} strategies
 * @param {object[]} newStrategies
 * @returns {object[]} merged result
 */
export function mergeStrategies(
  strategies: passport.Strategy[],
  newStrategies: passport.Strategy[]
) {
  if (newStrategies) {
    newStrategies.forEach((strategy) => {
      const index = strategies.findIndex((_strategy) => _strategy.name === strategy.name);

      if (index >= 0) {
        strategies[index] = strategy;
      } else {
        strategies.push(strategy);
      }
    });
  }
  return strategies;
}

export default {};
export class AuthPlugin extends AgradonPlugin {
  public config: any;

  constructor(config: any = {}) {
    super();
    const parsedConfig: any = {
      strategies: [],
      userModel: 'User',
      enableRoutes: true,
      ...config
    };
    parsedConfig.strategies = mergeStrategies(
      defaultStrategies({ db: parsedConfig.db, userModel: parsedConfig.userModel }),
      config.strategies
    );
    this.config = parsedConfig;
  }

  load(app: Router, fileSets: EntitiesFileSet, { rootPath }: AgradonConfig): void {
    const schemas = getFileGroup(fileSets, 'schema');

    registerStrategies(this.config.strategies);
    guard(app, schemas, rootPath);

    if (this.config.enableRoutes) {
      routes(app);
    }
  }
}

export * from './utils';
