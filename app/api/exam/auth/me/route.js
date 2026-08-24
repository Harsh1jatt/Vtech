import { NextResponse } from "next/server";

import { requireStudent } from "@/lib/examAuth";

export async function GET() {
  try {
    const student = await requireStudent();

    return NextResponse.json({
      success: true,
      student: {
        id: student._id,
        fullName: student.fullName,
        rollNumber: student.rollNumber,
        dateOfBirth: student.dateOfBirth,
        phone: student.phone,
        email: student.email,
        course: student.course,
      },
    });
  } catch (error) {
    if (error?.status === 401) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    console.error("Student auth me error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}