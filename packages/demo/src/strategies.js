/* eslint-disable one-var */
const LocalStrategy = require('passport-local').Strategy,
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

module.exports = [localStrategy];
