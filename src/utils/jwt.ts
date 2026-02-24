import jwt, { JwtPayload } from 'jsonwebtoken';
import { users } from '@prisma/client';

const JWT_SECRET: jwt.Secret = process.env.JWT_SECRET || 'your-very-secure-secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15d';

// Export both the interface and type for consistency
export interface JwtUser extends JwtPayload {
  id: number;
  email: string;
  role: string;
}

export const generateToken = (user: users): string => {
  const payload: JwtUser = {
    id: user.id,
    email: user.email,
    role: user.role || 'user',
    // exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24) // 1 day expiration

    exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 15) 
  };

  return jwt.sign(payload, JWT_SECRET);
};

export const verifyToken = (token: string): JwtUser => {
  return jwt.verify(token, JWT_SECRET) as JwtUser;
};





// FzaYveYQlxmiCEtU

// mongodb+srv://mututadaniel54:FzaYveYQlxmiCEtU@cluster0.j1hrmmg.mongodb.net/

// mongodb+srv://mututadaniel54:<db_password>@cluster0.j1hrmmg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
