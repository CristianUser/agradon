/* eslint-disable guard-for-in */
'use strict';

const fs = require('fs'),
  YAML = require('yaml'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  { getSchemas, getModels, getEntityName } = require('../services/utils/helpers');

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
    const schema = schemas[key];

    models[key] = createMongooseModel(createMongooseSchema(schema));
  }

  return models;
}

function createMongooseSchema(schema) {
  const newSchema = new mongoose.Schema(schema._schema, schema._options);

  setDefaultOptions(newSchema);
  return newSchema;
}

function createMongooseModel(schema, name) {
  return mongoose.model(_.capitalize(name), schema);
}

function setDefaultOptions(newSchema) {
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
