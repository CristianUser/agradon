"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.readDirectory = void 0;
var glob_1 = __importDefault(require("glob"));
var path_1 = __importDefault(require("path"));
var fs_1 = __importDefault(require("fs"));
var js_yaml_1 = __importDefault(require("js-yaml"));
var loadYaml = function (filePath) { return js_yaml_1.default.load(fs_1.default.readFileSync(filePath, 'utf8')); };
var EXTENSION_MAP = {
    yaml: loadYaml,
    yml: loadYaml,
    js: require,
    ts: require
};
function readDirectory(entitiesPath) {
    glob_1.default.sync(entitiesPath + "/**/*.*").forEach(function (file) {
        var resolvedPath = path_1.default.resolve(file);
        var ext = path_1.default.extname(resolvedPath);
        console.log(EXTENSION_MAP[ext](resolvedPath));
    });
}
exports.readDirectory = readDirectory;
