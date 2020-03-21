const routes = require('./routes'),
  passport = require('./passport');

module.exports = (app, mongooseInstance) => {
  passport(mongooseInstance);
  routes(app);
};
