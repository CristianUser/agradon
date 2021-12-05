import { createLogger } from '../../src/services/log';

describe('lib/services/log.js', () => {
  test('should create logger', () => {
    const logger = createLogger({});

    expect(logger).toBeTruthy();
  });
});
