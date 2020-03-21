'use strict';

const models = require('./models'),
  _ = require('lodash');

describe('models.js', () => {
  const schemas = {
    user: {
      _schema: {
        fullName: {
          type: 'String',
          default: 'John'
        },
        likes: ['String'],
        birthday: 'Date'
      }
    }
  };

  test('should return respective constructor', () => {
    expect(models.getSchemaType('string')).toEqual(String);
  });

  test('should replace type string to respective constructor', () => {
    const result = _.cloneDeep(schemas);

    _.set(result, 'user._schema.fullName.type', String);
    _.set(result, 'user._schema.likes', [String]);
    _.set(result, 'user._schema.birthday', Date);

    expect(models.parseSchemas(schemas)).toEqual(result);
  });
});
