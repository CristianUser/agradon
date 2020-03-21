const routes = require('./routes'),
  passport = require('passport');

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

  return app => {
    loadStrategies(_config.strategies);

    if (_config.enableRoutes) {
      routes(app);
    }
  };
};
