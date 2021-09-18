/* eslint-disable no-param-reassign */
import passport from 'passport';
import { AgradonPlugin } from '../../init';
import { getFileGroup } from '../../services/files';
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

export default (config: any = {}): AgradonPlugin => {
  const parsedConfig: any = {
    strategies: defaultStrategies(),
    userModel: 'User',
    enableRoutes: true,
    ...config
  };

  parsedConfig.strategies = mergeStrategies(defaultStrategies(), config.strategies);

  return (app, fileSets, { rootPath }) => {
    const schemas = getFileGroup(fileSets, 'schema');

    registerStrategies(parsedConfig.strategies);
    guard(app, schemas, rootPath);

    if (parsedConfig.enableRoutes) {
      routes(app);
    }
  };
};
