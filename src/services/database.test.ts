jest.mock('mongoose');

import db from './database';
import mongoose from 'mongoose';

describe('lib/services/database.js', () => {
  test('should connect', () => {
    const connectMock = mongoose.connect as jest.Mock;

    connectMock.mockResolvedValue({});

    return db().then(() => {
      expect(connectMock.mock.calls.length).toBe(1);
    });
  });

  test("shouldn't connect", () => {
    const connectMock = mongoose.connect as jest.Mock;

    connectMock.mockRejectedValue({});

    return db().then(() => {
      expect(connectMock.mock.calls.length).toBe(1);
    });
  });
});
