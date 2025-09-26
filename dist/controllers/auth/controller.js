"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.getAllUsers = exports.getUser = exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.login = exports.register = void 0;
const schemas_1 = require("../../utils/schemas");
const authService = __importStar(require("../../services/auth")); // Updated import path
const jwt_1 = require("../../utils/jwt");
// export const register = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const validatedData = registerSchema.parse(request.body);
//     const user = await authService.registerUser(validatedData);
//     const token = generateToken(user);
//     reply.code(201).send({
//       success: true,
//       data: {
//         user: {
//           id: user.id,
//           username: user.username,
//           email: user.email,
//           role: user.role
//         },
//         token
//       }
//     });
//   } catch (error: any) {
//     reply.code(400).send({
//       success: false,
//       error: error.message || 'Registration failed'
//     });
//   }
// };
// In your register controller
const register = async (request, reply) => {
    try {
        const validatedData = schemas_1.registerSchema.parse(request.body);
        const user = await authService.registerUser(validatedData);
        const token = (0, jwt_1.generateToken)(user);
        reply.code(201).send({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    phone: user.phone, // Include phone in response
                    role: user.role
                },
                token
            }
        });
    }
    catch (error) {
        reply.code(400).send({
            success: false,
            error: error.message || 'Registration failed'
        });
    }
};
exports.register = register;
const login = async (request, reply) => {
    try {
        const validatedData = schemas_1.loginSchema.parse(request.body);
        const user = await authService.loginUser(validatedData);
        const token = (0, jwt_1.generateToken)(user);
        reply.code(200).send({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });
    }
    catch (error) {
        reply.code(401).send({
            success: false,
            error: error.message || 'Login failed'
        });
    }
};
exports.login = login;
// export const changePassword = async (request: FastifyRequest, reply: FastifyReply) => {
//   try {
//     const user = request.user as users;
//     const validatedData = changePasswordSchema.parse(request.body);
//     await authService.changePassword(user.id, validatedData);
//     reply.code(200).send({
//       success: true,
//       message: 'Password changed successfully'
//     });
//   } catch (error: any) {
//     reply.code(400).send({
//       success: false,
//       error: error.message || 'Password change failed'
//     });
//   }
// };
// src/controllers/auth/controller.ts
// ... (previous imports remain the same)
const changePassword = async (request, reply) => {
    try {
        // Get authenticated user from request (added by your JWT middleware)
        const user = request.user;
        // Parse request body
        const { currentPassword, newPassword } = request.body;
        // Call service to change password
        await authService.changePassword(user.id, currentPassword, newPassword);
        reply.code(200).send({
            success: true,
            message: 'Password changed successfully'
        });
    }
    catch (error) {
        reply.code(400).send({
            success: false,
            error: error.message || 'Password change failed'
        });
    }
};
exports.changePassword = changePassword;
const forgotPassword = async (request, reply) => {
    try {
        const validatedData = schemas_1.forgotPasswordSchema.parse(request.body);
        await authService.forgotPassword(validatedData.email);
        reply.code(200).send({
            success: true,
            message: 'If an account with that email exists, a reset link has been sent'
        });
    }
    catch (error) {
        reply.code(400).send({
            success: false,
            error: error.message || 'Password reset failed'
        });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (request, reply) => {
    try {
        const validatedData = schemas_1.resetPasswordSchema.parse(request.body);
        await authService.resetPassword(validatedData);
        reply.code(200).send({
            success: true,
            message: 'Password reset successfully'
        });
    }
    catch (error) {
        reply.code(400).send({
            success: false,
            error: error.message || 'Password reset failed'
        });
    }
};
exports.resetPassword = resetPassword;
const getUser = async (request, reply) => {
    try {
        // Explicitly type query to match the service's expected input
        const { username, email } = request.query;
        if (!username && !email) {
            return reply.code(400).send({ success: false, error: 'Username or email required' });
        }
        // Pass the object as-is, TypeScript should now accept it
        const user = await authService.getUser({ username, email });
        if (!user) {
            return reply.code(404).send({ success: false, error: 'User not found' });
        }
        reply.code(200).send({
            success: true,
            data: user
        });
    }
    catch (error) {
        reply.code(500).send({
            success: false,
            error: error.message || 'Failed to fetch user'
        });
    }
};
exports.getUser = getUser;
const getAllUsers = async (request, reply) => {
    try {
        const users = await authService.getAllUsers();
        reply.code(200).send({
            success: true,
            data: users
        });
    }
    catch (error) {
        reply.code(500).send({
            success: false,
            error: error.message || 'Failed to fetch users'
        });
    }
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (request, reply) => {
    try {
        // Get the authenticated user making the request
        const requestingUser = request.user;
        // Get the user ID to delete from route params
        const { id } = request.params;
        const userIdToDelete = parseInt(id);
        // Validate the ID
        if (isNaN(userIdToDelete)) {
            return reply.code(400).send({ success: false, error: 'Invalid user ID' });
        }
        await authService.deleteUser(userIdToDelete);
        reply.code(200).send({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        const statusCode = error.message.includes('not found') ? 404 : 500;
        reply.code(statusCode).send({
            success: false,
            error: error.message || 'Failed to delete user'
        });
    }
};
exports.deleteUser = deleteUser;
//# sourceMappingURL=controller.js.map