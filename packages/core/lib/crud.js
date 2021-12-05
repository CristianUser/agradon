"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultCRUD = exports.createCrudRoutes = void 0;
var lodash_1 = __importDefault(require("lodash"));
var controllers_1 = require("./services/controllers");
function getPath(_a) {
    var param = _a.param;
    return param ? "/:".concat(param) : '/';
}
function createCrudRoutes(router, controller) {
    var routes = [
        { method: 'get' },
        { method: 'get', handler: 'getById', param: 'id' },
        { method: 'post' },
        { method: 'put', param: 'id' },
        { method: 'delete', param: 'id' }
    ];
    for (var _i = 0, routes_1 = routes; _i < routes_1.length; _i++) {
        var route = routes_1[_i];
        var routeHandler = lodash_1.default.get(controller, route.handler || route.method);
        if (routeHandler) {
            router[route.method](getPath(route), routeHandler);
        }
    }
    return router;
}
exports.createCrudRoutes = createCrudRoutes;
function createDefaultCRUD(router, modelName, db) {
    return createCrudRoutes(router, (0, controllers_1.createCrudHandlers)(db.getRepository(modelName)));
}
exports.createDefaultCRUD = createDefaultCRUD;
//# sourceMappingURL=crud.js.map