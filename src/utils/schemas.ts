
import { z } from 'zod';
import { zodToJsonSchema as zodToSchemaConverter } from 'zod-to-json-schema';

// SIMPLIFIED: Just require 6+ characters with at least 1 number
const simplePasswordRegex = /^(?=.*\d).{6,}$/;

// FLEXIBLE: Accept any reasonable phone format
const flexiblePhoneRegex = /^(\+?263|0)?[1-9]\d{6,9}$/;

// ============================================
// PRE-DEFINED SYSTEM USERS (ONLY SUPER ADMIN & DIGITAL MARKETERS)
// ============================================
export const PREDEFINED_USERS = {
  super_admin: {
    username: 'super_admin',
    email: 'super.admin@zimnextsmile.com',
    password: 'SAdm%2025!G7kL',    
    phone: null,
    role: 'super_admin' as const
  },
  digital_marketer_admins: [
    {
      username: 'dmark_alpha',
      email: 'dmark.alpha@zimnextsmiling.com',
      password: 'DMkt!Alpha2025#',
      phone: '+263774000001',
      role: 'digital_marketer_admin' as const
    },
    {
      username: 'dmark_beta',
      email: 'dmark.beta@zimnextsmiling.com',
      password: 'DMkt!Beta2025#',
      phone: '+263775000002',
      role: 'digital_marketer_admin' as const
    }
  ]
  // NO predefined client_admin or clients - they ALL register themselves
};

// ============================================
// USER ROLES AND TYPES
// ============================================
export const UserRole = z.enum(['super_admin', 'digital_marketer_admin', 'client_admin', 'client']);
export type UserRole = z.infer<typeof UserRole>;

export const AuthProvider = z.enum(['email', 'google', 'apple', 'facebook']);
export type AuthProvider = z.infer<typeof AuthProvider>;

// ============================================
// CLIENT ADMIN (MERCHANT) REGISTRATION - GOOGLE SIGN-UP
// ============================================
export const clientAdminRegisterSchema = z.object({
  merchantName: z.string().min(2, { message: 'Merchant name must be at least 2 characters' }).max(200),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string()
    .min(9, { message: 'Phone number too short' })
    .max(15, { message: 'Phone number too long' })
    .regex(flexiblePhoneRegex, {
      message: 'Please enter a valid phone number'
    }),
  physicalAddress: z.string().min(5, { message: 'Physical address is required' }),
  geoLocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
  }),
  authProvider: z.literal('google'), // Client admins MUST use Google
  googleId: z.string().optional(), // Google user ID
  password: z.string().optional(), // Not needed for Google auth
  role: z.literal('client_admin')
});

// ============================================
// CLIENT ADMIN (MERCHANT) LOGIN
// ============================================
export const clientAdminLoginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  authProvider: z.literal('google'),
  googleId: z.string().optional(),
  role: z.literal('client_admin')
});

// ============================================
// CLIENT (CUSTOMER) REGISTRATION - SOCIAL OR EMAIL WITH OTP
// ============================================
export const clientRegisterSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(100),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string()
    .min(9, { message: 'Phone number too short' })
    .max(15, { message: 'Phone number too long' })
    .regex(flexiblePhoneRegex, {
      message: 'Please enter a valid phone number'
    }),
  authProvider: AuthProvider, // google, apple, facebook, or email
  googleId: z.string().optional(),
  appleId: z.string().optional(),
  facebookId: z.string().optional(),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(simplePasswordRegex, {
      message: 'Password must contain at least 1 number'
    })
    .optional(), // Only required if authProvider is 'email'
  confirmPassword: z.string().optional(),
  role: z.literal('client')
}).refine(
  data => {
    if (data.authProvider === 'email') {
      return data.password && data.password.length >= 6;
    }
    return true;
  },
  {
    message: 'Password is required for email registration',
    path: ['password']
  }
).refine(
  data => {
    if (data.authProvider === 'email' && data.password && data.confirmPassword) {
      return data.password === data.confirmPassword;
    }
    return true;
  },
  {
    message: "Passwords don't match",
    path: ['confirmPassword']
  }
);

// ============================================
// EMAIL VERIFICATION (OTP)
// ============================================
export const requestOTPSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  purpose: z.enum(['registration', 'login', 'verification'])
});

export const verifyOTPSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  otp: z.string().length(6, { message: 'OTP must be 6 digits' })
});

// ============================================
// SUPER ADMIN LOGIN (Must provide phone on first login)
// ============================================
export const superAdminLoginSchema = z.object({
  username: z.literal('super_admin'),
  password: z.string().min(1, { message: 'Password is required' }),
  phone: z.string()
    .min(9, { message: 'Phone number too short' })
    .max(15, { message: 'Phone number too long' })
    .regex(flexiblePhoneRegex, {
      message: 'Please enter a valid phone number'
    })
    .optional(),
  role: z.literal('super_admin')
});

// ============================================
// DIGITAL MARKETER ADMIN LOGIN (Pre-defined with phones)
// ============================================
export const digitalMarketerAdminLoginSchema = z.object({
  username: z.enum(['dmark_alpha', 'dmark_beta']),
  password: z.string().min(1, { message: 'Password is required' }),
  role: z.literal('digital_marketer_admin')
});

// ============================================
// UNIVERSAL LOGIN SCHEMA (All user types)
// ============================================
export const loginSchema = z.object({
  username: z.string().optional(), // For admins
  email: z.string().email().optional(), // For clients/client_admins
  password: z.string().min(1, { message: 'Password is required' }).optional(),
  phone: z.string().regex(flexiblePhoneRegex).optional(),
  authProvider: AuthProvider.optional(),
  googleId: z.string().optional(),
  appleId: z.string().optional(),
  facebookId: z.string().optional(),
  role: UserRole.optional()
}).refine(
  data => data.username || data.email,
  {
    message: 'Either username or email is required',
    path: ['username']
  }
);

// ============================================
// PASSWORD RESET SCHEMAS
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

export const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' })
});

// ============================================
// USER MANAGEMENT SCHEMAS
// ============================================
export const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  merchantName: z.string().min(2).max(200).optional(),
  email: z.string().email().optional(),
  phone: z.string().regex(flexiblePhoneRegex).optional(),
  physicalAddress: z.string().optional(),
  geoLocation: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180)
  }).optional(),
  isActive: z.boolean().optional()
});

// ============================================
// HELPER FUNCTIONS
// ============================================
export const zodToJsonSchema = (schema: z.ZodTypeAny) => {
  const jsonSchema = zodToSchemaConverter(schema);
  return jsonSchema.definitions ? jsonSchema.definitions[schema.description || ''] || jsonSchema : jsonSchema;
};

// Generate 6-digit OTP
export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper to generate random passwords
export const generateRandomPassword = (length: number = 12): string => {
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

// Export all schemas
export const schemas = {
  superAdminLoginSchema,
  digitalMarketerAdminLoginSchema,
  clientAdminRegisterSchema,
  clientAdminLoginSchema,
  clientRegisterSchema,
  loginSchema,
  requestOTPSchema,
  verifyOTPSchema,
  changePasswordSchema,
  resetPasswordSchema,
  forgotPasswordSchema,
  updateUserSchema
};