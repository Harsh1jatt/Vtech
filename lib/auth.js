import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env.local");
}

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

export function createToken(user) {
  return jwt.sign(
    {
      userId: user._id.toString(),
      role: user.role,
    },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRES_IN,
    }
  );
}

export function verifyToken(token) {
  if (!token) {
    return null;
  }

  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    // Invalid, modified, malformed or expired token
    return null;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vtech_token")?.value;

  if (!token) {
    return null;
  }

  return verifyToken(token);
}

export async function requireAdmin() {
  const authUser = await getCurrentUser();

  if (!authUser) {
    const error = new Error("UNAUTHORIZED");
    error.status = 401;
    throw error;
  }

  return authUser;
}