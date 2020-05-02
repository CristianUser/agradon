const passport = require('passport'),
  routes = require('./routes'),
  guard = require('./guard'),
  defaultStrategies = require('./strategies');

/**
 * Register strategies in the passport instance
 * @param {Array} strategies
 */
function registerStrategies(strategies = []) {
  strategies.forEach(strategy => {
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
function mergeStrategies(strategies, newStrategies) {
  if (newStrategies) {
    newStrategies.forEach(strategy => {
      const index = strategies.findIndex(_strategy => _strategy.name === strategy.name);

      if (index >= 0) {
        strategies[index] = strategy;
      } else {
        strategies.push(strategy);
      }
    });
  }
  return strategies;
}

module.exports = (config = {}) => {
  const _config = Object.assign(
    {
      strategies: defaultStrategies(),
      userModel: 'User',
      enableRoutes: true
    },
    config
  );

  _config.strategies = mergeStrategies(defaultStrategies(), config.strategies);

  return (app, db, schemas, { rootPath } = {}) => {
    registerStrategies(_config.strategies);
    guard(app, schemas, rootPath);

    if (_config.enableRoutes) {
      routes(app);
    }
  };
};

// for testing
module.exports.mergeStrategies = mergeStrategies;
module.exports.registerStrategies = registerStrategies;
