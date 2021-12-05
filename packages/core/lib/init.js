"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = exports.loadPlugins = exports.registerRoutes = void 0;
var express_1 = __importDefault(require("express"));
var files_1 = require("./services/files");
var crud_1 = require("./crud");
var log_1 = require("./services/log");
var log = (0, log_1.createLogger)({ file: __filename });
var pkg = require('../package.json');
function registerRoutes(app, _a, fileSets) {
    var rootPath = _a.rootPath, db = _a.db;
    var controllers = (0, files_1.getFileGroup)(fileSets, 'controller') || {};
    for (var entity in db.models) {
        var entityModel = db.models[entity];
        var entityRouter = express_1.default.Router();
        if (controllers[entity]) {
            controllers[entity](entityRouter, entityModel);
        }
        (0, crud_1.createDefaultCRUD)(entityRouter, entity, db);
        app.use("".concat(rootPath || '', "/").concat(entity), entityRouter);
    }
}
exports.registerRoutes = registerRoutes;
function loadPlugins(app, fileSets, agradonConfig) {
    var _a = agradonConfig.plugins, plugins = _a === void 0 ? [] : _a;
    plugins.forEach(function (plugin) {
        plugin.load(app, fileSets, agradonConfig);
    });
}
exports.loadPlugins = loadPlugins;
function init(config) {
    var fileSets = (0, files_1.readDirectory)('src/entities');
    var app = config.app, db = config.db;
    app.use(express_1.default.json());
    app.use(function (req, res, next) {
        res.set('X-Powered-By', "Agradon V-".concat(pkg.version));
        next();
    });
    return db
        .loadModels(fileSets)
        .connect()
        .then(function () {
        loadPlugins(app, fileSets, config);
        registerRoutes(app, config, fileSets);
        log.info('Agradon Loaded 👀 ⭐️', { version: pkg.version });
        return app;
    })
        .catch(log.error);
}
exports.init = init;
//# sourceMappingURL=init.js.map