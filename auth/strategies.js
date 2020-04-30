/* eslint-disable one-var */
const LocalStrategy = require('passport-local').Strategy,
  ExtractJWT = require('passport-jwt').ExtractJwt,
  JWTStrategy = require('passport-jwt').Strategy,
  UserModel = require('mongoose').model('User');

const localStrategy = new LocalStrategy(
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
);

const jwtStrategy = new JWTStrategy(
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
);

module.exports = [localStrategy, jwtStrategy];
