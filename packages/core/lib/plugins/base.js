"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgradonPlugin = void 0;
var AgradonPlugin = (function () {
    function AgradonPlugin() {
    }
    AgradonPlugin.prototype.load = function (app, fileSets, agradonConfig) {
        console.log({ app: app, fileSets: fileSets, agradonConfig: agradonConfig });
    };
    return AgradonPlugin;
}());
exports.AgradonPlugin = AgradonPlugin;
exports.default = {};
//# sourceMappingURL=base.js.map