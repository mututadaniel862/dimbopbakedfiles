"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.zodToJsonSchema = exports.forgotPasswordSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const zod_to_json_schema_1 = require("zod-to-json-schema");
const passwordRegex = /^(?=(.*\d){2,})(?=(.*[!@?#$%^&*()\-_=+{};:,<.>]){2,})(?=(.*[A-Z]){2,})(?=(.*[a-z]){2,}).{8,15}$/;
// Zimbabwean phone number regex (accepts formats: +263..., 263..., 0...)
const zimbabwePhoneRegex = /^(\+263|263|0)(7[7-8|1|3]|7[0-9])\d{7}$/;
exports.registerSchema = zod_1.z.object({
    username: zod_1.z.string().min(3).max(100),
    email: zod_1.z.string().email(),
    password: zod_1.z.string().regex(passwordRegex, {
        message: 'Password must contain at least 2 numbers, 2 special characters, 2 uppercase, 2 lowercase letters, and be 8-15 characters long'
    }),
    confirmPassword: zod_1.z.string(),
    phone: zod_1.z.string().regex(zimbabwePhoneRegex, {
        message: 'Please provide a valid Zimbabwean phone number (e.g., +263771234567, 0771234567)'
    }),
    role: zod_1.z.enum(['user', 'admin']).default('user') // Add this line
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"]
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string()
});
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string(),
    newPassword: zod_1.z.string().regex(passwordRegex, {
        message: 'Password must contain at least 2 numbers, 2 special characters, 2 uppercase, 2 lowercase letters, and be 8-15 characters long'
    }),
    confirmNewPassword: zod_1.z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"]
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string(),
    newPassword: zod_1.z.string().regex(passwordRegex, {
        message: 'Password must contain at least 2 numbers, 2 special characters, 2 uppercase, 2 lowercase letters, and be 8-15 characters long'
    }),
    confirmNewPassword: zod_1.z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"]
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email()
});
const zodToJsonSchema = (schema) => {
    const jsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(schema);
    return jsonSchema.definitions ? jsonSchema.definitions[schema.description || ''] || jsonSchema : jsonSchema;
};
exports.zodToJsonSchema = zodToJsonSchema;
//# sourceMappingURL=schemas.js.map