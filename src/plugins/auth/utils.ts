import passport from 'passport';

export const verifyAuth = () => passport.authenticate('jwt', { session: false });

export default { verifyAuth };
