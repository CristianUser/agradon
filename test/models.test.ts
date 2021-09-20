/* eslint-disable no-undef */
jest.mock('fs');
jest.mock('./utils');
jest.mock('mongoose');

import _ from 'lodash';

const models = require('./models'),
  fs = require('fs'),
  mongoose = require('mongoose'),
  utils = require('./utils');

describe('lib/models.js', () => {
  const schemas = {
    user: {
      _schema: {
        fullName: {
          name: 'String',
          lastname: {
            type: 'String'
          }
        },
        likes: ['String'],
        alias: 'String',
        birthday: {
          type: 'Date'
        }
      }
    }
  };

  describe('readSchemaFile', () => {
    const yml = `
    _schema:
      username: String
      email:
        type: String
        required: true
    required: true
    `;

    test('should parse the yaml', () => {
      fs.readFileSync.mockReturnValue(yml);
      models.readSchemaFile('user/schema.yml');
    });
  });

  describe('createMongooseModels', () => {
    test('should create schemas', () => {
      utils.getSchemas.mockReturnValue(['entities/user/schema.yml']);
      models.createMongooseModels();

      expect(mongoose.model.mock.calls.length).toBe(1);
    });
  });

  describe('getSchemaType', () => {
    test('should return respective constructor', () => {
      expect(models.getSchemaType('string')).toEqual(String);
      expect(models.getSchemaType(['String'])).toEqual([String]);
      expect(models.getSchemaType('unknown')).toEqual(String);
    });
  });

  describe('mapSchemasType', () => {
    test('should replace type string to respective constructor', () => {
      const result = _.cloneDeep(schemas);

      _.set(result, 'user._schema.fullName.name', String);
      _.set(result, 'user._schema.fullName.lastname.type', String);
      _.set(result, 'user._schema.likes', [String]);
      _.set(result, 'user._schema.alias', String);
      _.set(result, 'user._schema.birthday.type', Date);

      expect(models.mapSchemasType(schemas)).toEqual(result);
    });
  });

  describe('setSchemaHooks', () => {
    const schemaMock = {
      set: jest.fn(),
      pre: jest.fn()
    };

    test('should set default hooks', () => {
      utils.getModels.mockReturnValue({});

      models.setSchemaHooks(schemaMock, 'user');

      const defaultHook = schemaMock.set.mock.calls[0][1],
        ret = {
          _id: 'id',
          __v: ''
        };

      expect(schemaMock.set.mock.calls.length).toBe(1);
      defaultHook.transform(null, ret);
      expect(ret).toEqual({ id: 'id' });
    });

    test('should set hooks from file', () => {
      function modelFile(schema: any) {
        schema.pre('save', () => {});
        schema.set('', () => {});

        return schema;
      }

      utils.getModels.mockReturnValue({ user: { schema: modelFile } });

      models.setSchemaHooks(schemaMock, 'user');

      expect(schemaMock.set.mock.calls.length).toBe(2);
      expect(schemaMock.pre.mock.calls.length).toBe(1);
    });

    test('should set hooks from file', () => {
      function modelFile(schema: any) {
        schema.pre('save', () => {});
        schema.set('', () => {});
      }

      utils.getModels.mockReturnValue({ user: { schema: modelFile } });

      models.setSchemaHooks(schemaMock, 'user');

      expect(schemaMock.set.mock.calls.length).toBe(2);
      expect(schemaMock.pre.mock.calls.length).toBe(1);
    });
  });
});
