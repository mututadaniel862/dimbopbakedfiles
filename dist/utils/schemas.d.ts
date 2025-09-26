import { z } from 'zod';
export declare const registerSchema: z.ZodEffects<z.ZodObject<{
    username: z.ZodString;
    email: z.ZodString;
    password: z.ZodString;
    confirmPassword: z.ZodString;
    phone: z.ZodString;
    role: z.ZodDefault<z.ZodEnum<["user", "admin"]>>;
}, "strip", z.ZodTypeAny, {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    role: "user" | "admin";
}, {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    role?: "user" | "admin" | undefined;
}>, {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    role: "user" | "admin";
}, {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    phone: string;
    role?: "user" | "admin" | undefined;
}>;
export declare const loginSchema: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const changePasswordSchema: z.ZodEffects<z.ZodObject<{
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
