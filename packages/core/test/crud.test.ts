import { createCrudHandlers } from '../src/services/controllers';
import { createCrudRoutes, createDefaultCRUD } from '../src/crud';

jest.mock('./controllers');

const controller = {
  get: jest.fn(),
  getById: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};
const router = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};

describe('lib/crud.js', () => {
  describe('createCrudRoutes', () => {
    test('should create routes', () => {
      createCrudRoutes(router, controller);

      expect(router.get.mock.calls.length).toBe(2);
      expect(router.post.mock.calls.length).toBe(1);
      expect(router.put.mock.calls.length).toBe(1);
      expect(router.delete.mock.calls.length).toBe(1);
      expect(router.get.mock.calls[0][1]).toEqual(controller.get);
    });

    test("shouldn't create routes", () => {
      createCrudRoutes(router);

      expect(router.get.mock.calls.length).toBe(0);
      expect(router.post.mock.calls.length).toBe(0);
      expect(router.put.mock.calls.length).toBe(0);
      expect(router.delete.mock.calls.length).toBe(0);
    });
  });

  describe('createDefaultCRUD', () => {
    test('should create routes', () => {
      createCrudHandlers.mockReturnValue(controller);
      createDefaultCRUD(router);

      expect(createCrudHandlers.mock.calls.length).toBe(1);
    });
  });
});
