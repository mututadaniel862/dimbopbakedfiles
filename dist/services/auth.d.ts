import { users } from '@prisma/client';
export declare const seedPredefinedUsers: () => Promise<void>;
export declare const sendOTP: (data: any) => Promise<void>;
export declare const verifyOTP: (data: any) => Promise<boolean>;
export declare const registerClientAdmin: (data: any) => Promise<users>;
export declare const registerClient: (data: any) => Promise<users>;
export declare const loginUser: (data: any) => Promise<users>;
export declare const getUser: (identifier: {
    username?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
}) => Promise<any | null>;
export declare const getAllUsers: () => Promise<any[]>;
export declare const changePassword: (userId: number, currentPassword: string, newPassword: string) => Promise<void>;
export declare const forgotPassword: (email: string) => Promise<void>;
export declare const resetPassword: (token: string, newPassword: string) => Promise<void>;
export declare const deleteUser: (userId: number) => Promise<void>;
