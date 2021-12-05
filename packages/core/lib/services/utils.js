"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseJSON = exports.toPascalCase = exports.getEntityName = void 0;
function standarizePath(path) {
    var isExtendedLengthPath = /^\\\\\?\\/.test(path);
    var hasNonAscii = /[^\u0000-\u0080]+/.test(path);
    if (isExtendedLengthPath || hasNonAscii) {
        return path;
    }
    return path.replace(/\\/g, '/');
}
function getEntityName(filePath) {
    return standarizePath(filePath).split('/').reverse()[1];
}
exports.getEntityName = getEntityName;
function toPascalCase(text) {
    return "".concat(text)
        .replace(new RegExp(/[-_]+/, 'g'), ' ')
        .replace(new RegExp(/[^\w\s]/, 'g'), '')
        .replace(new RegExp(/\s+(.)(\w+)/, 'g'), function ($1, $2, $3) { return "".concat($2.toUpperCase() + $3.toLowerCase()); })
        .replace(new RegExp(/\s/, 'g'), '')
        .replace(new RegExp(/\w/), function (s) { return s.toUpperCase(); });
}
exports.toPascalCase = toPascalCase;
function parseJSON(string) {
    try {
        return JSON.parse(string);
    }
    catch (error) {
        return string;
    }
}
exports.parseJSON = parseJSON;
//# sourceMappingURL=utils.js.map