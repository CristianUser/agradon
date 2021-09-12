import { Express } from 'express';
import passport from 'passport';
import { AgradonPlugin } from '../..';
import { EntitiesFileSet, getFileGroup } from '../../services/files';

const routes = require('./routes');
const guard = require('./guard');
const defaultStrategies = require('./strategies');

/**
 * Register strategies in the passport instance
 * @param {Array} strategies
 */
function registerStrategies(strategies: passport.Strategy[] = []) {
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
function mergeStrategies(strategies: passport.Strategy[], newStrategies: passport.Strategy[]) {
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

module.exports = (config: any = {}): AgradonPlugin => {
  const _config = {
    strategies: defaultStrategies(),
    userModel: 'User',
    enableRoutes: true,
    ...config
  };

  _config.strategies = mergeStrategies(defaultStrategies(), config.strategies);

  return (app: Express, fileSets: EntitiesFileSet, { rootPath }) => {
    registerStrategies(_config.strategies);
    guard(app, getFileGroup(fileSets, 'schema'), rootPath);

    if (_config.enableRoutes) {
      routes(app);
    }
  };
};

// for testing
module.exports.mergeStrategies = mergeStrategies;
module.exports.registerStrategies = registerStrategies;
