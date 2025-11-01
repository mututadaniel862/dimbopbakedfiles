"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.generateRandomPassword = exports.generateOTP = exports.zodToJsonSchema = exports.updateUserSchema = exports.forgotPasswordSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.loginSchema = exports.digitalMarketerAdminLoginSchema = exports.superAdminLoginSchema = exports.verifyOTPSchema = exports.requestOTPSchema = exports.clientRegisterSchema = exports.clientAdminLoginSchema = exports.clientAdminRegisterSchema = exports.AuthProvider = exports.UserRole = exports.PREDEFINED_USERS = void 0;
const zod_1 = require("zod");
const zod_to_json_schema_1 = require("zod-to-json-schema");
// SIMPLIFIED: Just require 6+ characters with at least 1 number
const simplePasswordRegex = /^(?=.*\d).{6,}$/;
// FLEXIBLE: Accept any reasonable phone format
const flexiblePhoneRegex = /^(\+?263|0)?[1-9]\d{6,9}$/;
// ============================================
// PRE-DEFINED SYSTEM USERS (ONLY SUPER ADMIN & DIGITAL MARKETERS)
// ============================================
exports.PREDEFINED_USERS = {
    super_admin: {
        username: 'super_admin',
        email: 'super.admin@zimnextsmile.com',
        password: 'SAdm%2025!G7kL',
        phone: null,
        role: 'super_admin'
    },
    digital_marketer_admins: [
        {
            username: 'dmark_alpha',
            email: 'dmark.alpha@zimnextsmiling.com',
            password: 'DMkt!Alpha2025#',
            phone: '+263774000001',
            role: 'digital_marketer_admin'
        },
        {
            username: 'dmark_beta',
            email: 'dmark.beta@zimnextsmiling.com',
            password: 'DMkt!Beta2025#',
            phone: '+263775000002',
            role: 'digital_marketer_admin'
        }
    ]
    // NO predefined client_admin or clients - they ALL register themselves
};
// ============================================
// USER ROLES AND TYPES
// ============================================
exports.UserRole = zod_1.z.enum(['super_admin', 'digital_marketer_admin', 'client_admin', 'client']);
exports.AuthProvider = zod_1.z.enum(['email', 'google', 'apple', 'facebook']);
// ============================================
// CLIENT ADMIN (MERCHANT) REGISTRATION - GOOGLE SIGN-UP
// ============================================
exports.clientAdminRegisterSchema = zod_1.z.object({
    merchantName: zod_1.z.string().min(2, { message: 'Merchant name must be at least 2 characters' }).max(200),
    email: zod_1.z.string().email({ message: 'Please enter a valid email address' }),
    phone: zod_1.z.string()
        .min(9, { message: 'Phone number too short' })
        .max(15, { message: 'Phone number too long' })
        .regex(flexiblePhoneRegex, {
        message: 'Please enter a valid phone number'
    }),
    physicalAddress: zod_1.z.string().min(5, { message: 'Physical address is required' }),
    geoLocation: zod_1.z.object({
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180)
    }),
    authProvider: zod_1.z.literal('google'), // Client admins MUST use Google
    googleId: zod_1.z.string().optional(), // Google user ID
    password: zod_1.z.string().optional(), // Not needed for Google auth
    role: zod_1.z.literal('client_admin')
});
// ============================================
// CLIENT ADMIN (MERCHANT) LOGIN
// ============================================
exports.clientAdminLoginSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Please enter a valid email address' }),
    authProvider: zod_1.z.literal('google'),
    googleId: zod_1.z.string().optional(),
    role: zod_1.z.literal('client_admin')
});
// ============================================
// CLIENT (CUSTOMER) REGISTRATION - SOCIAL OR EMAIL WITH OTP
// ============================================
exports.clientRegisterSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { message: 'Name must be at least 2 characters' }).max(100),
    email: zod_1.z.string().email({ message: 'Please enter a valid email address' }),
    phone: zod_1.z.string()
        .min(9, { message: 'Phone number too short' })
        .max(15, { message: 'Phone number too long' })
        .regex(flexiblePhoneRegex, {
        message: 'Please enter a valid phone number'
    }),
    authProvider: exports.AuthProvider, // google, apple, facebook, or email
    googleId: zod_1.z.string().optional(),
    appleId: zod_1.z.string().optional(),
    facebookId: zod_1.z.string().optional(),
    password: zod_1.z.string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .regex(simplePasswordRegex, {
        message: 'Password must contain at least 1 number'
    })
        .optional(), // Only required if authProvider is 'email'
    confirmPassword: zod_1.z.string().optional(),
    role: zod_1.z.literal('client')
}).refine(data => {
    if (data.authProvider === 'email') {
        return data.password && data.password.length >= 6;
    }
    return true;
}, {
    message: 'Password is required for email registration',
    path: ['password']
}).refine(data => {
    if (data.authProvider === 'email' && data.password && data.confirmPassword) {
        return data.password === data.confirmPassword;
    }
    return true;
}, {
    message: "Passwords don't match",
    path: ['confirmPassword']
});
// ============================================
// EMAIL VERIFICATION (OTP)
// ============================================
exports.requestOTPSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Please enter a valid email address' }),
    purpose: zod_1.z.enum(['registration', 'login', 'verification'])
});
exports.verifyOTPSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Please enter a valid email address' }),
    otp: zod_1.z.string().length(6, { message: 'OTP must be 6 digits' })
});
// ============================================
// SUPER ADMIN LOGIN (Must provide phone on first login)
// ============================================
exports.superAdminLoginSchema = zod_1.z.object({
    username: zod_1.z.literal('super_admin'),
    password: zod_1.z.string().min(1, { message: 'Password is required' }),
    phone: zod_1.z.string()
        .min(9, { message: 'Phone number too short' })
        .max(15, { message: 'Phone number too long' })
        .regex(flexiblePhoneRegex, {
        message: 'Please enter a valid phone number'
    })
        .optional(),
    role: zod_1.z.literal('super_admin')
});
// ============================================
// DIGITAL MARKETER ADMIN LOGIN (Pre-defined with phones)
// ============================================
exports.digitalMarketerAdminLoginSchema = zod_1.z.object({
    username: zod_1.z.enum(['dmark_alpha', 'dmark_beta']),
    password: zod_1.z.string().min(1, { message: 'Password is required' }),
    role: zod_1.z.literal('digital_marketer_admin')
});
// ============================================
// UNIVERSAL LOGIN SCHEMA (All user types)
// ============================================
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string().optional(), // For admins
    email: zod_1.z.string().email().optional(), // For clients/client_admins
    password: zod_1.z.string().min(1, { message: 'Password is required' }).optional(),
    phone: zod_1.z.string().regex(flexiblePhoneRegex).optional(),
    authProvider: exports.AuthProvider.optional(),
    googleId: zod_1.z.string().optional(),
    appleId: zod_1.z.string().optional(),
    facebookId: zod_1.z.string().optional(),
    role: exports.UserRole.optional()
}).refine(data => data.username || data.email, {
    message: 'Either username or email is required',
    path: ['username']
});
// ============================================
// PASSWORD RESET SCHEMAS
// ============================================
exports.changePasswordSchema = zod_1.z.object({
    currentPassword: zod_1.z.string().min(1, { message: 'Current password is required' }),
    newPassword: zod_1.z.string()
        .min(6, { message: 'New password must be at least 6 characters' })
        .regex(simplePasswordRegex, {
        message: 'New password must contain at least 1 number'
    }),
    confirmNewPassword: zod_1.z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"]
}).refine(data => data.currentPassword !== data.newPassword, {
    message: "New password must be different from current password",
    path: ["newPassword"]
});
exports.resetPasswordSchema = zod_1.z.object({
    token: zod_1.z.string(),
    newPassword: zod_1.z.string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .regex(simplePasswordRegex, {
        message: 'Password must contain at least 1 number'
    }),
    confirmNewPassword: zod_1.z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ["confirmNewPassword"]
});
exports.forgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email({ message: 'Please enter a valid email address' })
});
// ============================================
// USER MANAGEMENT SCHEMAS
// ============================================
exports.updateUserSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    merchantName: zod_1.z.string().min(2).max(200).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().regex(flexiblePhoneRegex).optional(),
    physicalAddress: zod_1.z.string().optional(),
    geoLocation: zod_1.z.object({
        latitude: zod_1.z.number().min(-90).max(90),
        longitude: zod_1.z.number().min(-180).max(180)
    }).optional(),
    isActive: zod_1.z.boolean().optional()
});
// ============================================
// HELPER FUNCTIONS
// ============================================
const zodToJsonSchema = (schema) => {
    const jsonSchema = (0, zod_to_json_schema_1.zodToJsonSchema)(schema);
    return jsonSchema.definitions ? jsonSchema.definitions[schema.description || ''] || jsonSchema : jsonSchema;
};
exports.zodToJsonSchema = zodToJsonSchema;
// Generate 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
// Helper to generate random passwords
const generateRandomPassword = (length = 12) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    if (!/\d/.test(password)) {
        const randomIndex = Math.floor(Math.random() * length);
        const randomNumber = Math.floor(Math.random() * 10).toString();
        password = password.substring(0, randomIndex) + randomNumber + password.substring(randomIndex + 1);
    }
    return password;
};
exports.generateRandomPassword = generateRandomPassword;
// Export all schemas
exports.schemas = {
    superAdminLoginSchema: exports.superAdminLoginSchema,
    digitalMarketerAdminLoginSchema: exports.digitalMarketerAdminLoginSchema,
    clientAdminRegisterSchema: exports.clientAdminRegisterSchema,
    clientAdminLoginSchema: exports.clientAdminLoginSchema,
    clientRegisterSchema: exports.clientRegisterSchema,
    loginSchema: exports.loginSchema,
    requestOTPSchema: exports.requestOTPSchema,
    verifyOTPSchema: exports.verifyOTPSchema,
    changePasswordSchema: exports.changePasswordSchema,
    resetPasswordSchema: exports.resetPasswordSchema,
    forgotPasswordSchema: exports.forgotPasswordSchema,
    updateUserSchema: exports.updateUserSchema
};
//# sourceMappingURL=schemas.js.map