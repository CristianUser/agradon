import { createLogger } from './log';

describe('lib/services/log.js', () => {
  test('should create logger', () => {
    const logger = createLogger({});

    expect(logger).toBeTruthy();
  });
});
