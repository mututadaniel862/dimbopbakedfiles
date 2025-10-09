// import { z } from 'zod';
// import { zodToJsonSchema as zodToSchemaConverter } from 'zod-to-json-schema';

// const passwordRegex = /^(?=(.*\d){2,})(?=(.*[!@?#$%^&*()\-_=+{};:,<.>]){2,})(?=(.*[A-Z]){2,})(?=(.*[a-z]){2,}).{8,15}$/;

// // Zimbabwean phone number regex (accepts formats: +263..., 263..., 0...)
// const zimbabwePhoneRegex = /^(\+263|263|0)(7[7-8|1|3]|7[0-9])\d{7}$/;


// export const registerSchema = z.object({
//   username: z.string().min(3).max(100),
//   email: z.string().email(),
//   password: z.string().regex(passwordRegex, {
//     message: 'Password must contain at least 2 numbers, 2 special characters, 2 uppercase, 2 lowercase letters, and be 8-15 characters long'
//   }),
//   confirmPassword: z.string(),
//   phone: z.string().regex(zimbabwePhoneRegex, {
//     message: 'Please provide a valid Zimbabwean phone number (e.g., +263771234567, 0771234567)'
//   }),
//    role: z.enum(['user', 'admin']).default('user') // Add this line
// }).refine(data => data.password === data.confirmPassword, {
//   message: "Passwords don't match",
//   path: ["confirmPassword"]
// });

// export const loginSchema = z.object({
//   email: z.string().email(),
//   password: z.string()
// });

// export const changePasswordSchema = z.object({
//   currentPassword: z.string(),
//   newPassword: z.string().regex(passwordRegex, {
//     message: 'Password must contain at least 2 numbers, 2 special characters, 2 uppercase, 2 lowercase letters, and be 8-15 characters long'
//   }),
//   confirmNewPassword: z.string()
// }).refine(data => data.newPassword === data.confirmNewPassword, {
//   message: "Passwords don't match",
//   path: ["confirmNewPassword"]
// });

// export const resetPasswordSchema = z.object({
//   token: z.string(),
//   newPassword: z.string().regex(passwordRegex, {
//     message: 'Password must contain at least 2 numbers, 2 special characters, 2 uppercase, 2 lowercase letters, and be 8-15 characters long'
//   }),
//   confirmNewPassword: z.string()
// }).refine(data => data.newPassword === data.confirmNewPassword, {
//   message: "Passwords don't match",
//   path: ["confirmNewPassword"]
// });

// export const forgotPasswordSchema = z.object({
//   email: z.string().email()
// });


// export const zodToJsonSchema = (schema: z.ZodTypeAny) => {
//   const jsonSchema = zodToSchemaConverter(schema);
//   return jsonSchema.definitions ? jsonSchema.definitions[schema.description || ''] || jsonSchema : jsonSchema;
// };







import { z } from 'zod';
import { zodToJsonSchema as zodToSchemaConverter } from 'zod-to-json-schema';

// SIMPLIFIED: Just require 6+ characters with at least 1 number
const simplePasswordRegex = /^(?=.*\d).{6,}$/;

// FLEXIBLE: Accept any reasonable phone format
const flexiblePhoneRegex = /^(\+?263|0)?[1-9]\d{6,9}$/;

// ============================================
// SIMPLIFIED REGISTRATION SCHEMA
// ============================================
export const registerSchema = z.object({
  username: z.string().min(3).max(100),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(simplePasswordRegex, {
      message: 'Password must contain at least 1 number'
    }),
  confirmPassword: z.string(),
  phone: z.string()
    .min(9, { message: 'Phone number too short' })
    .max(15, { message: 'Phone number too long' })
    .regex(flexiblePhoneRegex, {
      message: 'Please enter a valid phone number'
    }),
  role: z.enum(['user', 'admin']).default('user')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// ============================================
// SIMPLIFIED LOGIN SCHEMA
// ============================================
export const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' })
});

// ============================================
// SIMPLIFIED CHANGE PASSWORD SCHEMA
// ============================================
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, { message: 'Current password is required' }),
  newPassword: z.string()
    .min(6, { message: 'New password must be at least 6 characters' })
    .regex(simplePasswordRegex, {
      message: 'New password must contain at least 1 number'
    }),
  confirmNewPassword: z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"]
}).refine(data => data.currentPassword !== data.newPassword, {
  message: "New password must be different from current password",
  path: ["newPassword"]
});

// ============================================
// SIMPLIFIED RESET PASSWORD SCHEMA
// ============================================
export const resetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(simplePasswordRegex, {
      message: 'Password must contain at least 1 number'
    }),
  confirmNewPassword: z.string()
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Passwords don't match",
  path: ["confirmNewPassword"]
});

// ============================================
// FORGOT PASSWORD SCHEMA
// ============================================
export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' })
});

// ============================================
// HELPER FUNCTION
// ============================================
export const zodToJsonSchema = (schema: z.ZodTypeAny) => {
  const jsonSchema = zodToSchemaConverter(schema);
  return jsonSchema.definitions ? jsonSchema.definitions[schema.description || ''] || jsonSchema : jsonSchema;
};