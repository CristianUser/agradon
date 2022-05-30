/* eslint-disable no-undef */
jest.mock('./routes');
jest.mock('./guard');
jest.mock('./strategies');
jest.mock('mongoose');
jest.mock('passport');

const passport = require('passport');
const auth = require('../src/index');
const routes = require('../src/routes');
const guard = require('../src/guard');
const defaultStrategies = require('../src/strategies');

const config = {
  strategies: [],
  userModel: 'User',
  enableRoutes: true
};
// const router = {
//     get: jest.fn(),
//     post: jest.fn(),
//     put: jest.fn(),
//     delete: jest.fn()
//   };

describe('auth/index.js', () => {
  describe('default module', () => {
    test('should call guards and register routes', () => {
      defaultStrategies.mockReturnValue([]);

      auth(config)(router);

      expect(routes.mock.calls.length).toBe(1);
      expect(routes.mock.calls[0][0]).toEqual(router);
      expect(guard.mock.calls.length).toBe(1);
      expect(guard.mock.calls[0][0]).toEqual(router);
    });

    test("shouldn't register routes", () => {
      defaultStrategies.mockReturnValue([]);

      auth(Object.assign(config, { enableRoutes: false }))(router);

      expect(routes.mock.calls.length).toBe(0);
    });

    test('should use default config', () => {
      defaultStrategies.mockReturnValue([{ name: 'local' }, { name: 'jwt' }]);

      auth()(router);

      expect(routes.mock.calls.length).toBe(1);
      expect(routes.mock.calls[0][0]).toEqual(router);
      expect(guard.mock.calls.length).toBe(1);
      expect(guard.mock.calls[0][0]).toEqual(router);
    });
  });

  describe('mergeStrategies', () => {
    test('should merge strategies without repeating', () => {
      const strategies = [{ name: 'local' }, { name: 'jwt' }];

      expect(auth.mergeStrategies([{ name: 'local' }], strategies)).toEqual(strategies);
    });

    test('should not change strategies array', () => {
      const strategies = [{ name: 'local' }, { name: 'jwt' }];

      expect(auth.mergeStrategies(strategies)).toEqual(strategies);
    });
  });

  describe('mergeStrategies', () => {
    test('should register each strategy to passport instance', () => {
      const strategies = [{ name: 'local' }, { name: 'jwt' }, { name: 'google' }];

      auth.registerStrategies(strategies);

      expect(passport.use.mock.calls.length).toBe(3);
      expect(passport.use.mock.calls[0][0]).toEqual(strategies[0]);
      expect(passport.use.mock.calls[1][0]).toEqual(strategies[1]);
      expect(passport.use.mock.calls[2][0]).toEqual(strategies[2]);
    });

    test('should do nothing', () => {
      auth.registerStrategies();

      expect(passport.use.mock.calls.length).toBe(0);
    });
  });
});
