/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import _ from 'lodash';
import mongoose, { Schema } from 'mongoose';
import { EntitiesFileSet, getFileGroup } from './files';
import { createLogger } from './log';
import { toPascalCase } from './utils';

const log = createLogger({ file: __filename });

/**
 * returns the field type
 * @param {string} type
 * @returns {string} typeClass
 */
function getSchemaType(type: string | Array<string>) {
  const { Decimal128, ObjectId } = mongoose.Types;
  const TYPES: any = {
    string: String,
    boolean: Boolean,
    number: Number,
    date: Date,
    buffer: Buffer,
    // mixed: Mixed,
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
function setSchemaHooks(schema: Schema, modelFile: any) {
  if (_.get(modelFile, 'schema') && typeof modelFile.schema === 'function') {
    const schemaResult = modelFile.schema(schema); // execute schema file hook

    // verify if schema file is returning the schema
    if (schemaResult) {
      schema = schemaResult;
    } else {
      log.error("schema isn't been returned in one model.js");
    }
  }
  setDefaultHooks(schema);
}

/**
 * Create an mongoose schema
 * @param {Object} schema schema definition object
 * @param {string} schemaKey schema name from the folder
 * @returns {Schema} mongoose schema
 */
function createMongooseSchema({ _schema, _options }: any, modelFile: any) {
  const newSchema = new mongoose.Schema(_schema, _options);

  setSchemaHooks(newSchema, modelFile);
  return newSchema;
}

/**
 * Register model in mongoose instance
 * @param {Schema} schema mongoose schema
 * @param {string} name schema name
 * @returns {mongoose.Model<any>} mongoose model
 */
function registerMongooseModel(schema: Schema, name: string) {
  return mongoose.model(name, schema);
}

export type ModelsSet = { [key: string]: mongoose.Model<any> };

/**
 * Creates Mongoose Models from Mongoose schemas
 * @returns {any} models
 */
export function loadMongooseModels(filesSets: EntitiesFileSet): ModelsSet {
  const schemaFiles = getFileGroup(filesSets, 'schema');
  const modelFiles = getFileGroup(filesSets, 'model');
  const schemas = mapSchemasType(schemaFiles);
  const models: ModelsSet = {};

  for (const key in schemas) {
    const schema = schemas[key];
    const model = modelFiles[key];
    const schemaName = toPascalCase(key);

    models[key] = registerMongooseModel(createMongooseSchema(schema, model), schemaName);
  }

  return models;
}

export default {};
