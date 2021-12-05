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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthPlugin = exports.mergeStrategies = exports.registerStrategies = void 0;
var passport_1 = __importDefault(require("passport"));
var files_1 = require("../../services/files");
var base_1 = require("../base");
var guard_1 = __importDefault(require("./guard"));
var routes_1 = __importDefault(require("./routes"));
var strategies_1 = __importDefault(require("./strategies"));
function registerStrategies(strategies) {
    if (strategies === void 0) { strategies = []; }
    strategies.forEach(function (strategy) {
        passport_1.default.use(strategy);
    });
}
exports.registerStrategies = registerStrategies;
function mergeStrategies(strategies, newStrategies) {
    if (newStrategies) {
        newStrategies.forEach(function (strategy) {
            var index = strategies.findIndex(function (_strategy) { return _strategy.name === strategy.name; });
            if (index >= 0) {
                strategies[index] = strategy;
            }
            else {
                strategies.push(strategy);
            }
        });
    }
    return strategies;
}
exports.mergeStrategies = mergeStrategies;
exports.default = {};
var AuthPlugin = (function (_super) {
    __extends(AuthPlugin, _super);
    function AuthPlugin(config) {
        if (config === void 0) { config = {}; }
        var _this = _super.call(this) || this;
        var parsedConfig = __assign({ strategies: (0, strategies_1.default)(), userModel: 'User', enableRoutes: true }, config);
        parsedConfig.strategies = mergeStrategies((0, strategies_1.default)(), config.strategies);
        _this.config = parsedConfig;
        return _this;
    }
    AuthPlugin.prototype.load = function (app, fileSets, _a) {
        var rootPath = _a.rootPath;
        var schemas = (0, files_1.getFileGroup)(fileSets, 'schema');
        registerStrategies(this.config.strategies);
        (0, guard_1.default)(app, schemas, rootPath);
        if (this.config.enableRoutes) {
            (0, routes_1.default)(app);
        }
    };
    return AuthPlugin;
}(base_1.AgradonPlugin));
exports.AuthPlugin = AuthPlugin;
__exportStar(require("./utils"), exports);
//# sourceMappingURL=index.js.map