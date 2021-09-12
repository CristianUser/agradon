/* eslint-disable guard-for-in */

import { Schema } from 'mongoose';
import { FileGroup } from './services/files';

const _ = require('lodash');
const mongoose = require('mongoose');
const log = require('./services/log')({ file: __filename });
const { getModels, toPascalCase } = require('./utils');

/**
 * returns the field type
 * @param {string} type
 * @returns {string} typeClass
 */
function getSchemaType(type: string | Array<string>) {
  const { Decimal128, Mixed, ObjectId } = mongoose.Types;
  const TYPES: any = {
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

  if (typeof type === 'string' && TYPES[type.toLowerCase()]) {
    return TYPES[type.toLowerCase()];
  }
  if (Array.isArray(type)) {
    return _.flatten([type.map((t) => TYPES[t.toLowerCase()])]);
  }
  return TYPES.string;
}

/**
 * Verify the correct path to replace the Data Type
 * @param {Object} schemaFile
 * @param {string} fieldKey
 */
function parseSchemaField(schemaFile: any, fieldKey: string) {
  const field = _.get(schemaFile, fieldKey);

  if (_.isString(field)) {
    _.set(schemaFile, fieldKey, getSchemaType(field));
  } else if (_.get(field, 'type')) {
    _.set(schemaFile, `${fieldKey}.type`, getSchemaType(field.type));
  } else {
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
function parseSchemaFields({ _schema }: any) {
  for (const fieldKey in _schema) {
    parseSchemaField(_schema, fieldKey);
  }
}

/**
 * Parse the schemas to put the correct Data Type to each field
 * @param {Object} schemas
 * @returns {Object} schemas
 */
function mapSchemasType(schemas: any) {
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
export function createMongooseModels(schemaFiles: FileGroup) {
  const schemas = mapSchemasType(schemaFiles);
  const models: any = {};

  for (const key in schemas) {
    const schema = schemas[key];
    const schemaName = toPascalCase(key);

    models[key] = registerMongooseModel(createMongooseSchema(schema, key), schemaName);
  }

  return models;
}

/**
 * Set default options to every schema
 * @param {Object} schema mongoose schema
 */
function setDefaultHooks(schema: Schema) {
  schema.set('toJSON', {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  });
}

/**
 * Sets hooks or options to schema
 * @param {Object} schema mongoose schema
 * @param {string} schemaKey schema name from the folder
 */
function setSchemaHooks(schema: Schema, schemaKey: string) {
  const models = getModels();

  if (_.get(models, `${schemaKey}.schema`)) {
    const schemaResult = models[schemaKey].schema(schema); // execute schema file hook

    // verify if schema file is returning the schema
    if (schemaResult) {
      schema = schemaResult;
    } else {
      log.error(`schema isn't been returned in ${schemaKey}/model.js`);
    }
  }
  setDefaultHooks(schema);
}

/**
 * Create an mongoose schema
 * @param {Object} schema schema definition object
 * @param {string} schemaKey schema name from the folder
 * @returns {Object} mongoose schema
 */
function createMongooseSchema({ _schema, _options }: any, schemaKey: string) {
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
function registerMongooseModel(schema: Schema, name: string) {
  return mongoose.model(name, schema);
}
