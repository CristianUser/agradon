"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SequelizeDB = void 0;
var lodash_1 = __importDefault(require("lodash"));
var core_1 = require("@agradon/core");
var sequelize_1 = require("sequelize");
var repository_1 = require("./repository");
var log = (0, core_1.createLogger)({ file: __filename });
function addCustomMethods(models) {
    Object.keys(models).forEach(function (key) {
        var model = models[key];
        model.prototype.populate = function (_a) {
            var path = _a.path, ref = _a.ref, select = _a.select, populate = _a.populate;
            return __awaiter(this, void 0, void 0, function () {
                var values, propIsArray, rows, error_1;
                var _b;
                var _this = this;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 4, , 5]);
                            values = lodash_1.default.get(this, path);
                            propIsArray = lodash_1.default.isArray(values);
                            return [4, models[ref].findAll({
                                    attributes: select,
                                    where: { id: (_b = {}, _b[sequelize_1.Op.in] = propIsArray ? values : [values], _b) }
                                })];
                        case 1:
                            rows = _c.sent();
                            if (!populate) return [3, 3];
                            return [4, Promise.all(rows.map(function (row) { return __awaiter(_this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0: return [4, row.populate(populate)];
                                            case 1:
                                                _a.sent();
                                                return [2];
                                        }
                                    });
                                }); }))];
                        case 2:
                            _c.sent();
                            _c.label = 3;
                        case 3:
                            lodash_1.default.set(this, path, propIsArray ? rows : rows[0]);
                            return [3, 5];
                        case 4:
                            error_1 = _c.sent();
                            log.error(error_1.message);
                            return [3, 5];
                        case 5: return [2, this];
                    }
                });
            });
        };
        model.prototype.patchData = function (payload) {
            this.data = __assign(__assign({}, this.data), payload);
        };
    });
}
function getSchemaType(type) {
    var TYPES = {
        uuid: sequelize_1.DataTypes.UUID,
        string: sequelize_1.DataTypes.STRING,
        boolean: sequelize_1.DataTypes.BOOLEAN,
        number: sequelize_1.DataTypes.NUMBER,
        date: sequelize_1.DataTypes.DATE,
        buffer: sequelize_1.DataTypes.STRING,
        array: sequelize_1.DataTypes.JSONB,
        map: sequelize_1.DataTypes.JSONB,
        object: sequelize_1.DataTypes.JSONB
    };
    if (typeof type === 'string' && TYPES[type.toLowerCase()]) {
        return TYPES[type.toLowerCase()];
    }
    if (Array.isArray(type)) {
        return lodash_1.default.flatten([type.map(function (t) { return TYPES[t.toLowerCase()]; })]);
    }
    return TYPES.string;
}
function parseSchemaField(schemaFile, fieldKey, schemaAssociations, parentKey) {
    var field = lodash_1.default.get(schemaFile, fieldKey);
    if (lodash_1.default.get(field, 'type')) {
        if (field.type === 'array') {
            parseSchemaField(field, 'items', schemaAssociations, fieldKey);
            if (field.items) {
                schemaFile[fieldKey] = [field.items];
            }
            else {
                delete schemaFile[fieldKey];
            }
        }
        else {
            lodash_1.default.set(schemaFile, "".concat(fieldKey, ".type"), getSchemaType(field.type));
        }
    }
    else if (lodash_1.default.get(field, '$ref')) {
        var schema = field.$ref.split('/').pop();
        var alias = field.as;
        if (schemaFile.type === 'array') {
            schemaAssociations.push({
                type: 'hasMany',
                field: parentKey,
                alias: alias,
                schema: schema
            });
        }
        else {
            schemaAssociations.push({
                type: 'belongsTo',
                field: fieldKey,
                alias: alias,
                schema: schema
            });
        }
        delete schemaFile[fieldKey];
    }
    else if (typeof field === 'object') {
        for (var fieldKey1 in field) {
            parseSchemaField(field, fieldKey1, schemaAssociations);
        }
    }
}
function parseSchemaFields(jsonSchema, schemaAssociations) {
    if (schemaAssociations === void 0) { schemaAssociations = []; }
    for (var fieldKey in jsonSchema.properties) {
        parseSchemaField(jsonSchema.properties, fieldKey, schemaAssociations);
        if (jsonSchema.required.includes(fieldKey)) {
            jsonSchema.properties[fieldKey].allowNull = false;
        }
    }
}
function mapSchemasType(schemas) {
    var associations = {};
    for (var key in schemas) {
        var schemaFile = schemas[key];
        associations[key] = [];
        parseSchemaFields(schemaFile, associations[key]);
    }
    return { schemas: schemas, associations: associations };
}
var SequelizeDB = (function (_super) {
    __extends(SequelizeDB, _super);
    function SequelizeDB(connection) {
        var _this = _super.call(this) || this;
        _this.type = 'sequelize';
        _this.repositories = {};
        _this.models = {};
        _this.syncMode = 'alter';
        _this.connection = connection;
        return _this;
    }
    SequelizeDB.prototype.connect = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2, this.connection.authenticate()];
            });
        });
    };
    SequelizeDB.prototype.loadModels = function (filesSets) {
        var _a;
        var schemaFiles = (0, core_1.getFileGroup)(filesSets, 'schema');
        var _b = mapSchemasType(lodash_1.default.cloneDeep(schemaFiles)), schemas = _b.schemas, associations = _b.associations;
        for (var key in schemas) {
            var schema = schemas[key];
            this.models[key] = this.connection.define(key, schema.properties);
            this.repositories[key] = new repository_1.SequelizeRepository(this.models[key]);
        }
        for (var key in associations) {
            var schemaAssociations = associations[key];
            for (var _i = 0, schemaAssociations_1 = schemaAssociations; _i < schemaAssociations_1.length; _i++) {
                var association = schemaAssociations_1[_i];
                var type = association.type, field = association.field, schema = association.schema, alias = association.alias;
                if (type === 'hasMany') {
                    this.models[key].hasMany(this.models[schema], {
                        as: field,
                        foreignKey: "".concat(alias, "Id")
                    });
                }
                else if (type === 'belongsTo') {
                    this.models[key].belongsTo(this.models[schema], {
                        as: field,
                        constraints: false
                    });
                }
            }
        }
        addCustomMethods(this.models);
        this.connection.sync((_a = {}, _a[this.syncMode] = true, _a));
        for (var key in this.models) {
            var model = this.models[key];
            this.repositories[key] = new repository_1.SequelizeRepository(model);
        }
        return this;
    };
    return SequelizeDB;
}(core_1.DbAdapter));
exports.SequelizeDB = SequelizeDB;
exports.default = {};
//# sourceMappingURL=index.js.map