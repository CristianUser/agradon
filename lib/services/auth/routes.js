const jwt = require('jsonwebtoken');
const passport = require('passport');

module.exports = function(router) {
  /* POST login. */
  router.post('/_login', function(req, res) {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      console.log(err);
      if (err || !user) {
        return res.status(400).json({
          message: info ? info.message : 'Login failed',
          user
        });
      }

      req.login(user, { session: false }, err => {
        if (err) {
          res.send(err);
        }

        const token = jwt.sign(user, 'your_jwt_secret');

        return res.json({ user, token });
      });
    })(req, res);
  });
};
