/* eslint-disable no-undef */

jest.mock('./controllers');

const crud = require('./crud'),
  controllers = require('./controllers'),
  controller = {
    get: jest.fn(),
    getById: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  },
  router = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  };

describe('lib/crud.js', () => {
  describe('parseJSON', () => {
    const json = `
      {
        "name": "John Doe"
      }
      `;

    test('should return an object', () => {
      expect(crud.parseJSON(json)).toEqual({ name: 'John Doe' });
    });

    test('should not throw an error and return same value', () => {
      expect(crud.parseJSON('some string')).toEqual('some string');
    });
  });

  describe('createCrudRoutes', () => {
    test('should create routes', () => {
      crud.createCrudRoutes(router, controller);

      expect(router.get.mock.calls.length).toBe(2);
      expect(router.post.mock.calls.length).toBe(1);
      expect(router.put.mock.calls.length).toBe(1);
      expect(router.delete.mock.calls.length).toBe(1);
      expect(router.get.mock.calls[0][1]).toEqual(controller.get);
    });

    test("shouldn't create routes", () => {
      crud.createCrudRoutes(router);

      expect(router.get.mock.calls.length).toBe(0);
      expect(router.post.mock.calls.length).toBe(0);
      expect(router.put.mock.calls.length).toBe(0);
      expect(router.delete.mock.calls.length).toBe(0);
    });
  });

  describe('createDefaultCRUD', () => {
    test('should create routes', () => {
      controllers.createCrudHandlers.mockReturnValue(controller);
      crud.createDefaultCRUD(router);

      expect(controllers.createCrudHandlers.mock.calls.length).toBe(1);
    });
  });
});
