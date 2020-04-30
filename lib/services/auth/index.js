const passport = require('passport'),
  routes = require('./routes'),
  guard = require('./guard');

/**
 * Register strategies in the passport instance
 * @param {Array} strategies
 */
function loadStrategies(strategies = []) {
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

  return (app, db, schemas) => {
    loadStrategies(_config.strategies);
    guard(app, schemas);

    if (_config.enableRoutes) {
      routes(app);
    }
  };
};
