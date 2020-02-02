/* eslint-disable guard-for-in */
'use strict';

const fs = require('fs'),
  YAML = require('yaml'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  { getSchemas, getModels, getEntityName } = require('./utils'),
  models = getModels() || {};

/**
 * Loads the schema files from directory
 * @param {string} schemaPath schema file path
 * @returns {Object} schemas
 */
function readSchemaFile(schemaPath) {
  return YAML.parse(fs.readFileSync(schemaPath, 'utf8'));
}

/**
 * Loads the schemas files from directories
 * @returns {Object} schemas
 */
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

/**
 * Parse the schemas to put the correct Data Type
 * @returns {Object} schemas
 */
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

/**
 * Creates Mongoose Models from Mongoose schemas
 * @returns {Object} models
 */
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

/**
 * Create an mongoose schema
 * @param {Object} schema schema definition object
 * @param {string} schemaKey schema name from the folder
 * @returns {Object} mongoose schema
 */
function createMongooseSchema(schema, schemaKey) {
  const newSchema = new mongoose.Schema(schema._schema, schema._options);

  setSchemaHooks(newSchema, schemaKey);
  return newSchema;
}

/**
 * Register model in mongoose instance
 * @param {Object} schema mongoose schema
 * @param {string} name schema name
 * @returns {Obejct} mongoose model
 */
function registerMongooseModel(schema, name) {
  return mongoose.model(name, schema);
}

/**
 * Sets hooks or options to schema
 * @param {Object} schema mongoose schema
 * @param {string} schemaKey schema name from the folder
 */
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

/**
 * Set default options to every schema
 * @param {Object} schema mongoose schema
 */
function setDefaultHooks(schema) {
  schema.set('toJSON', {
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
