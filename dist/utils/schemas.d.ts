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
    authProvider: z.ZodLiteral<"google">;
    googleId: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
    role: z.ZodLiteral<"client_admin">;
}, "strip", z.ZodTypeAny, {
    email: string;
    merchantName: string;
    phone: string;
    physicalAddress: string;
    geoLocation: {
        latitude: number;
        longitude: number;
    };
    authProvider: "google";
    role: "client_admin";
    googleId?: string | undefined;
    password?: string | undefined;
}, {
    email: string;
    merchantName: string;
    phone: string;
    physicalAddress: string;
    geoLocation: {
        latitude: number;
        longitude: number;
    };
    authProvider: "google";
    role: "client_admin";
    googleId?: string | undefined;
    password?: string | undefined;
}>;
export declare const clientAdminLoginSchema: z.ZodObject<{
    email: z.ZodString;
    authProvider: z.ZodLiteral<"google">;
    googleId: z.ZodOptional<z.ZodString>;
    role: z.ZodLiteral<"client_admin">;
}, "strip", z.ZodTypeAny, {
    email: string;
    authProvider: "google";
    role: "client_admin";
    googleId?: string | undefined;
}, {
    email: string;
    authProvider: "google";
    role: "client_admin";
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
    phone: string;
    authProvider: "email" | "google" | "apple" | "facebook";
    role: "client";
    name: string;
    googleId?: string | undefined;
    password?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
    confirmPassword?: string | undefined;
}, {
    email: string;
    phone: string;
    authProvider: "email" | "google" | "apple" | "facebook";
    role: "client";
    name: string;
    googleId?: string | undefined;
    password?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
    confirmPassword?: string | undefined;
}>, {
    email: string;
    phone: string;
    authProvider: "email" | "google" | "apple" | "facebook";
    role: "client";
    name: string;
    googleId?: string | undefined;
    password?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
    confirmPassword?: string | undefined;
}, {
    email: string;
    phone: string;
    authProvider: "email" | "google" | "apple" | "facebook";
    role: "client";
    name: string;
    googleId?: string | undefined;
    password?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
    confirmPassword?: string | undefined;
}>, {
    email: string;
    phone: string;
    authProvider: "email" | "google" | "apple" | "facebook";
    role: "client";
    name: string;
    googleId?: string | undefined;
    password?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
    confirmPassword?: string | undefined;
}, {
    email: string;
    phone: string;
    authProvider: "email" | "google" | "apple" | "facebook";
    role: "client";
    name: string;
    googleId?: string | undefined;
    password?: string | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
    confirmPassword?: string | undefined;
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
    authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
    googleId?: string | undefined;
    password?: string | undefined;
    role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
    username?: string | undefined;
}, {
    email?: string | undefined;
    phone?: string | undefined;
    authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
    googleId?: string | undefined;
    password?: string | undefined;
    role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
    username?: string | undefined;
}>, {
    email?: string | undefined;
    phone?: string | undefined;
    authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
    googleId?: string | undefined;
    password?: string | undefined;
    role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
    appleId?: string | undefined;
    facebookId?: string | undefined;
    username?: string | undefined;
}, {
    email?: string | undefined;
    phone?: string | undefined;
    authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
    googleId?: string | undefined;
    password?: string | undefined;
    role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
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
    merchantName?: string | undefined;
    phone?: string | undefined;
    physicalAddress?: string | undefined;
    geoLocation?: {
        latitude: number;
        longitude: number;
    } | undefined;
    name?: string | undefined;
    isActive?: boolean | undefined;
}, {
    email?: string | undefined;
    merchantName?: string | undefined;
    phone?: string | undefined;
    physicalAddress?: string | undefined;
    geoLocation?: {
        latitude: number;
        longitude: number;
    } | undefined;
    name?: string | undefined;
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
        authProvider: z.ZodLiteral<"google">;
        googleId: z.ZodOptional<z.ZodString>;
        password: z.ZodOptional<z.ZodString>;
        role: z.ZodLiteral<"client_admin">;
    }, "strip", z.ZodTypeAny, {
        email: string;
        merchantName: string;
        phone: string;
        physicalAddress: string;
        geoLocation: {
            latitude: number;
            longitude: number;
        };
        authProvider: "google";
        role: "client_admin";
        googleId?: string | undefined;
        password?: string | undefined;
    }, {
        email: string;
        merchantName: string;
        phone: string;
        physicalAddress: string;
        geoLocation: {
            latitude: number;
            longitude: number;
        };
        authProvider: "google";
        role: "client_admin";
        googleId?: string | undefined;
        password?: string | undefined;
    }>;
    clientAdminLoginSchema: z.ZodObject<{
        email: z.ZodString;
        authProvider: z.ZodLiteral<"google">;
        googleId: z.ZodOptional<z.ZodString>;
        role: z.ZodLiteral<"client_admin">;
    }, "strip", z.ZodTypeAny, {
        email: string;
        authProvider: "google";
        role: "client_admin";
        googleId?: string | undefined;
    }, {
        email: string;
        authProvider: "google";
        role: "client_admin";
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
        phone: string;
        authProvider: "email" | "google" | "apple" | "facebook";
        role: "client";
        name: string;
        googleId?: string | undefined;
        password?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
        confirmPassword?: string | undefined;
    }, {
        email: string;
        phone: string;
        authProvider: "email" | "google" | "apple" | "facebook";
        role: "client";
        name: string;
        googleId?: string | undefined;
        password?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
        confirmPassword?: string | undefined;
    }>, {
        email: string;
        phone: string;
        authProvider: "email" | "google" | "apple" | "facebook";
        role: "client";
        name: string;
        googleId?: string | undefined;
        password?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
        confirmPassword?: string | undefined;
    }, {
        email: string;
        phone: string;
        authProvider: "email" | "google" | "apple" | "facebook";
        role: "client";
        name: string;
        googleId?: string | undefined;
        password?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
        confirmPassword?: string | undefined;
    }>, {
        email: string;
        phone: string;
        authProvider: "email" | "google" | "apple" | "facebook";
        role: "client";
        name: string;
        googleId?: string | undefined;
        password?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
        confirmPassword?: string | undefined;
    }, {
        email: string;
        phone: string;
        authProvider: "email" | "google" | "apple" | "facebook";
        role: "client";
        name: string;
        googleId?: string | undefined;
        password?: string | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
        confirmPassword?: string | undefined;
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
        authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
        googleId?: string | undefined;
        password?: string | undefined;
        role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
        username?: string | undefined;
    }, {
        email?: string | undefined;
        phone?: string | undefined;
        authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
        googleId?: string | undefined;
        password?: string | undefined;
        role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
        username?: string | undefined;
    }>, {
        email?: string | undefined;
        phone?: string | undefined;
        authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
        googleId?: string | undefined;
        password?: string | undefined;
        role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
        appleId?: string | undefined;
        facebookId?: string | undefined;
        username?: string | undefined;
    }, {
        email?: string | undefined;
        phone?: string | undefined;
        authProvider?: "email" | "google" | "apple" | "facebook" | undefined;
        googleId?: string | undefined;
        password?: string | undefined;
        role?: "super_admin" | "digital_marketer_admin" | "client_admin" | "client" | undefined;
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
        merchantName?: string | undefined;
        phone?: string | undefined;
        physicalAddress?: string | undefined;
        geoLocation?: {
            latitude: number;
            longitude: number;
        } | undefined;
        name?: string | undefined;
        isActive?: boolean | undefined;
    }, {
        email?: string | undefined;
        merchantName?: string | undefined;
        phone?: string | undefined;
        physicalAddress?: string | undefined;
        geoLocation?: {
            latitude: number;
            longitude: number;
        } | undefined;
        name?: string | undefined;
        isActive?: boolean | undefined;
    }>;
};
