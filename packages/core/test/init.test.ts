/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
jest.mock('../src/services/db');
jest.mock('../src/services/utils');

const lib = require('../src/init');
const utils = require('../src/services/utils');

const app = {
  use: jest.fn(),
  set: jest.fn()
};

describe('lib/index.js', () => {
  describe('registerRoutes', () => {
    test.skip('should call app.use once', () => {
      lib.registerRoutes(app, { db: { models: { user: {} } } }, { controller: {} });

      expect(app.use).toBeCalledTimes(1);
    });

    test.skip('should use controller file if exists', () => {
      const controllers = { user: jest.fn() };
      const _models = { user: { schema: 'user' } };

      utils.getControllers.mockReturnValue(controllers);

      lib.registerRoutes({ app }, _models);

      expect(app.use.mock.calls.length).toBe(1);
      expect(controllers.user.mock.calls.length).toBe(1);
      expect(controllers.user.mock.calls[0][1]).toEqual(_models.user);
    });
  });

  describe('loadPlugins', () => {
    test('should call plugin', () => {
      const plugin = { load: jest.fn() };

      lib.loadPlugins(app, {}, { plugins: [plugin] });

      expect(plugin.load).toBeCalled();
      expect(plugin.load.mock.calls[0][0]).toEqual(app);
      expect(plugin.load.mock.calls[0][2]).toEqual({ plugins: [plugin] });
    });
  });
});
