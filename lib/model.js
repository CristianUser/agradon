/* eslint-disable guard-for-in */
'use strict';

const fs = require('fs'),
  YAML = require('yaml'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  { getSchemas, getModels, getEntityName } = require('./utils'),
  models = getModels() || {};

function readSchemaFile(schema) {
  return YAML.parse(fs.readFileSync(schema, 'utf8'));
}

function loadSchemas() {
  return getSchemas().reduce((prev, curr) => {
    prev[getEntityName(curr)] = readSchemaFile(curr);
    return prev;
  }, {});
}

/**
 * parse the type
 * @param {string} type
 * @returns {string} typeClass
 */
function parseSchemaType(type) {
  const { Decimal128, Mixed, ObjectId } = mongoose.Types,
    TYPES = {
      string: String,
      boolean: Boolean,
      number: Number,
      date: Date,
      buffer: Buffer,
      mixed: Mixed,
      objectid: ObjectId,
      array: Array,
      decimal128: Decimal128,
      map: Map
    };

  return TYPES[type.toLowerCase()];
}

function parseSchemas() {
  const schemas = loadSchemas();

  for (const key in schemas) {
    const schemaFile = schemas[key];

    for (const fieldKey in schemaFile._schema) {
      const field = schemaFile._schema[fieldKey];

      if (_.isString(field)) {
        _.set(schemaFile, `_schema.${fieldKey}`, parseSchemaType(field));
      } else {
        _.set(schemaFile, `_schema.${fieldKey}.type`, parseSchemaType(field.type));
      }
    }
  }

  return schemas;
}

function createMongooseModels() {
  const schemas = parseSchemas(),
    models = {};

  for (const key in schemas) {
    const schema = schemas[key],
      schemaName = _.capitalize(key);

    models[key] = registerMongooseModel(createMongooseSchema(schema, key), schemaName);
  }

  return models;
}

function createMongooseSchema(schema, schemaKey) {
  const newSchema = new mongoose.Schema(schema._schema, schema._options);

  setSchemaHooks(newSchema, schemaKey);
  return newSchema;
}

function registerMongooseModel(schema, name) {
  return mongoose.model(name, schema);
}

function setSchemaHooks(schema, schemaKey) {
  if (_.get(models, `${schemaKey}.schema`)) {
    const schemaResult = models[schemaKey].schema(schema);

    if (schemaResult) {
      schema = schemaResult;
    } else {
      console.error(`schema isn't been returned in ${schemaKey}/model.js`);
    }
  }
  setDefaultHooks(schema);
}

function setDefaultHooks(newSchema) {
  newSchema.set('toJSON', {
    transform: function(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  });
}

module.exports = {
  createMongooseModels
};
