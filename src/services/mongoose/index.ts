/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
import _ from 'lodash';
import mongoose, { Schema } from 'mongoose';
import { DbAdapter } from '../db';
import { EntitiesFileSet, getFileGroup } from '../files';
import { createLogger } from '../log';
import { createCrudHandlers } from './controllers';

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

  if (_.get(field, 'type')) {
    if (field.type === 'array') {
      parseSchemaField(field, 'items');

      schemaFile[fieldKey] = [field.items];
    } else {
      _.set(schemaFile, `${fieldKey}.type`, getSchemaType(field.type));
    }
  } else if (_.get(field, '$ref')) {
    field.type = getSchemaType('ObjectId');
    field.ref = field.$ref.split('/').pop();
    delete field.$ref;
  } else if (typeof field === 'object') {
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
function parseSchemaFields(jsonSchema: any) {
  for (const fieldKey in jsonSchema.properties) {
    parseSchemaField(jsonSchema.properties, fieldKey);

    if (jsonSchema.required.includes(fieldKey)) {
      jsonSchema.properties[fieldKey].required = `"${fieldKey}" is required"`;
    }
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
function createMongooseSchema({ properties }: any, modelFile: any) {
  const newSchema = new mongoose.Schema(properties, { timestamps: true });

  setSchemaHooks(newSchema, modelFile);
  return newSchema;
}

export type ModelsSet = { [key: string]: mongoose.Model<any> };

export class MongooseDB implements DbAdapter {
  public type = 'mongoose';

  public mongoose: mongoose.Mongoose;

  public models: ModelsSet = {};

  // eslint-disable-next-line @typescript-eslint/no-shadow
  constructor(mongoose: mongoose.Mongoose) {
    this.mongoose = mongoose;
  }

  public async connect(): Promise<mongoose.Connection> {
    return this.mongoose.connection.asPromise();
  }

  /**
   * Creates Mongoose Models from Mongoose schemas
   * @returns {this} models
   */
  public loadModels(filesSets: EntitiesFileSet) {
    const schemaFiles = getFileGroup(filesSets, 'schema');
    const modelFiles = getFileGroup(filesSets, 'model');
    const schemas = mapSchemasType(_.cloneDeep(schemaFiles));

    for (const key in schemas) {
      const schema = schemas[key];
      const model = modelFiles[key];

      this.models[key] = this.mongoose.model(key, createMongooseSchema(schema, model));
    }
    return this;
  }

  public getModel(name: string) {
    return this.models[name];
  }

  public createCrudHandlers(modelName: string) {
    return createCrudHandlers(this.models[modelName]);
  }
}

export default {};
