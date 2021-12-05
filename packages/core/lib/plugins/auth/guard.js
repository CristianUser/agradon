"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("./utils");
exports.default = (function (router, schemas, rootPath) {
    if (rootPath === void 0) { rootPath = ''; }
    var schemaList = Object.keys(schemas);
    var routes = [
        { method: 'get' },
        { method: 'post' },
        { method: 'get', param: 'id' },
        { method: 'put', param: 'id' },
        { method: 'delete', param: 'id' }
    ];
    schemaList.forEach(function (schemaName) {
        var schemaAuthConfig = schemas[schemaName]._auth;
        if (schemaAuthConfig) {
            routes.forEach(function (_a) {
                var method = _a.method, param = _a.param;
                if (schemaAuthConfig[method]) {
                    var routeStr = param
                        ? "".concat(rootPath, "/").concat(schemaName, "/:").concat(param)
                        : "".concat(rootPath, "/").concat(schemaName);
                    router[method](routeStr, (0, utils_1.verifyAuth)());
                }
            });
        }
    });
});
//# sourceMappingURL=guard.js.map