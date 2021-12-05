"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCrudHandlers = exports.defaultResponse = void 0;
var _a = require('../../query'), resolveArguments = _a.resolveArguments, resolveProjection = _a.resolveProjection, resolvePagination = _a.resolvePagination, applyMethods = _a.applyMethods;
function defaultResponse(toResponse, response) {
    return toResponse
        .then(function (data) { return response.json(data); })
        .catch(function (err) { return response.status(400).json(err); });
}
exports.defaultResponse = defaultResponse;
function createCrudHandlers(ModelClass) {
    var controller = {};
    controller.post = function (_a, res) {
        var body = _a.body;
        var newDocument = new ModelClass(body);
        return defaultResponse(newDocument.save(), res);
    };
    controller.get = function (_a, res) {
        var query = _a.query;
        var args = resolveArguments(query);
        var projection = resolveProjection(query);
        var options = resolvePagination(query);
        return defaultResponse(applyMethods(query, ModelClass.find(args, projection, options)), res);
    };
    controller.getById = function (_a, res) {
        var params = _a.params, query = _a.query;
        return defaultResponse(applyMethods(query, ModelClass.findById(params.id)), res);
    };
    controller.put = function (_a, res) {
        var body = _a.body, params = _a.params;
        return defaultResponse(ModelClass.updateOne({ _id: params.id }, body), res);
    };
    controller.delete = function (_a, res) {
        var params = _a.params;
        return defaultResponse(ModelClass.deleteOne({ _id: params.id }), res);
    };
    return controller;
}
exports.createCrudHandlers = createCrudHandlers;
//# sourceMappingURL=controllers.js.map