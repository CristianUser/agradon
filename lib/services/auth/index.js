const passport = require('passport'),
  routes = require('./routes'),
  guard = require('./guard');

/**
 * Register strategies in the passport instance
 * @param {Array} strategies
 */
function registerStrategies(strategies = []) {
  strategies.forEach(strategy => {
    passport.use(strategy);
  });
}

module.exports = (config = {}) => {
  const _config = Object.assign(
    {
      strategies: require('./strategies'),
      userModel: 'User',
      enableRoutes: true
    },
    config
  );

  if (config.strategies) {
    const strategies = require('./strategies');

    config.strategies.forEach(strategy => {
      const index = strategies.findIndex(_strategy => _strategy.name === strategy.name);

      if (index >= 0) {
        strategies[index] = strategy;
      } else {
        strategies.push(strategy);
      }
    });

    _config.strategies = strategies;
  }

  return (app, db, schemas) => {
    registerStrategies(_config.strategies);
    guard(app, schemas);

    if (_config.enableRoutes) {
      routes(app);
    }
  };
};
