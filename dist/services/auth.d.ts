import { users } from '@prisma/client';
import { registerSchema, loginSchema, resetPasswordSchema } from '../utils/schemas';
export declare const registerUser: (data: typeof registerSchema._type) => Promise<users>;
export declare const getUser: (identifier: {
    username?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
}) => Promise<{
    username: string;
    email: string;
    phone: string | null;
} | null>;
export declare const getAllUsers: () => Promise<Pick<users, "id" | "username" | "email" | "phone" | "role" | "created_at" | "updated_at">[]>;
export declare const loginUser: (data: typeof loginSchema._type) => Promise<users>;
export declare const changePassword: (userId: number, currentPassword: string, newPassword: string) => Promise<void>;
export declare const forgotPassword: (email: string) => Promise<void>;
export declare const resetPassword: (data: typeof resetPasswordSchema._type) => Promise<void>;
export declare const deleteUser: (userId: number) => Promise<void>;
