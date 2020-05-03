/* eslint-disable no-undef */
jest.mock('mongoose');

const mongoose = require('mongoose'),
  db = require('./database');

describe('lib/services/database.js', () => {
  test('should connect', () => {
    mongoose.connect.mockResolvedValue({});

    db().then(() => {
      expect(mongoose.connect.mock.calls.length).toBe(1);
    });
  });

  test("shouldn't connect", () => {
    mongoose.connect.mockRejectedValue({});

    db().then(() => {
      expect(mongoose.connect.mock.calls.length).toBe(1);
    });
  });
});
