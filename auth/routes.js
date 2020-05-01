const jwt = require('jsonwebtoken');
const passport = require('passport');

/**
 * Register OAuth routes by provider
 *
 * @param {object} router
 * @param {string} provider
 */
function createRoutesByProvider(router, provider) {
  router.get(`/auth/${provider}`, passport.authenticate(provider));
  router.get(
    `/auth/${provider}/callback`,
    passport.authenticate(provider, { successRedirect: '/', failureRedirect: '/login' })
  );
}

function localRoute(req, res) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user
      });
    }

    req.login(user, { session: false }, err => {
      if (err) {
        return res.send(err);
      }

      const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET || 'your_jwt_secret');

      return res.json({ user, token });
    });
  })(req, res);
}

module.exports = function(router) {
  /* POST login. */
  router.post('/auth/local', localRoute);
};

// for testing
module.exports.createRoutesByProvider = createRoutesByProvider;
module.exports.localRoute = localRoute;
