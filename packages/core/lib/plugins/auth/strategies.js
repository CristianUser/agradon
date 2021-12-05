"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtFunc = exports.localStrategyFunc = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var LocalStrategy = require('passport-local').Strategy;
var ExtractJWT = require('passport-jwt').ExtractJwt;
var JWTStrategy = require('passport-jwt').Strategy;
function localStrategyFunc(email, password, cb) {
    var UserModel = mongoose_1.default.model('User');
    return UserModel.findOne({ email: email, password: password })
        .then(function (user) {
        if (!user) {
            return cb(null, false, { message: 'Incorrect email or password.' });
        }
        return cb(null, user, {
            message: 'Logged In Successfully'
        });
    })
        .catch(function (err) {
        return cb(err);
    });
}
exports.localStrategyFunc = localStrategyFunc;
function jwtFunc(jwtPayload, cb) {
    var UserModel = mongoose_1.default.model('User');
    return UserModel.findById(jwtPayload.id)
        .then(function (user) {
        return cb(null, user);
    })
        .catch(function (err) {
        return cb(err);
    });
}
exports.jwtFunc = jwtFunc;
var localStrategy = new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
}, localStrategyFunc);
var jwtStrategy = new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret'
}, jwtFunc);
exports.default = (function () { return [localStrategy, jwtStrategy]; });
//# sourceMappingURL=strategies.js.map