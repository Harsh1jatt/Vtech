import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

import connectToDatabase from "@/lib/db";
import Student from "@/models/Student";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in .env.local");
}

const STUDENT_TOKEN_EXPIRES_IN =
  process.env.STUDENT_JWT_EXPIRES_IN || "1d";

const STUDENT_COOKIE_NAME = "vtech_student_token";

export function createStudentToken(student) {
  return jwt.sign(
    {
      studentId: student._id.toString(),
      type: "student",
    },
    JWT_SECRET,
    {
      expiresIn: STUDENT_TOKEN_EXPIRES_IN,
    }
  );
}

export function verifyStudentToken(token) {
  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (payload.type !== "student" || !payload.studentId) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentStudent() {
  const cookieStore = await cookies();

  const token = cookieStore.get(STUDENT_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const payload = verifyStudentToken(token);

  if (!payload) {
    return null;
  }

  await connectToDatabase();

  const student = await Student.findById(payload.studentId)
    .select(
      "_id fullName fatherName rollNumber dateOfBirth phone email course status"
    )
    .populate("course", "title shortTitle slug category");

  if (!student || student.status !== "Active") {
    return null;
  }

  return student;
}

export async function requireStudent() {
  const student = await getCurrentStudent();

  if (!student) {
    const error = new Error("UNAUTHORIZED");
    error.status = 401;
    throw error;
  }

  return student;
}

export function setStudentCookie(response, token) {
  response.cookies.set({
    name: STUDENT_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 24 * 60 * 60,
  });

  return response;
}

export function clearStudentCookie(response) {
  response.cookies.set({
    name: STUDENT_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}

export { STUDENT_COOKIE_NAME };