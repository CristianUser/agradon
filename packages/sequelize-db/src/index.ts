/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
import { DbAdapter, EntitiesFileSet, getFileGroup, createLogger } from '@agradon/core';
import { Sequelize, Model, DataTypes, ModelStatic, Op } from 'sequelize';
import { SequelizeRepository } from './repository';

const log = createLogger({ file: __filename });

/**
 * Add custom methods to sequelize model instance
 * @param {object} models Object that contains all models registered
 */
function addCustomMethods(models: ModelsSet) {
  Object.keys(models).forEach((key) => {
    const model = models[key];

    type PopulateInput = {
      path: string;
      ref: string;
      select?: string[];
      populate?: {};
    };

    model.prototype.populate = async function ({
      path,
      ref,
      select,
      populate
    }: PopulateInput): Promise<any> {
      try {
        const values = _.get(this, path);
        const propIsArray = _.isArray(values);
        const rows = await models[ref].findAll({
          attributes: select,
          where: { id: { [Op.in]: propIsArray ? values : [values] } }
        });

        if (populate) {
          await Promise.all(
            rows.map(async (row: any) => {
              await row.populate(populate);
            })
          );
        }

        _.set(this, path, propIsArray ? rows : rows[0]);
      } catch (error: any) {
        log.error(error.message);
      }
      return this;
    };

    model.prototype.patchData = function (payload: any) {
      this.data = {
        ...this.data,
        ...payload
      };
    };
  });
}

/**
 * returns the field type
 * @param {string} type
 * @returns {string} typeClass
 */
function getSchemaType(type: string | Array<string>) {
  const TYPES: any = {
    uuid: DataTypes.UUID,
    string: DataTypes.STRING,
    boolean: DataTypes.BOOLEAN,
    number: DataTypes.NUMBER,
    date: DataTypes.DATE,
    buffer: DataTypes.STRING,
    array: DataTypes.JSONB,
    map: DataTypes.JSONB,
    object: DataTypes.JSONB
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
function parseSchemaField(
  schemaFile: any,
  fieldKey: string,
  schemaAssociations: any,
  parentKey?: string
) {
  const field = _.get(schemaFile, fieldKey);

  if (_.get(field, 'type')) {
    if (field.type === 'array') {
      parseSchemaField(field, 'items', schemaAssociations, fieldKey);

      if (field.items) {
        schemaFile[fieldKey] = [field.items];
      } else {
        delete schemaFile[fieldKey];
      }
    } else {
      field.type = getSchemaType(field.type);
      if (typeof field.default !== 'undefined') {
        field.defaultValue = field.default;
        delete field.default;
      }
    }
  } else if (_.get(field, '$ref')) {
    const schema = field.$ref.split('/').pop();
    const alias = field.as;

    if (schemaFile.type === 'array') {
      schemaAssociations.push({
        type: 'hasMany',
        field: parentKey,
        alias,
        schema
      });
    } else {
      schemaAssociations.push({
        type: 'belongsTo',
        field: fieldKey,
        alias,
        schema
      });
    }
    delete schemaFile[fieldKey];
  } else if (typeof field === 'object') {
    // for nested definitions
    for (const fieldKey1 in field) {
      parseSchemaField(field, fieldKey1, schemaAssociations);
    }
  }
}

/**
 * Set the Data Type to each field in schema
 * @param {Object} schemaFile
 */
function parseSchemaFields(jsonSchema: any, schemaAssociations: any = []) {
  for (const fieldKey in jsonSchema.properties) {
    parseSchemaField(jsonSchema.properties, fieldKey, schemaAssociations);

    if (jsonSchema.required.includes(fieldKey)) {
      jsonSchema.properties[fieldKey].allowNull = false;
    }
  }
}

/**
 * Parse the schemas to put the correct Data Type to each field
 * @param {Object} schemas
 * @returns {Object} schemas
 */
function mapSchemasType(schemas: any) {
  const associations: any = {};
  for (const key in schemas) {
    const schemaFile = schemas[key];
    associations[key] = [];

    parseSchemaFields(schemaFile, associations[key]);
  }

  return { schemas, associations };
}

type ModelsSet = { [key: string]: ModelStatic<Model<any>> };

export class SequelizeDB extends DbAdapter {
  public type = 'sequelize';

  public repositories: { [key: string]: SequelizeRepository } = {};

  public connection: Sequelize;

  public models: ModelsSet = {};

  private syncMode: 'force' | 'alter' = 'alter';

  constructor(connection: Sequelize) {
    super();
    this.connection = connection;
  }

  public async connect() {
    return this.connection.authenticate();
  }

  /**
   * Creates Sequelize Models
   * @returns {this} models
   */
  public loadModels(filesSets: EntitiesFileSet) {
    const schemaFiles = getFileGroup(filesSets, 'schema');
    const modelFiles = getFileGroup(filesSets, 'model');
    const { schemas, associations } = mapSchemasType(_.cloneDeep(schemaFiles));

    for (const key in schemas) {
      const schema = schemas[key];
      const model = modelFiles[key];

      this.models[key] = this.connection.define(key, schema.properties);
      model?.(this.models[key], this);
      this.repositories[key] = new SequelizeRepository(this.models[key]);
    }

    for (const key in associations) {
      const schemaAssociations = associations[key];

      for (const association of schemaAssociations) {
        const { type, field, schema, alias } = association;

        if (type === 'hasMany') {
          this.models[key].hasMany(this.models[schema], {
            as: field,
            foreignKey: `${alias}Id`
          });
        } else if (type === 'belongsTo') {
          this.models[key].belongsTo(this.models[schema], {
            as: field,
            constraints: false
          });
        }
      }
    }

    addCustomMethods(this.models);
    this.connection.sync({ [this.syncMode]: true });
    for (const key in this.models) {
      const model = this.models[key];

      this.repositories[key] = new SequelizeRepository(model);
    }
    return this;
  }
}

export default {};
