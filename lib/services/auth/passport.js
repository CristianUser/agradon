const passport = require('passport'),
  ExtractJWT = require('passport-jwt').ExtractJwt,
  JWTStrategy = require('passport-jwt').Strategy,
  LocalStrategy = require('passport-local').Strategy;

module.exports = function(mongoose) {
  const UserModel = mongoose.model('User');

  passport.use(
    new LocalStrategy(
      {
        usernameField: 'email',
        passwordField: 'password'
      },
      function(email, password, cb) {
        // Assume there is a DB module pproviding a global UserModel
        return UserModel.findOne({ email, password })
          .then(user => {
            if (!user) {
              return cb(null, false, { message: 'Incorrect email or password.' });
            }

            return cb(null, user, {
              message: 'Logged In Successfully'
            });
          })
          .catch(err => {
            return cb(err);
          });
      }
    )
  );

  passport.use(
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret'
      },
      function(jwtPayload, cb) {
        // find the user in db if needed
        return UserModel.findById(jwtPayload.id)
          .then(user => {
            return cb(null, user);
          })
          .catch(err => {
            return cb(err);
          });
      }
    )
  );
};
