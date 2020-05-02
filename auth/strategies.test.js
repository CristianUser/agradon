/* eslint-disable no-undef */
jest.mock('mongoose');

const strategies = require('./strategies'),
  mongoose = require('mongoose'),
  cb = jest.fn(),
  error = {
    message: 'some error',
    stack: 'some line'
  };

function mockModel(method, fn) {
  mongoose.model.mockReturnValue({ [method]: fn });
}

describe('auth/strategies.js', () => {
  describe('localStrategyFunc', () => {
    test('should call cb once', () => {
      const user = { username: 'user' };

      mockModel('findOne', jest.fn().mockResolvedValue(user));
      strategies.localStrategyFunc('user', 'pass', cb).then(() => {
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toBeNull();
        expect(cb.mock.calls[0][1]).toEqual(user);
      });
    });

    test('should reject and call cb once with error', () => {
      mockModel('findOne', jest.fn().mockRejectedValue(error));
      strategies.localStrategyFunc('user', 'pass', cb).then(() => {
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toEqual(error);
      });
    });

    test("should't find the user ", () => {
      mockModel('findOne', jest.fn().mockResolvedValue(null));
      strategies.localStrategyFunc('user', 'pass', cb).then(() => {
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toBeNull();
        expect(cb.mock.calls[0][1]).toBeFalsy();
      });
    });
  });

  describe('jwtFunc', () => {
    test('should call cb once', () => {
      const user = { username: 'user' },
        payload = { id: 'someid' };

      mockModel('findById', jest.fn().mockResolvedValue(user));

      strategies.jwtFunc(payload).then(() => {
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toBeNull();
        expect(cb.mock.calls[0][1]).toEqual(user);
      });
    });

    test('should reject and call cb once with error', () => {
      const payload = { id: 'someid' };

      mockModel('findById', jest.fn().mockRejectedValue(error));
      strategies.jwtFunc(payload).then(() => {
        expect(cb.mock.calls.length).toBe(1);
        expect(cb.mock.calls[0][0]).toEqual(error);
      });
    });
  });
});
