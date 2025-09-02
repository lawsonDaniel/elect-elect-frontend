// utils/jwt.ts
import jwt from 'jsonwebtoken';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = (process.env.JWT_EXPIRES_IN || '7d') as jwt.SignOptions['expiresIn'];

export interface JwtPayload {
  userId: string;
  email: string;
  userType: string;
}

export const generateToken = (payload: JwtPayload): string => {
  const options: jwt.SignOptions = {
    expiresIn: JWT_EXPIRES_IN,
  };
  
  return jwt.sign(payload, JWT_SECRET, options);
};

export const verifyToken = (token: string): JwtPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error:any) {
    throw new Error('Invalid or expired token');
  }
};