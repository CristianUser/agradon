import { DbAdapter } from '@agradon/core';

const LocalStrategy = require('passport-local').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const JWTStrategy = require('passport-jwt').Strategy;

type StrategyOptions = { db: DbAdapter; userModel: string };
export const localStrategyFunc =
  ({ db, userModel }: StrategyOptions) =>
  (email: string, password: string, cb: Function) => {
    const userRepository = db.getRepository(userModel);

    // Assume there is a DB module providing a global UserModel
    return userRepository
      .findOne({ email, password })
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
  };

export const jwtFunc =
  ({ db, userModel }: StrategyOptions) =>
  (jwtPayload: any, cb: Function) => {
    const userRepository = db.getRepository(userModel);

    // find the user in db if needed
    return userRepository
      .findById(jwtPayload.id)
      .then((user) => {
        return cb(null, user);
      })
      .catch((err) => {
        return cb(err);
      });
  };

export default (config: StrategyOptions) => {
  const localStrategy = new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    localStrategyFunc(config)
  );

  const jwtStrategy = new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret'
    },
    jwtFunc(config)
  );

  return [localStrategy, jwtStrategy];
};
