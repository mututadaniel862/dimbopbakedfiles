"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schemas = exports.SUBSCRIPTION_PLANS = exports.approvePaymentSchema = exports.chooseSubscriptionPlanSchema = exports.uploadActivationPaymentSchema = exports.generateReferralLinkSchema = exports.processAgentApplicationSchema = exports.registerAsProductAgentSchema = exports.generateRandomPassword = exports.generateOTP = exports.zodToJsonSchema = exports.updateUserSchema = exports.forgotPasswordSchema = exports.resetPasswordSchema = exports.changePasswordSchema = exports.loginSchema = exports.digitalMarketerAdminLoginSchema = exports.superAdminLoginSchema = exports.verifyOTPSchema = exports.requestOTPSchema = exports.clientRegisterSchema = exports.clientAdminLoginSchema = exports.clientAdminRegisterSchema = exports.completePayoutSchema = exports.approveCommissionSchema = exports.createPayoutSchema = exports.recordAgentSaleSchema = exports.agentRegisterSchema = exports.registerNewAgentSchema = exports.AuthProvider = exports.UserRole = exports.PREDEFINED_USERS = void 0;
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
        password: 'SuperAdmin@2025',
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
};
// ============================================
// USER ROLES AND TYPES
// ============================================
exports.UserRole = zod_1.z.enum(['super_admin', 'digital_marketer_admin', 'client_admin', 'client']);
exports.AuthProvider = zod_1.z.enum(['email', 'google', 'apple', 'facebook']);
// ============================================
// NEW AGENT REGISTRATION - DIRECT SIGN UP
// ============================================
exports.registerNewAgentSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, { message: 'Name must be at least 2 characters' }).max(100),
    email: zod_1.z.string().email({ message: 'Please enter a valid email address' }),
    phone: zod_1.z.string()
        .min(9, { message: 'Phone number too short' })
        .max(15, { message: 'Phone number too long' })
        .regex(flexiblePhoneRegex, {
        message: 'Please enter a valid phone number'
    }),
    password: zod_1.z.string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .regex(simplePasswordRegex, {
        message: 'Password must contain at least 1 number'
    }),
    confirmPassword: zod_1.z.string(),
    commissionRate: zod_1.z.number()
        .min(0.1)
        .max(50)
        .optional()
        .default(5.0),
    payoutMethod: zod_1.z.enum(['ecocash', 'bank', 'paynow', 'onemoney', 'telecash']).optional(),
    payoutNumber: zod_1.z.string().min(9).optional(),
    payoutName: zod_1.z.string().optional(),
    minPayoutAmount: zod_1.z.number().min(1).optional().default(10.0),
    role: zod_1.z.literal('agent').optional()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
});
// ============================================
// AGENT REGISTRATION & MANAGEMENT SCHEMAS
// ============================================
exports.agentRegisterSchema = zod_1.z.object({
    commissionRate: zod_1.z.number()
        .min(0, { message: 'Commission rate must be at least 0%' })
        .max(100, { message: 'Commission rate cannot exceed 100%' })
        .optional()
        .default(5.0),
    payoutMethod: zod_1.z.enum(['ecocash', 'bank', 'paynow', 'onemoney', 'telecash'])
        .optional(),
    payoutNumber: zod_1.z.string()
        .min(9, { message: 'Payout number too short' })
        .max(20, { message: 'Payout number too long' })
        .optional(),
    payoutName: zod_1.z.string()
        .min(2, { message: 'Payout name must be at least 2 characters' })
        .max(100)
        .optional(),
    minPayoutAmount: zod_1.z.number()
        .min(1, { message: 'Minimum payout amount must be at least $1' })
        .optional()
        .default(10.0)
});
exports.recordAgentSaleSchema = zod_1.z.object({
    orderId: zod_1.z.number().int().positive({ message: 'Valid order ID is required' }),
    agentCode: zod_1.z.string()
        .min(4, { message: 'Agent code must be at least 4 characters' })
        .max(20, { message: 'Agent code too long' })
});
exports.createPayoutSchema = zod_1.z.object({
    agentId: zod_1.z.number().int().positive({ message: 'Valid agent ID is required' }),
    amount: zod_1.z.number()
        .positive({ message: 'Payout amount must be greater than 0' })
        .min(1, { message: 'Minimum payout is $1' }),
    paymentMethod: zod_1.z.enum(['ecocash', 'bank', 'paynow', 'onemoney', 'telecash']),
    paymentReference: zod_1.z.string().optional(),
    payoutAccount: zod_1.z.string().optional(),
    fromDate: zod_1.z.string().refine(date => !isNaN(Date.parse(date)), {
        message: 'Invalid from date'
    }),
    toDate: zod_1.z.string().refine(date => !isNaN(Date.parse(date)), {
        message: 'Invalid to date'
    })
}).refine(data => new Date(data.fromDate) <= new Date(data.toDate), {
    message: 'From date must be before or equal to to date',
    path: ['toDate']
});
exports.approveCommissionSchema = zod_1.z.object({
    saleId: zod_1.z.number().int().positive({ message: 'Valid sale ID is required' })
});
exports.completePayoutSchema = zod_1.z.object({
    payoutId: zod_1.z.number().int().positive({ message: 'Valid payout ID is required' })
});
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
    // authProvider: z.literal('google'),
    authProvider: zod_1.z.enum(['google', 'email']),
    googleId: zod_1.z.string().optional(),
    password: zod_1.z.string().optional(),
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
    authProvider: exports.AuthProvider,
    googleId: zod_1.z.string().optional(),
    appleId: zod_1.z.string().optional(),
    facebookId: zod_1.z.string().optional(),
    password: zod_1.z.string()
        .min(6, { message: 'Password must be at least 6 characters' })
        .regex(simplePasswordRegex, {
        message: 'Password must contain at least 1 number'
    })
        .optional(),
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
// SUPER ADMIN LOGIN
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
// DIGITAL MARKETER ADMIN LOGIN
// ============================================
exports.digitalMarketerAdminLoginSchema = zod_1.z.object({
    username: zod_1.z.enum(['dmark_alpha', 'dmark_beta']),
    password: zod_1.z.string().min(1, { message: 'Password is required' }),
    role: zod_1.z.literal('digital_marketer_admin')
});
// ============================================
// UNIVERSAL LOGIN SCHEMA
// ============================================
exports.loginSchema = zod_1.z.object({
    username: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
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
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOTP = generateOTP;
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
exports.registerAsProductAgentSchema = zod_1.z.object({
    productId: zod_1.z.number().int().positive({ message: 'Valid product ID is required' }),
    // Identity Verification
    fullName: zod_1.z.string().min(2, { message: 'Full name is required' }).max(100),
    nationalId: zod_1.z.string().min(5, { message: 'National ID is required' }),
    // Payment Details (Choose ONE)
    payoutMethod: zod_1.z.enum(['ecocash', 'bank', 'paynow', 'onemoney', 'telecash']),
    payoutNumber: zod_1.z.string().min(9).optional(), // For mobile money
    bankName: zod_1.z.string().optional(),
    bankAccountNumber: zod_1.z.string().optional(),
    bankAccountName: zod_1.z.string().optional(),
    // Agreement
    acceptedTerms: zod_1.z.boolean().refine(val => val === true, {
        message: 'You must accept the terms and conditions'
    }),
    // Optional
    reason: zod_1.z.string().max(500).optional()
}).refine(data => {
    if (data.payoutMethod === 'bank') {
        return data.bankName && data.bankAccountNumber && data.bankAccountName;
    }
    return data.payoutNumber;
}, {
    message: 'Payment details are required based on selected payout method',
    path: ['payoutNumber']
});
// Admin approves/rejects agent application
exports.processAgentApplicationSchema = zod_1.z.object({
    applicationId: zod_1.z.number().int().positive(),
    action: zod_1.z.enum(['approve', 'reject']),
    rejectionReason: zod_1.z.string().min(10).optional(),
    commissionRate: zod_1.z.number().min(0.1).max(50).optional()
});
// Generate referral link
exports.generateReferralLinkSchema = zod_1.z.object({
    productId: zod_1.z.number().int().positive(),
});
// ============================================
// SUBSCRIPTION PLANS & PAYMENT
// ============================================
// Payment proof upload for activation ($1)
exports.uploadActivationPaymentSchema = zod_1.z.object({
    paymentMethod: zod_1.z.enum(['ecocash', 'paynow']),
    phoneNumber: zod_1.z.string()
        .min(9, { message: 'Phone number too short' })
        .regex(flexiblePhoneRegex, { message: 'Invalid phone number' }),
    transactionReference: zod_1.z.string().min(5, { message: 'Transaction reference required' }),
    amount: zod_1.z.number().min(1, { message: 'Amount must be at least $1' }),
    paymentProof: zod_1.z.string().optional(), // Base64 image or file URL
    merchantId: zod_1.z.number().int().positive()
});
// Choose subscription plan
exports.chooseSubscriptionPlanSchema = zod_1.z.object({
    planType: zod_1.z.enum(['3_months', '6_months', '1_year']),
    paymentMethod: zod_1.z.enum(['ecocash', 'paynow']),
    phoneNumber: zod_1.z.string().regex(flexiblePhoneRegex),
    transactionReference: zod_1.z.string().min(5),
    paymentProof: zod_1.z.string().optional(), // Base64 image or file URL
    merchantId: zod_1.z.number().int().positive()
});
// Admin approve/reject payment
exports.approvePaymentSchema = zod_1.z.object({
    paymentId: zod_1.z.number().int().positive(),
    action: zod_1.z.enum(['approve', 'reject']),
    rejectionReason: zod_1.z.string().min(10).optional()
});
// Subscription plan pricing
exports.SUBSCRIPTION_PLANS = {
    '3_months': {
        duration: 90, // days
        price: 15, // USD
        name: '3 Months Plan'
    },
    '6_months': {
        duration: 180, // days
        price: 25, // USD
        name: '6 Months Plan'
    },
    '1_year': {
        duration: 365, // days
        price: 40, // USD
        name: '1 Year Plan'
    }
};
// ============================================
// EXPORT ALL SCHEMAS
// ============================================
exports.schemas = {
    // Auth schemas
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
    updateUserSchema: exports.updateUserSchema,
    // ✅ Agent schemas
    agentRegisterSchema: exports.agentRegisterSchema,
    registerNewAgentSchema: exports.registerNewAgentSchema,
    recordAgentSaleSchema: exports.recordAgentSaleSchema,
    createPayoutSchema: exports.createPayoutSchema,
    approveCommissionSchema: exports.approveCommissionSchema,
    completePayoutSchema: exports.completePayoutSchema,
    registerAsProductAgentSchema: exports.registerAsProductAgentSchema,
    processAgentApplicationSchema: exports.processAgentApplicationSchema,
    generateReferralLinkSchema: exports.generateReferralLinkSchema,
    // ✅ Subscription schemas - ADD THESE
    uploadActivationPaymentSchema: exports.uploadActivationPaymentSchema,
    chooseSubscriptionPlanSchema: exports.chooseSubscriptionPlanSchema,
    approvePaymentSchema: exports.approvePaymentSchema,
    SUBSCRIPTION_PLANS: exports.SUBSCRIPTION_PLANS
};
//# sourceMappingURL=schemas.js.map