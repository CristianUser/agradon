const log = require('./log');

describe('lib/services/log.js', () => {
  test('should create logger', () => {
    const logger = log({});

    expect(logger).toBeTruthy();
  });
});
