import { z } from 'zod';
export declare const PREDEFINED_USERS: {
    super_admin: {
        username: string;
        email: string;
        password: string;
        phone: null;
        role: "super_admin";
    };
    digital_marketer_admins: {
        username: string;
        email: string;
        password: string;
        phone: string;
        role: "digital_marketer_admin";
    }[];
};
export declare const UserRole: z.ZodEnum<["super_admin", "digital_marketer_admin", "client_admin", "client"]>;
export type UserRole = z.infer<typeof UserRole>;
export declare const AuthProvider: z.ZodEnum<["email", "google", "apple", "facebook"]>;
export type AuthProvider = z.infer<typeof AuthProvider>;
export declare const registerNewAgentSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    commissionRate: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    payoutMethod: z.ZodOptional<z.ZodEnum<["ecocash", "bank", "paynow", "onemoney", "telecash"]>>;
    payoutNumber: z.ZodOptional<z.ZodString>;
    payoutName: z.ZodOptional<z.ZodString>;
    minPayoutAmount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    role: z.ZodOptional<z.ZodLiteral<"agent">>;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    phone: string;
    password: string;
    confirmPassword: string;
    commissionRate: number;
    minPayoutAmount: number;
    payoutMethod?: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash" | undefined;
    payoutNumber?: string | undefined;
    payoutName?: string | undefined;
    role?: "agent" | undefined;
}, {
    email: string;
    name: string;
    phone: string;
    password: string;
    confirmPassword: string;
    commissionRate?: number | undefined;
    payoutMethod?: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash" | undefined;
    payoutNumber?: string | undefined;
    payoutName?: string | undefined;
    minPayoutAmount?: number | undefined;
    role?: "agent" | undefined;
}>, {
    email: string;
    name: string;
    phone: string;
    password: string;
    confirmPassword: string;
    commissionRate: number;
    minPayoutAmount: number;
    payoutMethod?: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash" | undefined;
    payoutNumber?: string | undefined;
    payoutName?: string | undefined;
    role?: "agent" | undefined;
}, {
    email: string;
    name: string;
    phone: string;
    password: string;
    confirmPassword: string;
    commissionRate?: number | undefined;
    payoutMethod?: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash" | undefined;
    payoutNumber?: string | undefined;
    payoutName?: string | undefined;
    minPayoutAmount?: number | undefined;
    role?: "agent" | undefined;
}>;
export declare const agentRegisterSchema: z.ZodObject<{
    commissionRate: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    payoutMethod: z.ZodOptional<z.ZodEnum<["ecocash", "bank", "paynow", "onemoney", "telecash"]>>;
    payoutNumber: z.ZodOptional<z.ZodString>;
    payoutName: z.ZodOptional<z.ZodString>;
    minPayoutAmount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    commissionRate: number;
    minPayoutAmount: number;
    payoutMethod?: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash" | undefined;
    payoutNumber?: string | undefined;
    payoutName?: string | undefined;
}, {
    commissionRate?: number | undefined;
    payoutMethod?: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash" | undefined;
    payoutNumber?: string | undefined;
    payoutName?: string | undefined;
    minPayoutAmount?: number | undefined;
}>;
export declare const recordAgentSaleSchema: z.ZodObject<{
    orderId: z.ZodNumber;
    agentCode: z.ZodString;
}, "strip", z.ZodTypeAny, {
    orderId: number;
    agentCode: string;
}, {
    orderId: number;
    agentCode: string;
}>;
export declare const createPayoutSchema: z.ZodEffects<z.ZodObject<{
    agentId: z.ZodNumber;
    amount: z.ZodNumber;
    paymentMethod: z.ZodEnum<["ecocash", "bank", "paynow", "onemoney", "telecash"]>;
    paymentReference: z.ZodOptional<z.ZodString>;
    payoutAccount: z.ZodOptional<z.ZodString>;
    fromDate: z.ZodEffects<z.ZodString, string, string>;
    toDate: z.ZodEffects<z.ZodString, string, string>;
}, "strip", z.ZodTypeAny, {
    agentId: number;
    amount: number;
    paymentMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
    fromDate: string;
    toDate: string;
    paymentReference?: string | undefined;
    payoutAccount?: string | undefined;
}, {
    agentId: number;
    amount: number;
    paymentMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
    fromDate: string;
    toDate: string;
    paymentReference?: string | undefined;
    payoutAccount?: string | undefined;
}>, {
    agentId: number;
    amount: number;
    paymentMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
    fromDate: string;
    toDate: string;
    paymentReference?: string | undefined;
    payoutAccount?: string | undefined;
}, {
    agentId: number;
    amount: number;
    paymentMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
    fromDate: string;
    toDate: string;
    paymentReference?: string | undefined;
    payoutAccount?: string | undefined;
}>;
export declare const approveCommissionSchema: z.ZodObject<{
    saleId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    saleId: number;
}, {
    saleId: number;
}>;
export declare const completePayoutSchema: z.ZodObject<{
    payoutId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    payoutId: number;
}, {
    payoutId: number;
}>;
export declare const clientAdminRegisterSchema: z.ZodObject<{
    merchantName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    physicalAddress: z.ZodString;
    geoLocation: z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        latitude: number;
        longitude: number;
    }, {
        latitude: number;
        longitude: number;
    }>;
    authProvider: z.ZodEnum<["google", "email"]>;
    googleId: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodLiteral<"client_admin">;
}, "strip", z.ZodTypeAny, {
    email: string;
    phone: string;
    role: "client_admin";
    merchantName: string;
    physicalAddress: string;
    geoLocation: {
        latitude: number;
        longitude: number;
    };
    authProvider: "email" | "google";
    password?: string | undefined;
    googleId?: string | undefined;
}, {
    email: string;
    phone: string;
    role: "client_admin";
    merchantName: string;
    physicalAddress: string;
    geoLocation: {
        latitude: number;
        longitude: number;
    };
    authProvider: "email" | "google";
    password?: string | undefined;
    googleId?: string | undefined;
}>;
export declare const clientAdminLoginSchema: z.ZodObject<{
    email: z.ZodString;
    authProvider: z.ZodLiteral<"google">;
    googleId: z.ZodOptional<z.ZodString>;
    role: z.ZodLiteral<"client_admin">;
}, "strip", z.ZodTypeAny, {
    email: string;
    role: "client_admin";
    authProvider: "google";
    googleId?: string | undefined;
}, {
    email: string;
    role: "client_admin";
    authProvider: "google";
    googleId?: string | undefined;
}>;
export declare const clientRegisterSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    authProvider: z.ZodEnum<["email", "google", "apple", "facebook"]>;
    googleId: z.ZodOptional<z.ZodString>;
    appleId: z.ZodOptional<z.ZodString>;
    facebookId: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    confirmPassword: z.ZodOptional<z.ZodString>;
    role: z.ZodLiteral<"client">;
}, "strip", z.ZodTypeAny, {
    email: string;
    name: string;
    phone: string;
    role: "client";
    authProvider: "email" | "google" | "apple" | "facebook";
    password?: string | undefined;
    confirmPassword?: string | undefined;
    googleId?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
}, {
    email: string;
    name: string;
    phone: string;
    role: "client";
    authProvider: "email" | "google" | "apple" | "facebook";
    password?: string | undefined;
    confirmPassword?: string | undefined;
    googleId?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
}>, {
    email: string;
    name: string;
    phone: string;
    role: "client";
    authProvider: "email" | "google" | "apple" | "facebook";
    password?: string | undefined;
    confirmPassword?: string | undefined;
    googleId?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
}, {
    email: string;
    name: string;
    phone: string;
    role: "client";
    authProvider: "email" | "google" | "apple" | "facebook";
    password?: string | undefined;
    confirmPassword?: string | undefined;
    googleId?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
}>, {
    email: string;
    name: string;
    phone: string;
    role: "client";
    authProvider: "email" | "google" | "apple" | "facebook";
    password?: string | undefined;
    confirmPassword?: string | undefined;
    googleId?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
}, {
    email: string;
    name: string;
    phone: string;
    role: "client";
    authProvider: "email" | "google" | "apple" | "facebook";
    password?: string | undefined;
    confirmPassword?: string | undefined;
    googleId?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
}>;
export declare const requestOTPSchema: z.ZodObject<{
    email: z.ZodString;
    purpose: z.ZodEnum<["registration", "login", "verification"]>;
}, "strip", z.ZodTypeAny, {
    email: string;
    purpose: "registration" | "login" | "verification";
}, {
    email: string;
    purpose: "registration" | "login" | "verification";
}>;
export declare const verifyOTPSchema: z.ZodObject<{
    email: z.ZodString;
    otp: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    otp: string;
}, {
    email: string;
    otp: string;
}>;
export declare const superAdminLoginSchema: z.ZodObject<{
    username: z.ZodLiteral<"super_admin">;
    password: z.ZodString;
    phone: z.ZodOptional<z.ZodString>;
    role: z.ZodLiteral<"super_admin">;
}, "strip", z.ZodTypeAny, {
    password: string;
    role: "super_admin";
    username: "super_admin";
    phone?: string | undefined;
}, {
    password: string;
    role: "super_admin";
    username: "super_admin";
    phone?: string | undefined;
}>;
export declare const digitalMarketerAdminLoginSchema: z.ZodObject<{
    username: z.ZodEnum<["dmark_alpha", "dmark_beta"]>;
    password: z.ZodString;
    role: z.ZodLiteral<"digital_marketer_admin">;
}, "strip", z.ZodTypeAny, {
    password: string;
    role: "digital_marketer_admin";
    username: "dmark_alpha" | "dmark_beta";
}, {
    password: string;
    role: "digital_marketer_admin";
    username: "dmark_alpha" | "dmark_beta";
}>;
export declare const loginSchema: z.ZodEffects<z.ZodObject<{
    username: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    authProvider: z.ZodOptional<z.ZodEnum<["email", "google", "apple", "facebook"]>>;
    googleId: z.ZodOptional<z.ZodString>;
    appleId: z.ZodOptional<z.ZodString>;
    facebookId: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodEnum<["super_admin", "digital_marketer_admin", "client_admin", "client"]>>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    phone?: string | undefined;
    password?: string | undefined;
    role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
    authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
    googleId?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
    username?: string | undefined;
}, {
    email?: string | undefined;
    phone?: string | undefined;
    password?: string | undefined;
    role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
    authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
    googleId?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
    username?: string | undefined;
}>, {
    email?: string | undefined;
    phone?: string | undefined;
    password?: string | undefined;
    role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
    authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
    googleId?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
    username?: string | undefined;
}, {
    email?: string | undefined;
    phone?: string | undefined;
    password?: string | undefined;
    role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
    authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
    googleId?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
    username?: string | undefined;
}>;
export declare const changePasswordSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    currentPassword: z.ZodString;
    newPassword: z.ZodString;
    confirmNewPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}>, {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}>, {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}, {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}>;
export declare const resetPasswordSchema: z.ZodEffects<z.ZodObject<{
    token: z.ZodString;
    newPassword: z.ZodString;
    confirmNewPassword: z.ZodString;
}, "strip", z.ZodTypeAny, {
    newPassword: string;
    confirmNewPassword: string;
    token: string;
}, {
    newPassword: string;
    confirmNewPassword: string;
    token: string;
}>, {
    newPassword: string;
    confirmNewPassword: string;
    token: string;
}, {
    newPassword: string;
    confirmNewPassword: string;
    token: string;
}>;
export declare const forgotPasswordSchema: z.ZodObject<{
    email: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
}, {
    email: string;
}>;
export declare const updateUserSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    merchantName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    physicalAddress: z.ZodOptional<z.ZodString>;
    geoLocation: z.ZodOptional<z.ZodObject<{
        latitude: z.ZodNumber;
        longitude: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        latitude: number;
        longitude: number;
    }, {
        latitude: number;
        longitude: number;
    }>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    merchantName?: string | undefined;
    physicalAddress?: string | undefined;
    geoLocation?: {
        latitude: number;
        longitude: number;
    } | undefined;
    isActive?: boolean | undefined;
}, {
    email?: string | undefined;
    name?: string | undefined;
    phone?: string | undefined;
    merchantName?: string | undefined;
    physicalAddress?: string | undefined;
    geoLocation?: {
        latitude: number;
        longitude: number;
    } | undefined;
    isActive?: boolean | undefined;
}>;
export declare const zodToJsonSchema: (schema: z.ZodTypeAny) => ({
    anyOf: import("zod-to-json-schema").JsonSchema7DateType[];
} & {
    title?: string;
    default?: any;
    description?: string;
    markdownDescription?: string;
}) | ({
    type: "object" | "array";
} & {
    title?: string;
    default?: any;
    description?: string;
    markdownDescription?: string;
}) | ({
    type: ("string" | "number" | "boolean" | "integer" | "null") | ("string" | "number" | "boolean" | "integer" | "null")[];
} & {
    title?: string;
    default?: any;
    description?: string;
    markdownDescription?: string;
}) | ({
    anyOf: import("zod-to-json-schema").JsonSchema7Type[];
} & {
    title?: string;
    default?: any;
    description?: string;
    markdownDescription?: string;
}) | (import("zod-to-json-schema").JsonSchema7UndefinedType & {
    title?: string;
    default?: any;
    description?: string;
    markdownDescription?: string;
}) | (import("zod-to-json-schema").JsonSchema7AnyType & {
    title?: string;
    default?: any;
    description?: string;
    markdownDescription?: string;
}) | ({
    anyOf: [import("zod-to-json-schema").JsonSchema7Type, import("zod-to-json-schema").JsonSchema7NullType];
} & {
    title?: string;
    default?: any;
    description?: string;
    markdownDescription?: string;
}) | ({
    type: [string, "null"];
} & {
    title?: string;
    default?: any;
    description?: string;
    markdownDescription?: string;
}) | (import("zod-to-json-schema").JsonSchema7AllOfType & {
    title?: string;
    default?: any;
    description?: string;
    markdownDescription?: string;
});
export declare const generateOTP: () => string;
export declare const generateRandomPassword: (length?: number) => string;
export declare const registerAsProductAgentSchema: z.ZodEffects<z.ZodObject<{
    productId: z.ZodNumber;
    fullName: z.ZodString;
    nationalId: z.ZodString;
    payoutMethod: z.ZodEnum<["ecocash", "bank", "paynow", "onemoney", "telecash"]>;
    payoutNumber: z.ZodOptional<z.ZodString>;
    bankName: z.ZodOptional<z.ZodString>;
    bankAccountNumber: z.ZodOptional<z.ZodString>;
    bankAccountName: z.ZodOptional<z.ZodString>;
    acceptedTerms: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    payoutMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
    productId: number;
    fullName: string;
    nationalId: string;
    acceptedTerms: boolean;
    payoutNumber?: string | undefined;
    bankName?: string | undefined;
    bankAccountNumber?: string | undefined;
    bankAccountName?: string | undefined;
    reason?: string | undefined;
}, {
    payoutMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
    productId: number;
    fullName: string;
    nationalId: string;
    acceptedTerms: boolean;
    payoutNumber?: string | undefined;
    bankName?: string | undefined;
    bankAccountNumber?: string | undefined;
    bankAccountName?: string | undefined;
    reason?: string | undefined;
}>, {
    payoutMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
    productId: number;
    fullName: string;
    nationalId: string;
    acceptedTerms: boolean;
    payoutNumber?: string | undefined;
    bankName?: string | undefined;
    bankAccountNumber?: string | undefined;
    bankAccountName?: string | undefined;
    reason?: string | undefined;
}, {
    payoutMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
    productId: number;
    fullName: string;
    nationalId: string;
    acceptedTerms: boolean;
    payoutNumber?: string | undefined;
    bankName?: string | undefined;
    bankAccountNumber?: string | undefined;
    bankAccountName?: string | undefined;
    reason?: string | undefined;
}>;
export declare const processAgentApplicationSchema: z.ZodObject<{
    applicationId: z.ZodNumber;
    action: z.ZodEnum<["approve", "reject"]>;
    rejectionReason: z.ZodOptional<z.ZodString>;
    commissionRate: z.ZodOptional<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    applicationId: number;
    action: "approve" | "reject";
    commissionRate?: number | undefined;
    rejectionReason?: string | undefined;
}, {
    applicationId: number;
    action: "approve" | "reject";
    commissionRate?: number | undefined;
    rejectionReason?: string | undefined;
}>;
export declare const generateReferralLinkSchema: z.ZodObject<{
    productId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    productId: number;
}, {
    productId: number;
}>;
export declare const uploadActivationPaymentSchema: z.ZodObject<{
    paymentMethod: z.ZodEnum<["ecocash", "paynow"]>;
    phoneNumber: z.ZodString;
    transactionReference: z.ZodString;
    amount: z.ZodNumber;
    paymentProof: z.ZodOptional<z.ZodString>;
    merchantId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    amount: number;
    paymentMethod: "ecocash" | "paynow";
    phoneNumber: string;
    transactionReference: string;
    merchantId: number;
    paymentProof?: string | undefined;
}, {
    amount: number;
    paymentMethod: "ecocash" | "paynow";
    phoneNumber: string;
    transactionReference: string;
    merchantId: number;
    paymentProof?: string | undefined;
}>;
export declare const chooseSubscriptionPlanSchema: z.ZodObject<{
    planType: z.ZodEnum<["3_months", "6_months", "1_year"]>;
    paymentMethod: z.ZodEnum<["ecocash", "paynow"]>;
    phoneNumber: z.ZodString;
    transactionReference: z.ZodString;
    paymentProof: z.ZodOptional<z.ZodString>;
    merchantId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    paymentMethod: "ecocash" | "paynow";
    phoneNumber: string;
    transactionReference: string;
    merchantId: number;
    planType: "3_months" | "6_months" | "1_year";
    paymentProof?: string | undefined;
}, {
    paymentMethod: "ecocash" | "paynow";
    phoneNumber: string;
    transactionReference: string;
    merchantId: number;
    planType: "3_months" | "6_months" | "1_year";
    paymentProof?: string | undefined;
}>;
export declare const approvePaymentSchema: z.ZodObject<{
    paymentId: z.ZodNumber;
    action: z.ZodEnum<["approve", "reject"]>;
    rejectionReason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    action: "approve" | "reject";
    paymentId: number;
    rejectionReason?: string | undefined;
}, {
    action: "approve" | "reject";
    paymentId: number;
    rejectionReason?: string | undefined;
}>;
export declare const SUBSCRIPTION_PLANS: {
    '3_months': {
        duration: number;
        price: number;
        name: string;
    };
    '6_months': {
        duration: number;
        price: number;
        name: string;
    };
    '1_year': {
        duration: number;
        price: number;
        name: string;
    };
};
export declare const schemas: {
    superAdminLoginSchema: z.ZodObject<{
        username: z.ZodLiteral<"super_admin">;
        password: z.ZodString;
        phone: z.ZodOptional<z.ZodString>;
        role: z.ZodLiteral<"super_admin">;
    }, "strip", z.ZodTypeAny, {
        password: string;
        role: "super_admin";
        username: "super_admin";
        phone?: string | undefined;
    }, {
        password: string;
        role: "super_admin";
        username: "super_admin";
        phone?: string | undefined;
    }>;
    digitalMarketerAdminLoginSchema: z.ZodObject<{
        username: z.ZodEnum<["dmark_alpha", "dmark_beta"]>;
        password: z.ZodString;
        role: z.ZodLiteral<"digital_marketer_admin">;
    }, "strip", z.ZodTypeAny, {
        password: string;
        role: "digital_marketer_admin";
        username: "dmark_alpha" | "dmark_beta";
    }, {
        password: string;
        role: "digital_marketer_admin";
        username: "dmark_alpha" | "dmark_beta";
    }>;
    clientAdminRegisterSchema: z.ZodObject<{
        merchantName: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        physicalAddress: z.ZodString;
        geoLocation: z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            latitude: number;
            longitude: number;
        }, {
            latitude: number;
            longitude: number;
        }>;
        authProvider: z.ZodEnum<["google", "email"]>;
        googleId: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        role: z.ZodLiteral<"client_admin">;
    }, "strip", z.ZodTypeAny, {
        email: string;
        phone: string;
        role: "client_admin";
        merchantName: string;
        physicalAddress: string;
        geoLocation: {
            latitude: number;
            longitude: number;
        };
        authProvider: "email" | "google";
        password?: string | undefined;
        googleId?: string | undefined;
    }, {
        email: string;
        phone: string;
        role: "client_admin";
        merchantName: string;
        physicalAddress: string;
        geoLocation: {
            latitude: number;
            longitude: number;
        };
        authProvider: "email" | "google";
        password?: string | undefined;
        googleId?: string | undefined;
    }>;
    clientAdminLoginSchema: z.ZodObject<{
        email: z.ZodString;
        authProvider: z.ZodLiteral<"google">;
        googleId: z.ZodOptional<z.ZodString>;
        role: z.ZodLiteral<"client_admin">;
    }, "strip", z.ZodTypeAny, {
        email: string;
        role: "client_admin";
        authProvider: "google";
        googleId?: string | undefined;
    }, {
        email: string;
        role: "client_admin";
        authProvider: "google";
        googleId?: string | undefined;
    }>;
    clientRegisterSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        authProvider: z.ZodEnum<["email", "google", "apple", "facebook"]>;
        googleId: z.ZodOptional<z.ZodString>;
        appleId: z.ZodOptional<z.ZodString>;
        facebookId: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        confirmPassword: z.ZodOptional<z.ZodString>;
        role: z.ZodLiteral<"client">;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        phone: string;
        role: "client";
        authProvider: "email" | "google" | "apple" | "facebook";
        password?: string | undefined;
        confirmPassword?: string | undefined;
        googleId?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
    }, {
        email: string;
        name: string;
        phone: string;
        role: "client";
        authProvider: "email" | "google" | "apple" | "facebook";
        password?: string | undefined;
        confirmPassword?: string | undefined;
        googleId?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
    }>, {
        email: string;
        name: string;
        phone: string;
        role: "client";
        authProvider: "email" | "google" | "apple" | "facebook";
        password?: string | undefined;
        confirmPassword?: string | undefined;
        googleId?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
    }, {
        email: string;
        name: string;
        phone: string;
        role: "client";
        authProvider: "email" | "google" | "apple" | "facebook";
        password?: string | undefined;
        confirmPassword?: string | undefined;
        googleId?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
    }>, {
        email: string;
        name: string;
        phone: string;
        role: "client";
        authProvider: "email" | "google" | "apple" | "facebook";
        password?: string | undefined;
        confirmPassword?: string | undefined;
        googleId?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
    }, {
        email: string;
        name: string;
        phone: string;
        role: "client";
        authProvider: "email" | "google" | "apple" | "facebook";
        password?: string | undefined;
        confirmPassword?: string | undefined;
        googleId?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
    }>;
    loginSchema: z.ZodEffects<z.ZodObject<{
        username: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        authProvider: z.ZodOptional<z.ZodEnum<["email", "google", "apple", "facebook"]>>;
        googleId: z.ZodOptional<z.ZodString>;
        appleId: z.ZodOptional<z.ZodString>;
        facebookId: z.ZodOptional<z.ZodString>;
        role: z.ZodOptional<z.ZodEnum<["super_admin", "digital_marketer_admin", "client_admin", "client"]>>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        phone?: string | undefined;
        password?: string | undefined;
        role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
        authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
        googleId?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
        username?: string | undefined;
    }, {
        email?: string | undefined;
        phone?: string | undefined;
        password?: string | undefined;
        role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
        authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
        googleId?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
        username?: string | undefined;
    }>, {
        email?: string | undefined;
        phone?: string | undefined;
        password?: string | undefined;
        role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
        authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
        googleId?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
        username?: string | undefined;
    }, {
        email?: string | undefined;
        phone?: string | undefined;
        password?: string | undefined;
        role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
        authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
        googleId?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
        username?: string | undefined;
    }>;
    requestOTPSchema: z.ZodObject<{
        email: z.ZodString;
        purpose: z.ZodEnum<["registration", "login", "verification"]>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        purpose: "registration" | "login" | "verification";
    }, {
        email: string;
        purpose: "registration" | "login" | "verification";
    }>;
    verifyOTPSchema: z.ZodObject<{
        email: z.ZodString;
        otp: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
        otp: string;
    }, {
        email: string;
        otp: string;
    }>;
    changePasswordSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
        currentPassword: z.ZodString;
        newPassword: z.ZodString;
        confirmNewPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }, {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }>, {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }, {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }>, {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }, {
        currentPassword: string;
        newPassword: string;
        confirmNewPassword: string;
    }>;
    resetPasswordSchema: z.ZodEffects<z.ZodObject<{
        token: z.ZodString;
        newPassword: z.ZodString;
        confirmNewPassword: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        newPassword: string;
        confirmNewPassword: string;
        token: string;
    }, {
        newPassword: string;
        confirmNewPassword: string;
        token: string;
    }>, {
        newPassword: string;
        confirmNewPassword: string;
        token: string;
    }, {
        newPassword: string;
        confirmNewPassword: string;
        token: string;
    }>;
    forgotPasswordSchema: z.ZodObject<{
        email: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        email: string;
    }, {
        email: string;
    }>;
    updateUserSchema: z.ZodObject<{
        name: z.ZodOptional<z.ZodString>;
        merchantName: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        physicalAddress: z.ZodOptional<z.ZodString>;
        geoLocation: z.ZodOptional<z.ZodObject<{
            latitude: z.ZodNumber;
            longitude: z.ZodNumber;
        }, "strip", z.ZodTypeAny, {
            latitude: number;
            longitude: number;
        }, {
            latitude: number;
            longitude: number;
        }>>;
        isActive: z.ZodOptional<z.ZodBoolean>;
    }, "strip", z.ZodTypeAny, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
        merchantName?: string | undefined;
        physicalAddress?: string | undefined;
        geoLocation?: {
            latitude: number;
            longitude: number;
        } | undefined;
        isActive?: boolean | undefined;
    }, {
        email?: string | undefined;
        name?: string | undefined;
        phone?: string | undefined;
        merchantName?: string | undefined;
        physicalAddress?: string | undefined;
        geoLocation?: {
            latitude: number;
            longitude: number;
        } | undefined;
        isActive?: boolean | undefined;
    }>;
    agentRegisterSchema: z.ZodObject<{
        commissionRate: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        payoutMethod: z.ZodOptional<z.ZodEnum<["ecocash", "bank", "paynow", "onemoney", "telecash"]>>;
        payoutNumber: z.ZodOptional<z.ZodString>;
        payoutName: z.ZodOptional<z.ZodString>;
        minPayoutAmount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        commissionRate: number;
        minPayoutAmount: number;
        payoutMethod?: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash" | undefined;
        payoutNumber?: string | undefined;
        payoutName?: string | undefined;
    }, {
        commissionRate?: number | undefined;
        payoutMethod?: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash" | undefined;
        payoutNumber?: string | undefined;
        payoutName?: string | undefined;
        minPayoutAmount?: number | undefined;
    }>;
    registerNewAgentSchema: z.ZodEffects<z.ZodObject<{
        name: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        password: z.ZodString;
        confirmPassword: z.ZodString;
        commissionRate: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        payoutMethod: z.ZodOptional<z.ZodEnum<["ecocash", "bank", "paynow", "onemoney", "telecash"]>>;
        payoutNumber: z.ZodOptional<z.ZodString>;
        payoutName: z.ZodOptional<z.ZodString>;
        minPayoutAmount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
        role: z.ZodOptional<z.ZodLiteral<"agent">>;
    }, "strip", z.ZodTypeAny, {
        email: string;
        name: string;
        phone: string;
        password: string;
        confirmPassword: string;
        commissionRate: number;
        minPayoutAmount: number;
        payoutMethod?: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash" | undefined;
        payoutNumber?: string | undefined;
        payoutName?: string | undefined;
        role?: "agent" | undefined;
    }, {
        email: string;
        name: string;
        phone: string;
        password: string;
        confirmPassword: string;
        commissionRate?: number | undefined;
        payoutMethod?: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash" | undefined;
        payoutNumber?: string | undefined;
        payoutName?: string | undefined;
        minPayoutAmount?: number | undefined;
        role?: "agent" | undefined;
    }>, {
        email: string;
        name: string;
        phone: string;
        password: string;
        confirmPassword: string;
        commissionRate: number;
        minPayoutAmount: number;
        payoutMethod?: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash" | undefined;
        payoutNumber?: string | undefined;
        payoutName?: string | undefined;
        role?: "agent" | undefined;
    }, {
        email: string;
        name: string;
        phone: string;
        password: string;
        confirmPassword: string;
        commissionRate?: number | undefined;
        payoutMethod?: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash" | undefined;
        payoutNumber?: string | undefined;
        payoutName?: string | undefined;
        minPayoutAmount?: number | undefined;
        role?: "agent" | undefined;
    }>;
    recordAgentSaleSchema: z.ZodObject<{
        orderId: z.ZodNumber;
        agentCode: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        orderId: number;
        agentCode: string;
    }, {
        orderId: number;
        agentCode: string;
    }>;
    createPayoutSchema: z.ZodEffects<z.ZodObject<{
        agentId: z.ZodNumber;
        amount: z.ZodNumber;
        paymentMethod: z.ZodEnum<["ecocash", "bank", "paynow", "onemoney", "telecash"]>;
        paymentReference: z.ZodOptional<z.ZodString>;
        payoutAccount: z.ZodOptional<z.ZodString>;
        fromDate: z.ZodEffects<z.ZodString, string, string>;
        toDate: z.ZodEffects<z.ZodString, string, string>;
    }, "strip", z.ZodTypeAny, {
        agentId: number;
        amount: number;
        paymentMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
        fromDate: string;
        toDate: string;
        paymentReference?: string | undefined;
        payoutAccount?: string | undefined;
    }, {
        agentId: number;
        amount: number;
        paymentMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
        fromDate: string;
        toDate: string;
        paymentReference?: string | undefined;
        payoutAccount?: string | undefined;
    }>, {
        agentId: number;
        amount: number;
        paymentMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
        fromDate: string;
        toDate: string;
        paymentReference?: string | undefined;
        payoutAccount?: string | undefined;
    }, {
        agentId: number;
        amount: number;
        paymentMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
        fromDate: string;
        toDate: string;
        paymentReference?: string | undefined;
        payoutAccount?: string | undefined;
    }>;
    approveCommissionSchema: z.ZodObject<{
        saleId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        saleId: number;
    }, {
        saleId: number;
    }>;
    completePayoutSchema: z.ZodObject<{
        payoutId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        payoutId: number;
    }, {
        payoutId: number;
    }>;
    registerAsProductAgentSchema: z.ZodEffects<z.ZodObject<{
        productId: z.ZodNumber;
        fullName: z.ZodString;
        nationalId: z.ZodString;
        payoutMethod: z.ZodEnum<["ecocash", "bank", "paynow", "onemoney", "telecash"]>;
        payoutNumber: z.ZodOptional<z.ZodString>;
        bankName: z.ZodOptional<z.ZodString>;
        bankAccountNumber: z.ZodOptional<z.ZodString>;
        bankAccountName: z.ZodOptional<z.ZodString>;
        acceptedTerms: z.ZodEffects<z.ZodBoolean, boolean, boolean>;
        reason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        payoutMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
        productId: number;
        fullName: string;
        nationalId: string;
        acceptedTerms: boolean;
        payoutNumber?: string | undefined;
        bankName?: string | undefined;
        bankAccountNumber?: string | undefined;
        bankAccountName?: string | undefined;
        reason?: string | undefined;
    }, {
        payoutMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
        productId: number;
        fullName: string;
        nationalId: string;
        acceptedTerms: boolean;
        payoutNumber?: string | undefined;
        bankName?: string | undefined;
        bankAccountNumber?: string | undefined;
        bankAccountName?: string | undefined;
        reason?: string | undefined;
    }>, {
        payoutMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
        productId: number;
        fullName: string;
        nationalId: string;
        acceptedTerms: boolean;
        payoutNumber?: string | undefined;
        bankName?: string | undefined;
        bankAccountNumber?: string | undefined;
        bankAccountName?: string | undefined;
        reason?: string | undefined;
    }, {
        payoutMethod: "ecocash" | "bank" | "paynow" | "onemoney" | "telecash";
        productId: number;
        fullName: string;
        nationalId: string;
        acceptedTerms: boolean;
        payoutNumber?: string | undefined;
        bankName?: string | undefined;
        bankAccountNumber?: string | undefined;
        bankAccountName?: string | undefined;
        reason?: string | undefined;
    }>;
    processAgentApplicationSchema: z.ZodObject<{
        applicationId: z.ZodNumber;
        action: z.ZodEnum<["approve", "reject"]>;
        rejectionReason: z.ZodOptional<z.ZodString>;
        commissionRate: z.ZodOptional<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        applicationId: number;
        action: "approve" | "reject";
        commissionRate?: number | undefined;
        rejectionReason?: string | undefined;
    }, {
        applicationId: number;
        action: "approve" | "reject";
        commissionRate?: number | undefined;
        rejectionReason?: string | undefined;
    }>;
    generateReferralLinkSchema: z.ZodObject<{
        productId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        productId: number;
    }, {
        productId: number;
    }>;
    uploadActivationPaymentSchema: z.ZodObject<{
        paymentMethod: z.ZodEnum<["ecocash", "paynow"]>;
        phoneNumber: z.ZodString;
        transactionReference: z.ZodString;
        amount: z.ZodNumber;
        paymentProof: z.ZodOptional<z.ZodString>;
        merchantId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        amount: number;
        paymentMethod: "ecocash" | "paynow";
        phoneNumber: string;
        transactionReference: string;
        merchantId: number;
        paymentProof?: string | undefined;
    }, {
        amount: number;
        paymentMethod: "ecocash" | "paynow";
        phoneNumber: string;
        transactionReference: string;
        merchantId: number;
        paymentProof?: string | undefined;
    }>;
    chooseSubscriptionPlanSchema: z.ZodObject<{
        planType: z.ZodEnum<["3_months", "6_months", "1_year"]>;
        paymentMethod: z.ZodEnum<["ecocash", "paynow"]>;
        phoneNumber: z.ZodString;
        transactionReference: z.ZodString;
        paymentProof: z.ZodOptional<z.ZodString>;
        merchantId: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        paymentMethod: "ecocash" | "paynow";
        phoneNumber: string;
        transactionReference: string;
        merchantId: number;
        planType: "3_months" | "6_months" | "1_year";
        paymentProof?: string | undefined;
    }, {
        paymentMethod: "ecocash" | "paynow";
        phoneNumber: string;
        transactionReference: string;
        merchantId: number;
        planType: "3_months" | "6_months" | "1_year";
        paymentProof?: string | undefined;
    }>;
    approvePaymentSchema: z.ZodObject<{
        paymentId: z.ZodNumber;
        action: z.ZodEnum<["approve", "reject"]>;
        rejectionReason: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        action: "approve" | "reject";
        paymentId: number;
        rejectionReason?: string | undefined;
    }, {
        action: "approve" | "reject";
        paymentId: number;
        rejectionReason?: string | undefined;
    }>;
    SUBSCRIPTION_PLANS: {
        '3_months': {
            duration: number;
            price: number;
            name: string;
        };
        '6_months': {
            duration: number;
            price: number;
            name: string;
        };
        '1_year': {
            duration: number;
            price: number;
            name: string;
        };
    };
};
