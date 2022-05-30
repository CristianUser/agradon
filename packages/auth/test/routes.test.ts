const passport = require('passport');
const routes = require('../src/routes');

const router = {
  get: jest.fn(),
  post: jest.fn()
};

jest.mock('passport');

describe('auth/routes.js', () => {
  describe('routes default', () => {
    test('should call router and passport', () => {
      routes(router);

      expect(router.post.mock.calls.length).toBe(1);
    });
  });

  describe('createRoutesByProvider', () => {
    test('should call router.get twice', () => {
      const strategy = 'google';

      routes.createRoutesByProvider(router, strategy);

      expect(passport.authenticate.mock.calls.length).toBe(2);
      expect(passport.authenticate.mock.calls[0][0]).toBe(strategy);
      expect(passport.authenticate.mock.calls[1][0]).toBe(strategy);
      expect(router.get.mock.calls.length).toBe(2);
      expect(router.get.mock.calls[0][0]).toBe(`/auth/${strategy}`);
      expect(router.get.mock.calls[1][0]).toBe(`/auth/${strategy}/callback`);
    });
  });

  describe('localRoute', () => {
    test('should call router and passport', () => {
      const req = { login: jest.fn() };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn(() => res),
        send: jest.fn(() => res)
      };
      const user = {
        name: 'user'
      };

      passport.authenticate.mockReturnValue(jest.fn());

      routes.localRoute(req, res);
      const passportCallback = passport.authenticate.mock.calls[0][2];

      passportCallback(null, user);
      passportCallback({ message: 'error' }, null);
      passportCallback({}, null, { message: 'fails' });

      expect(passport.authenticate.mock.calls.length).toBe(1);
      expect(req.login.mock.calls.length).toBe(1);
      expect(res.status.mock.calls.length).toBe(2);
      expect(res.json.mock.calls.length).toBe(2);
      expect(res.json.mock.calls[0][0].message).toBe('Login failed');
      expect(res.json.mock.calls[1][0].user).toBe(null);
      expect(res.json.mock.calls[1][0].message).toBe('fails');

      const loginCb = req.login.mock.calls[0][2];

      loginCb({ message: 'error' });
      expect(res.send.mock.calls.length).toBe(1);

      loginCb(null);
      expect(res.send.mock.calls.length).toBe(1);
    });
  });
});
