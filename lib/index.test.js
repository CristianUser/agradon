/* eslint-disable no-undef */
jest.mock('./services/database');
jest.mock('./models');
jest.mock('./utils');

const lib = require('./index'),
  models = require('./models'),
  utils = require('./utils'),
  db = require('./services/database'),
  app = {
    use: jest.fn(),
    set: jest.fn()
  },
  req = {},
  res = {
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

  describe('loadServices', () => {
    test('should load db module', () => {
      lib.loadServices();

      expect(db.mock.calls.length).toBe(1);
    });
  });

  describe('registerRoutes', () => {
    test('should call app.use once', () => {
      models.createMongooseModels.mockReturnValue({ user: {} });

      lib.registerRoutes({ app });

      expect(app.use.mock.calls.length).toBe(1);
    });

    test("shouldn't call app.use", () => {
      models.createMongooseModels.mockReturnValue({});
      lib.registerRoutes({ app });

      expect(app.use.mock.calls.length).toBe(0);
    });

    test('should use controller file if exists', () => {
      const controllers = { user: jest.fn() };
      const _models = { user: { schema: 'user' } };

      models.createMongooseModels.mockReturnValue(_models);
      utils.getControllers.mockReturnValue(controllers);

      lib.registerRoutes({ app });

      expect(app.use.mock.calls.length).toBe(1);
      expect(controllers.user.mock.calls.length).toBe(1);
      expect(controllers.user.mock.calls[0][1]).toEqual(_models.user);
    });
  });

  describe('registerPlugins', () => {
    test('should call plugin', () => {
      const plugin = jest.fn(),
        mongooseMock = {
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
