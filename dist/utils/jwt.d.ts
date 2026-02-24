import { JwtPayload } from 'jsonwebtoken';
import { users } from '@prisma/client';
export interface JwtUser extends JwtPayload {
    id: number;
    email: string;
    role: string;
}
export declare const generateToken: (user: users) => string;
export declare const verifyToken: (token: string) => JwtUser;
