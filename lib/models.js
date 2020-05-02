/* eslint-disable guard-for-in */
'use strict';

const fs = require('fs'),
  YAML = require('yaml'),
  _ = require('lodash'),
  mongoose = require('mongoose'),
  log = require('./services/log')({ file: __filename }),
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
 * returns the field type
 * @param {string} type
 * @returns {string} typeClass
 */
function getSchemaType(type) {
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
      map: Map,
      object: Object
    };

  if (_.isString(type)) {
    return TYPES[type.toLowerCase()];
  } else if (_.isArray(type)) {
    return [type.map(t => TYPES[t.toLowerCase()])];
  }
  return TYPES.string;
}

/**
 * Verify the correct path to replace the Data Type
 * @param {Object} schemaFile
 * @param {string} fieldKey
 */
function parseSchemaField(schemaFile, fieldKey) {
  const field = _.get(schemaFile, fieldKey);

  if (_.isString(field)) {
    try {
      _.set(schemaFile, fieldKey, getSchemaType(field));
    } catch (error) {
      log.error(`error getting schema type for ${fieldKey}`);
    }
  } else if (_.get(field, 'type')) {
    try {
      _.set(schemaFile, `${fieldKey}.type`, getSchemaType(field.type));
    } catch (error) {
      log.error(`error getting schema type for ${fieldKey}`);
    }
  } else if (_.isObject(field)) {
    // for nested definitions
    for (const fieldKey1 in field) {
      parseSchemaField(field, fieldKey1);
    }
  }
}

/**
 * Set the Data Type to each field in schema
 * @param {Object} schemaFile
 */
function parseSchemaFields({ _schema }) {
  for (const fieldKey in _schema) {
    parseSchemaField(_schema, fieldKey);
  }
}

/**
 * Parse the schemas to put the correct Data Type to each field
 * @param {Object} schemas
 * @returns {Object} schemas
 */
function mapSchemasType(schemas) {
  for (const key in schemas) {
    const schemaFile = schemas[key];

    parseSchemaFields(schemaFile);
  }
  return schemas;
}

/**
 * Creates Mongoose Models from Mongoose schemas
 * @returns {Object} models
 */
function createMongooseModels() {
  const schemas = mapSchemasType(loadSchemas()),
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
function createMongooseSchema({ _schema, _options }, schemaKey) {
  const newSchema = new mongoose.Schema(_schema, _options);

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
      log.error(`schema isn't been returned in ${schemaKey}/model.js`);
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
  createMongooseModels,
  getSchemaType,
  mapSchemasType,
  loadSchemas
};
