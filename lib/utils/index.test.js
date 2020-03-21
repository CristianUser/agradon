'use strict';
const index = require('./index');

describe('utils/index.js', () => {
  const fakePath = '/src/schemas/user/schema.yml',
    windowsPath = '\\src\\schemas\\user\\schema.yml';

  test('should return the schema name', () => {
    expect(index.getEntityName(fakePath)).toBe('user');
  });

  test('should convert path to unix format', () => {
    expect(index.standarizePath(windowsPath)).toBe(fakePath);
  });
});
