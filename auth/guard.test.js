/* eslint-disable no-undef */
const guard = require('./guard');

const router = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  },
  schemas = {
    something: {
      _schema: {
        usename: 'String'
      },
      _auth: {
        post: true,
        get: true
      }
    },
    another: {
      _schema: {
        prop: 'String'
      }
    }
  };

describe('auth/guard.js', () => {
  describe('default', () => {
    test('should call router several times, just with schema with config', () => {
      guard(router, schemas);

      expect(router.get.mock.calls.length).toBe(2);
      expect(router.get.mock.calls[0][0]).toBe('/something');
      expect(router.get.mock.calls[1][0]).toBe('/something/:id');
      expect(router.post.mock.calls.length).toBe(1);
    });
  });
});
