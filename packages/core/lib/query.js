"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveArguments = exports.resolveProjection = exports.applyMethods = exports.getToSort = exports.getToPopulate = exports.parseQueryMethod = exports.defaultQueryParser = exports.resolvePagination = exports.resolveCompare = exports.parseOp = exports.resolveOmit = exports.resolvePick = exports.resolveMatch = exports.getQueryParam = exports.sanitizeText = void 0;
var lodash_1 = __importDefault(require("lodash"));
var utils_1 = require("./services/utils");
function sanitizeText(string) {
    return string.replace(' ', '');
}
exports.sanitizeText = sanitizeText;
function getQueryParam(query, param, splitBy) {
    if (lodash_1.default.isArray(query[param])) {
        return query[param];
    }
    return lodash_1.default.get(query, param) ? lodash_1.default.get(query, param).split(splitBy) : '';
}
exports.getQueryParam = getQueryParam;
function resolveMatch(query) {
    var matches = getQueryParam(query, 'match', ',');
    if (matches.length) {
        return matches.reduce(function (prev, curr) {
            var _a = curr.split(':'), key = _a[0], value = _a[1];
            if (lodash_1.default.endsWith(key, '!')) {
                prev[lodash_1.default.dropRight(key).join('')] = { $ne: value };
            }
            else {
                prev[key] = value;
            }
            return prev;
        }, {});
    }
    return {};
}
exports.resolveMatch = resolveMatch;
function resolvePick(query) {
    var toPick = getQueryParam(query, 'pick', ',');
    if (query.pick) {
        return toPick.reduce(function (prev, curr) {
            prev[curr] = 1;
            return prev;
        }, {});
    }
    return undefined;
}
exports.resolvePick = resolvePick;
function resolveOmit(query) {
    var toOmit = getQueryParam(query, 'omit', ',');
    if (query.omit) {
        return toOmit.reduce(function (prev, curr) {
            prev[curr] = 0;
            return prev;
        }, {});
    }
    return undefined;
}
exports.resolveOmit = resolveOmit;
function parseOp(op) {
    var ops = {
        '>': '$gt',
        '>=': '$gte',
        '<': '$lt',
        '<=': '$lte',
        '==': '$eq',
        '!=': '$ne'
    };
    return lodash_1.default.get(ops, op, op);
}
exports.parseOp = parseOp;
function resolveCompare(query) {
    var conditionals = getQueryParam(query, 'compare') || [];
    if (conditionals.every(function (cond) { return cond.split(':').length >= 3; })) {
        return conditionals.reduce(function (prev, curr) {
            var _a = curr.split(':'), key = _a[0], operator = _a[1];
            var value = lodash_1.default.drop(curr.split(':'), 2).join(':');
            lodash_1.default.set(prev, "".concat(key, ".").concat(parseOp(operator)), (0, utils_1.parseJSON)(value));
            return prev;
        }, {});
    }
    return {};
}
exports.resolveCompare = resolveCompare;
function resolvePagination(query) {
    var limit = parseInt(lodash_1.default.get(query, 'perPage') || lodash_1.default.get(query, 'limit'), 10);
    var page = lodash_1.default.get(query, 'page', 1);
    if (limit) {
        return {
            skip: limit * (page - 1),
            limit: limit
        };
    }
    return undefined;
}
exports.resolvePagination = resolvePagination;
function defaultQueryParser(element) {
    var _a = element.split(':'), field = _a[0], value = _a[1];
    var obj = {};
    obj[field] = value;
    return obj;
}
exports.defaultQueryParser = defaultQueryParser;
function parseQueryMethod(query, prop, parser) {
    if (parser === void 0) { parser = defaultQueryParser; }
    var toParse = getQueryParam(query, prop);
    if (query[prop]) {
        var toReturn = {};
        toReturn[prop] = toParse.map(parser);
        return toReturn;
    }
    return query[prop];
}
exports.parseQueryMethod = parseQueryMethod;
function getToPopulate(query) {
    return parseQueryMethod(query, 'populate', function (element) {
        var result = sanitizeText(element.replace(/\(|\)/g, ',')).split(',');
        return { path: result[0], select: lodash_1.default.drop(lodash_1.default.compact(result)) };
    });
}
exports.getToPopulate = getToPopulate;
function getToSort(query) {
    return parseQueryMethod(query, 'sort');
}
exports.getToSort = getToSort;
function applyMethods(query, mongoQuery) {
    var toApply = lodash_1.default.merge(getToSort(query), getToPopulate(query));
    Object.keys(toApply).forEach(function (key) {
        var values = toApply[key];
        values.forEach(function (value) {
            mongoQuery[key](value);
        });
    });
    return mongoQuery;
}
exports.applyMethods = applyMethods;
function resolveProjection(query) {
    return lodash_1.default.merge(resolveOmit(query), resolvePick(query));
}
exports.resolveProjection = resolveProjection;
function resolveArguments(query) {
    return lodash_1.default.merge(resolveMatch(query), resolveCompare(query));
}
exports.resolveArguments = resolveArguments;
//# sourceMappingURL=query.js.map