import { createCrudHandlers } from '../src/services/controllers';
import { createCrudRoutes, createDefaultCRUD } from '../src/crud';

jest.mock('../src/services/controllers', () => ({ createCrudHandlers: jest.fn() }));

const controller = {
  get: jest.fn(),
  getById: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
};
const router: any = {
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
      router.get.mockClear();
      router.post.mockClear();
      router.put.mockClear();
      router.delete.mockClear();
      createCrudRoutes(router, {});

      expect(router.get).not.toBeCalled();
      expect(router.post).not.toBeCalled();
      expect(router.put).not.toBeCalled();
      expect(router.delete).not.toBeCalled();
    });
  });

  describe('createDefaultCRUD', () => {
    test('should create routes', () => {
      const dbMock: any = { getRepository: jest.fn() };
      (createCrudHandlers as any).mockReturnValue(controller);
      createDefaultCRUD(router, 'user', dbMock);

      expect(createCrudHandlers).toBeCalled();
    });
  });
});
