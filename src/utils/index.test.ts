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

  describe('parseJSON', () => {
    const json = `
      {
        "name": "John Doe"
      }
      `;

    test('should return an object', () => {
      expect(index.parseJSON(json)).toEqual({ name: 'John Doe' });
    });

    test('should not throw an error and return same value', () => {
      expect(index.parseJSON('some string')).toEqual('some string');
    });
  });
});
