"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = exports.authenticate = void 0;
const jwt_1 = require("../utils/jwt");
const authenticate = async (request, reply) => {
    try {
        const authHeader = request.headers.authorization;
        if (!authHeader) {
            return reply.code(401).send({
                success: false,
                error: 'Authorization header missing'
            });
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            return reply.code(401).send({
                success: false,
                error: 'Token missing'
            });
        }
        const decoded = (0, jwt_1.verifyToken)(token);
        request.user = decoded;
    }
    catch (error) {
        return reply.code(401).send({
            success: false,
            error: 'Invalid or expired token'
        });
    }
};
exports.authenticate = authenticate;
const authorize = (roles) => {
    return async (request, reply) => {
        await (0, exports.authenticate)(request, reply);
        if (!request.user) {
            return reply.code(401).send({
                success: false,
                error: 'Unauthorized'
            });
        }
        if (!roles.includes(request.user.role)) {
            return reply.code(403).send({
                success: false,
                error: 'Forbidden'
            });
        }
    };
};
exports.authorize = authorize;
//# sourceMappingURL=auth.js.map