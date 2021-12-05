"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuth = void 0;
var passport_1 = __importDefault(require("passport"));
var verifyAuth = function () { return passport_1.default.authenticate('jwt', { session: false }); };
exports.verifyAuth = verifyAuth;
exports.default = { verifyAuth: exports.verifyAuth };
//# sourceMappingURL=utils.js.map