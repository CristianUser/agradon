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
  return app => {
    loadStrategies(config.strategies);

    if (config.enableRoutes) {
      routes(app);
    }
  };
};
