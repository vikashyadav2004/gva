import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "gva_token";

export interface AuthPayload extends JwtPayload {
  _id: string;
  role: string;
  organizationId?: string | null;
}


export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hashed: string) {
  return bcrypt.compare(password, hashed);
}

export function signJwt(payload: AuthPayload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyJwt(token: string): AuthPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthPayload;
  } catch {
    return null;
  }
}

export const cookieName = COOKIE_NAME;
