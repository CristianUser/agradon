/* eslint-disable no-undef */
jest.mock('passport');

const utils = require('./utils'),
  passport = require('passport');

describe('auth/utils.js', () => {
  describe('verifyAuth', () => {
    test('should authenticate with passport', () => {
      utils.verifyAuth();

      expect(passport.authenticate.mock.calls.length).toBe(1);
      expect(passport.authenticate.mock.calls[0][0]).toBe('jwt');
    });
  });
});
