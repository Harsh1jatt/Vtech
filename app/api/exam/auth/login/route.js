import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/db";
import Student from "@/models/Student";
import {
  createStudentToken,
  setStudentCookie,
} from "@/lib/examAuth";

function normalizeDob(value) {
  return String(value || "").replace(/\D/g, "");
}

function isValidDobFormat(value) {
  return /^\d{8}$/.test(value);
}

function parseDDMMYYYY(value) {
  const day = Number(value.slice(0, 2));
  const month = Number(value.slice(2, 4));
  const year = Number(value.slice(4, 8));

  if (
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1900 ||
    year > new Date().getFullYear()
  ) {
    return null;
  }

  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function isSameDate(date, day, month, year) {
  if (!date) {
    return false;
  }

  const value = new Date(date);

  return (
    value.getFullYear() === year &&
    value.getMonth() === month - 1 &&
    value.getDate() === day
  );
}

export async function POST(request) {
  try {
    const body = await request.json();

    const rollNumber = String(body.rollNumber || "").trim();
    const dob = normalizeDob(body.dob || body.dateOfBirth);

    if (!rollNumber || !dob) {
      return NextResponse.json(
        {
          success: false,
          message: "Roll number and date of birth are required.",
        },
        { status: 400 }
      );
    }

    if (!isValidDobFormat(dob)) {
      return NextResponse.json(
        {
          success: false,
          message: "Date of birth must be in DDMMYYYY format.",
        },
        { status: 400 }
      );
    }

    const parsedDob = parseDDMMYYYY(dob);

    if (!parsedDob) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid date of birth.",
        },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const student = await Student.findOne({
      rollNumber,
    }).populate(
      "course",
      "title shortTitle slug category"
    );

    if (!student || student.status !== "Active") {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid roll number or date of birth.",
        },
        { status: 401 }
      );
    }

    const validDob = isSameDate(
      student.dateOfBirth,
      parsedDob.getDate(),
      parsedDob.getMonth() + 1,
      parsedDob.getFullYear()
    );

    if (!validDob) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid roll number or date of birth.",
        },
        { status: 401 }
      );
    }

    const token = createStudentToken(student);

    const response = NextResponse.json({
      success: true,
      message: "Student login successful.",
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

    return setStudentCookie(response, token);
  } catch (error) {
    console.error("Student exam login error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}