import { NextResponse } from "next/server";

import { clearStudentCookie } from "@/lib/examAuth";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Student logout successful.",
  });

  return clearStudentCookie(response);
}