import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "your-secret-fallback";

export interface AuthPayload {
  userId: string;
  userName: string;
}

export function signToken(payload: AuthPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): AuthPayload {
  return jwt.verify(token, SECRET) as AuthPayload;
}
