const jwt = require('jsonwebtoken');
const passport = require('passport');

module.exports = function(router) {
  /* POST login. */
  router.post('/auth/local', function(req, res) {
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
  });
};