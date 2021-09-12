import { defaultResponse } from "./controllers";

const req = {
    body: {},
    query: {}
  },
  res: any = {
    status: jest.fn(() => res),
    send: jest.fn()
  },
  data = { prop: 'value' },
  modelInstance = { save: jest.fn() },
  model: any = jest.fn(() => modelInstance);

model.find = jest.fn();
model.findById = jest.fn();
model.updateOne = jest.fn();
model.deleteOne = jest.fn();

describe('lib/controllers.js', () => {
  describe('defaultResponse', () => {
    test('should resolve promise and send data', () => {
      const dbResponse = Promise.resolve(data);

      return defaultResponse(dbResponse, res).then(() => {
        expect(res.send.mock.calls.length).toBe(1);
        expect(res.send.mock.calls[0][0]).toEqual(data);
      });
    });

    test('should reject promise and send error', () => {
      const err = { message: 'some error' };
      const dbResponse = Promise.reject(err);

      return defaultResponse(dbResponse, res).then(() => {
        expect(res.status.mock.calls.length).toBe(1);
        expect(res.send.mock.calls.length).toBe(1);
        expect(res.status.mock.calls[0][0]).toBe(403);
        expect(res.send.mock.calls[0][0]).toEqual(err);
      });
    });
  });

  describe('createCrudHandlers', () => {
    test('should create controller', () => {
      const controller = controllers.createCrudHandlers(model);

      expect(controller).toBeTruthy();
    });

    test('should call post method', () => {
      const controller = controllers.createCrudHandlers(model);

      modelInstance.save.mockResolvedValue({});
      return controller.post(req, res).then(() => {
        expect(modelInstance.save.mock.calls.length).toBe(1);
      });
    });

    test('should call get method', () => {
      const controller = controllers.createCrudHandlers(model);

      model.find.mockResolvedValue([data]);
      return controller.get(req, res).then(() => {
        expect(model.find.mock.calls.length).toBe(1);
      });
    });

    test('should call getById method', () => {
      const controller = controllers.createCrudHandlers(model);
      const request = Object.assign(req, { params: { id: 'some id' } });

      model.findById.mockResolvedValue(data);
      return controller.getById(request, res).then(() => {
        expect(model.findById.mock.calls.length).toBe(1);
        expect(res.send.mock.calls[0][0]).toEqual(data);
      });
    });

    test('should call put method', () => {
      const controller = controllers.createCrudHandlers(model);
      const request = Object.assign(req, { params: { id: 'some id' } });

      model.updateOne.mockResolvedValue(data);
      return controller.put(request, res).then(() => {
        expect(model.updateOne.mock.calls.length).toBe(1);
      });
    });

    test('should call delete method', () => {
      const controller = controllers.createCrudHandlers(model);
      const request = Object.assign(req, { params: { id: 'some id' } });

      model.deleteOne.mockResolvedValue(data);
      return controller.delete(request, res).then(() => {
        expect(model.deleteOne.mock.calls.length).toBe(1);
      });
    });
  });
});
