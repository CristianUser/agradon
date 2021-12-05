"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLogger = void 0;
require('colors');
function printContext(context) {
    if (context) {
        Object.keys(context).forEach(function (key) {
            console.log("      ".concat(key, ":"), context[key]);
        });
    }
}
function info(message, context) {
    console.info('INFO:'.green, "[".concat(new Date().toISOString(), "]"), message);
    printContext(context);
}
function error(message, context) {
    console.error('ERROR:'.red, "[".concat(new Date().toISOString(), "]"), message);
    printContext(context);
}
function warn(message, context) {
    console.warn('WARN:'.yellow, "[".concat(new Date().toISOString(), "]"), message);
    printContext(context);
}
function debug(message, context) {
    if (context === void 0) { context = {}; }
    console.debug('DEBUG:'.blue, "[".concat(new Date().toISOString(), "]"), message);
    printContext(context);
}
function createLogger(_context) {
    return {
        info: function (msg, context) {
            return info(msg, Object.assign(_context, context));
        },
        error: function (msg, context) {
            return error(msg, Object.assign(_context, context));
        },
        warn: function (msg, context) {
            return warn(msg, Object.assign(_context, context));
        },
        debug: function (msg, context) {
            return debug(msg, Object.assign(_context, context));
        }
    };
}
exports.createLogger = createLogger;
exports.default = createLogger;
//# sourceMappingURL=log.js.map