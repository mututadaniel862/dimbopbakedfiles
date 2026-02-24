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
    password: 'SuperAdmin@2025',    
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
};

// ============================================
// USER ROLES AND TYPES
// ============================================
export const UserRole = z.enum(['super_admin', 'digital_marketer_admin', 'client_admin', 'client']);
export type UserRole = z.infer<typeof UserRole>;

export const AuthProvider = z.enum(['email', 'google', 'apple', 'facebook']);
export type AuthProvider = z.infer<typeof AuthProvider>;

// ============================================
// NEW AGENT REGISTRATION - DIRECT SIGN UP
// ============================================
export const registerNewAgentSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).max(100),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string()
    .min(9, { message: 'Phone number too short' })
    .max(15, { message: 'Phone number too long' })
    .regex(flexiblePhoneRegex, {
      message: 'Please enter a valid phone number'
    }),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(simplePasswordRegex, {
      message: 'Password must contain at least 1 number'
    }),
  confirmPassword: z.string(),
  commissionRate: z.number()
    .min(0.1)
    .max(50)
    .optional()
    .default(5.0),
  payoutMethod: z.enum(['ecocash', 'bank', 'paynow', 'onemoney', 'telecash']).optional(),
  payoutNumber: z.string().min(9).optional(),
  payoutName: z.string().optional(),
  minPayoutAmount: z.number().min(1).optional().default(10.0),
  role: z.literal('agent').optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

// ============================================
// AGENT REGISTRATION & MANAGEMENT SCHEMAS
// ============================================
export const agentRegisterSchema = z.object({
  commissionRate: z.number()
    .min(0, { message: 'Commission rate must be at least 0%' })
    .max(100, { message: 'Commission rate cannot exceed 100%' })
    .optional()
    .default(5.0),
  payoutMethod: z.enum(['ecocash', 'bank', 'paynow', 'onemoney', 'telecash'])
    .optional(),
  payoutNumber: z.string()
    .min(9, { message: 'Payout number too short' })
    .max(20, { message: 'Payout number too long' })
    .optional(),
  payoutName: z.string()
    .min(2, { message: 'Payout name must be at least 2 characters' })
    .max(100)
    .optional(),
  minPayoutAmount: z.number()
    .min(1, { message: 'Minimum payout amount must be at least $1' })
    .optional()
    .default(10.0)
});

export const recordAgentSaleSchema = z.object({
  orderId: z.number().int().positive({ message: 'Valid order ID is required' }),
  agentCode: z.string()
    .min(4, { message: 'Agent code must be at least 4 characters' })
    .max(20, { message: 'Agent code too long' })
});

export const createPayoutSchema = z.object({
  agentId: z.number().int().positive({ message: 'Valid agent ID is required' }),
  amount: z.number()
    .positive({ message: 'Payout amount must be greater than 0' })
    .min(1, { message: 'Minimum payout is $1' }),
  paymentMethod: z.enum(['ecocash', 'bank', 'paynow', 'onemoney', 'telecash']),
  paymentReference: z.string().optional(),
  payoutAccount: z.string().optional(),
  fromDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid from date'
  }),
  toDate: z.string().refine(date => !isNaN(Date.parse(date)), {
    message: 'Invalid to date'
  })
}).refine(
  data => new Date(data.fromDate) <= new Date(data.toDate),
  {
    message: 'From date must be before or equal to to date',
    path: ['toDate']
  }
);

export const approveCommissionSchema = z.object({
  saleId: z.number().int().positive({ message: 'Valid sale ID is required' })
});

export const completePayoutSchema = z.object({
  payoutId: z.number().int().positive({ message: 'Valid payout ID is required' })
});

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
  authProvider: z.literal('google'),
  googleId: z.string().optional(),
  password: z.string().optional(),
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
  authProvider: AuthProvider,
  googleId: z.string().optional(),
  appleId: z.string().optional(),
  facebookId: z.string().optional(),
  password: z.string()
    .min(6, { message: 'Password must be at least 6 characters' })
    .regex(simplePasswordRegex, {
      message: 'Password must contain at least 1 number'
    })
    .optional(),
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
// SUPER ADMIN LOGIN
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
// DIGITAL MARKETER ADMIN LOGIN
// ============================================
export const digitalMarketerAdminLoginSchema = z.object({
  username: z.enum(['dmark_alpha', 'dmark_beta']),
  password: z.string().min(1, { message: 'Password is required' }),
  role: z.literal('digital_marketer_admin')
});

// ============================================
// UNIVERSAL LOGIN SCHEMA
// ============================================
export const loginSchema = z.object({
  username: z.string().optional(),
  email: z.string().email().optional(),
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

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

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








export const registerAsProductAgentSchema = z.object({
  productId: z.number().int().positive({ message: 'Valid product ID is required' }),
  
  // Identity Verification
  fullName: z.string().min(2, { message: 'Full name is required' }).max(100),
  nationalId: z.string().min(5, { message: 'National ID is required' }),
  
  // Payment Details (Choose ONE)
  payoutMethod: z.enum(['ecocash', 'bank', 'paynow', 'onemoney', 'telecash']),
  payoutNumber: z.string().min(9).optional(), // For mobile money
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  bankAccountName: z.string().optional(),
  
  // Agreement
  acceptedTerms: z.boolean().refine(val => val === true, {
    message: 'You must accept the terms and conditions'
  }),
  
  // Optional
  reason: z.string().max(500).optional()
}).refine(
  data => {
    if (data.payoutMethod === 'bank') {
      return data.bankName && data.bankAccountNumber && data.bankAccountName;
    }
    return data.payoutNumber;
  },
  {
    message: 'Payment details are required based on selected payout method',
    path: ['payoutNumber']
  }
);

// Admin approves/rejects agent application
export const processAgentApplicationSchema = z.object({
  applicationId: z.number().int().positive(),
  action: z.enum(['approve', 'reject']),
  rejectionReason: z.string().min(10).optional(),
  commissionRate: z.number().min(0.1).max(50).optional()
});

// Generate referral link
export const generateReferralLinkSchema = z.object({
  productId: z.number().int().positive(),
});





// ============================================
// SUBSCRIPTION PLANS & PAYMENT
// ============================================

// Payment proof upload for activation ($1)
export const uploadActivationPaymentSchema = z.object({
  paymentMethod: z.enum(['ecocash', 'paynow']),
  phoneNumber: z.string()
    .min(9, { message: 'Phone number too short' })
    .regex(flexiblePhoneRegex, { message: 'Invalid phone number' }),
  transactionReference: z.string().min(5, { message: 'Transaction reference required' }),
  amount: z.number().min(1, { message: 'Amount must be at least $1' }),
  paymentProof: z.string().optional(), // Base64 image or file URL
  merchantId: z.number().int().positive()
});

// Choose subscription plan
export const chooseSubscriptionPlanSchema = z.object({
  planType: z.enum(['3_months', '6_months', '1_year']),
  paymentMethod: z.enum(['ecocash', 'paynow']),
  phoneNumber: z.string().regex(flexiblePhoneRegex),
  transactionReference: z.string().min(5),
  paymentProof: z.string().optional(), // Base64 image or file URL
  merchantId: z.number().int().positive()
});

// Admin approve/reject payment
export const approvePaymentSchema = z.object({
  paymentId: z.number().int().positive(),
  action: z.enum(['approve', 'reject']),
  rejectionReason: z.string().min(10).optional()
});

// Subscription plan pricing
export const SUBSCRIPTION_PLANS = {
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
export const schemas = {
  // Auth schemas
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
  updateUserSchema,
  
  // ✅ Agent schemas
  agentRegisterSchema,
  registerNewAgentSchema,
  recordAgentSaleSchema,
  createPayoutSchema,
  approveCommissionSchema,
  completePayoutSchema,
   registerAsProductAgentSchema,
  processAgentApplicationSchema,
  generateReferralLinkSchema,

   // ✅ Subscription schemas - ADD THESE
  uploadActivationPaymentSchema,
  chooseSubscriptionPlanSchema,
  approvePaymentSchema,
  SUBSCRIPTION_PLANS
};