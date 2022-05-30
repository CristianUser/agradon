/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
jest.mock('./services/database');
jest.mock('./models');
jest.mock('./utils');

const lib = require('../src/init');
const utils = require('../src/services/utils');

const app = {
  use: jest.fn(),
  set: jest.fn()
};
const req: any = {};
const res: any = {
  set: jest.fn()
};

describe('lib/index.js', () => {
  describe('setMiddlewares', () => {
    test('should set default middlewares', () => {
      lib.setMiddlewares(app);

      const middleware = app.use.mock.calls[1][1];

      middleware(req, res, jest.fn());
      expect(app.use.mock.calls.length).toBe(2);
      expect(app.set.mock.calls.length).toBe(1);
      expect(res.set.mock.calls.length).toBe(1);
      expect(res.set.mock.calls[0][0]).toBe('X-Powered-By');
    });
  });
  describe('registerRoutes', () => {
    test('should call app.use once', () => {
      lib.registerRoutes({ app }, { user: {} });

      expect(app.use.mock.calls.length).toBe(1);
    });

    test("shouldn't call app.use", () => {
      lib.registerRoutes({ app });

      expect(app.use.mock.calls.length).toBe(0);
    });

    test('should use controller file if exists', () => {
      const controllers = { user: jest.fn() };
      const _models = { user: { schema: 'user' } };

      utils.getControllers.mockReturnValue(controllers);

      lib.registerRoutes({ app }, _models);

      expect(app.use.mock.calls.length).toBe(1);
      expect(controllers.user.mock.calls.length).toBe(1);
      expect(controllers.user.mock.calls[0][1]).toEqual(_models.user);
    });
  });

  describe('registerPlugins', () => {
    test('should call plugin', () => {
      const plugin = jest.fn();
      const mongooseMock = {
        model: jest.fn()
      };

      lib.registerPlugins([plugin], app, mongooseMock);

      expect(plugin.mock.calls.length).toBe(1);
      expect(plugin.mock.calls[0][0]).toEqual(app);
      expect(plugin.mock.calls[0][1]).toEqual(mongooseMock);
    });

    test('should do nothing', () => {
      lib.registerPlugins();
    });
  });
});
