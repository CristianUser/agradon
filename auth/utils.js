const passport = require('passport');

module.exports.verifyAuth = () => passport.authenticate('jwt', { session: false });
