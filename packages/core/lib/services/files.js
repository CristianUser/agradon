"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFileGroup = exports.readDirectory = void 0;
var lodash_1 = __importDefault(require("lodash"));
var fs_1 = __importDefault(require("fs"));
var glob_1 = __importDefault(require("glob"));
var path_1 = __importDefault(require("path"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var loadYaml = function (filePath) { return js_yaml_1.default.load(fs_1.default.readFileSync(filePath, 'utf8')); };
var EXTENSION_LOADER = {
    '.yaml': loadYaml,
    '.yml': loadYaml,
    '.js': require,
    '.ts': require,
    '.json': require
};
function readDirectory(entitiesPath) {
    var entities = {};
    glob_1.default.sync("".concat(entitiesPath, "/**/*.*")).forEach(function (file) {
        var resolvedPath = path_1.default.resolve(file);
        var _a = path_1.default.parse(file), dir = _a.dir, ext = _a.ext, name = _a.name;
        var entityName = dir.split('/').pop() || '';
        var fileName = name;
        lodash_1.default.set(entities, [entityName, fileName], EXTENSION_LOADER[ext](resolvedPath));
    });
    return entities;
}
exports.readDirectory = readDirectory;
function getFileGroup(fileSets, fileName) {
    return Object.entries(fileSets).reduce(function (prev, _a) {
        var entityName = _a[0], fileSet = _a[1];
        prev[entityName] = fileSet[fileName];
        return prev;
    }, {});
}
exports.getFileGroup = getFileGroup;
//# sourceMappingURL=files.js.map