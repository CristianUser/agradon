'use strict';

const crud = require('./crud');

describe('crud.js', () => {
  const json = `
  {
    "name": "John Doe"
  }
  `;

  test('should return an object', () => {
    expect(crud.parseJSON(json)).toEqual({ name: 'John Doe' });
  });

  test('should not throw an error and return same value', () => {
    expect(crud.parseJSON('some string')).toEqual('some string');
  });
});
