import mongoose from 'mongoose';

const LocalStrategy = require('passport-local').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWTStrategy = require('passport-jwt').Strategy;

export function localStrategyFunc(email: string, password: string, cb: Function) {
  const UserModel = mongoose.model('User');

  // Assume there is a DB module pproviding a global UserModel
  return UserModel.findOne({ email, password })
    .then((user) => {
      if (!user) {
        return cb(null, false, { message: 'Incorrect email or password.' });
      }

      return cb(null, user, {
        message: 'Logged In Successfully'
      });
    })
    .catch((err) => {
      return cb(err);
    });
}

export function jwtFunc(jwtPayload: any, cb: Function) {
  const UserModel = mongoose.model('User');

  // find the user in db if needed
  return UserModel.findById(jwtPayload.id)
    .then((user) => {
      return cb(null, user);
    })
    .catch((err) => {
      return cb(err);
    });
}

const localStrategy = new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  localStrategyFunc
);

const jwtStrategy = new JWTStrategy(
  {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret'
  },
  jwtFunc
);

export default () => [localStrategy, jwtStrategy];
