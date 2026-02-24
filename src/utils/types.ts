import { z } from 'zod';
import { 
  clientRegisterSchema, 
  clientAdminRegisterSchema,
  loginSchema, 
  changePasswordSchema, 
  resetPasswordSchema
} from './schemas';

// Use the actual schemas from your schemas.ts
export type RegisterInput = z.infer<typeof clientRegisterSchema>;
export type ClientAdminRegisterInput = z.infer<typeof clientAdminRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;











// import { z } from 'zod';
// import { 
//   clientRegisterSchema, 
//   clientAdminRegisterSchema,
//   loginSchema, 
//   changePasswordSchema, 
//   resetPasswordSchema,
//   requestOTPSchema,
//   verifyOTPSchema,
//   updateUserSchema,
//   superAdminLoginSchema,
//   digitalMarketerAdminLoginSchema,
//   clientAdminLoginSchema,
//   forgotPasswordSchema
// } from './schemas';

// // Client (Customer) Registration Types
// export type ClientRegisterInput = z.infer<typeof clientRegisterSchema>;

// // Client Admin (Merchant) Registration Types
// export type ClientAdminRegisterInput = z.infer<typeof clientAdminRegisterSchema>;

// // Login Types
// export type LoginInput = z.infer<typeof loginSchema>;
// export type SuperAdminLoginInput = z.infer<typeof superAdminLoginSchema>;
// export type DigitalMarketerAdminLoginInput = z.infer<typeof digitalMarketerAdminLoginSchema>;
// export type ClientAdminLoginInput = z.infer<typeof clientAdminLoginSchema>;

// // Password Management Types
// export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
// export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
// export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

// // OTP Types
// export type RequestOTPInput = z.infer<typeof requestOTPSchema>;
// export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;

// // User Update Types
// export type UpdateUserInput = z.infer<typeof updateUserSchema>;

// // Legacy type alias for backward compatibility (if needed)
// export type RegisterInput = ClientRegisterInput;