import passport from 'passport';
import jwt from 'jsonwebtoken';
import { Router } from 'express';

/**
 * Register OAuth routes by provider
 *
 * @param {object} router
 * @param {string} provider
 */
export function createRoutesByProvider(router: Router, provider: string) {
  router.get(`/auth/${provider}`, passport.authenticate(provider));
  router.get(
    `/auth/${provider}/callback`,
    passport.authenticate(provider, { successRedirect: '/', failureRedirect: '/login' })
  );
}

export function localRoute(req: any, res: any) {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err || !user) {
      return res.status(400).json({
        message: info ? info.message : 'Login failed',
        user
      });
    }

    req.login(user, { session: false }, (err: any) => {
      if (err) {
        return res.send(err);
      }

      const token = jwt.sign(JSON.stringify(user), process.env.JWT_SECRET || 'your_jwt_secret');

      return res.json({ user, token });
    });
  })(req, res);
}

/**
 * Register routes on router
 *
 * @param {Router} router
 */
export default (router: Router) => {
  /* POST login. */
  router.post('/auth/local', localRoute);
};
