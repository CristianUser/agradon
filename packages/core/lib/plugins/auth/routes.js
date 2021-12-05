"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.localRoute = exports.createRoutesByProvider = void 0;
var passport_1 = __importDefault(require("passport"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function createRoutesByProvider(router, provider) {
    router.get("/auth/".concat(provider), passport_1.default.authenticate(provider));
    router.get("/auth/".concat(provider, "/callback"), passport_1.default.authenticate(provider, { successRedirect: '/', failureRedirect: '/login' }));
}
exports.createRoutesByProvider = createRoutesByProvider;
function localRoute(req, res) {
    passport_1.default.authenticate('local', { session: false }, function (err, user, info) {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user
            });
        }
        req.login(user, { session: false }, function (error) {
            if (error) {
                return res.send(error);
            }
            var token = jsonwebtoken_1.default.sign(JSON.stringify(user), process.env.JWT_SECRET || 'your_jwt_secret');
            return res.json({ user: user, token: token });
        });
    })(req, res);
}
exports.localRoute = localRoute;
exports.default = (function (router) {
    router.post('/auth/local', localRoute);
});
//# sourceMappingURL=routes.js.map