import { z } from 'zod';
import { clientRegisterSchema, clientAdminRegisterSchema, loginSchema, changePasswordSchema, resetPasswordSchema } from './schemas';
export type RegisterInput = z.infer<typeof clientRegisterSchema>;
export type ClientAdminRegisterInput = z.infer<typeof clientAdminRegisterSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
