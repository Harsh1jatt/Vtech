import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/db";
import Student from "@/models/Student";
import Course from "@/models/Course";
import { requireAdmin } from "@/lib/adminAuth";

function errorResponse(error) {
  console.error("Student API error:", error);

  if (error?.status) {
    return NextResponse.json(
      {
        success: false,
        message:
          error.status === 401
            ? "Authentication required."
            : "You are not authorized.",
      },
      { status: error.status }
    );
  }

  if (error?.code === 11000) {
    if (error.keyPattern?.rollNumber) {
      return NextResponse.json(
        {
          success: false,
          message: "This roll number is already assigned.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "A record with this value already exists.",
      },
      { status: 409 }
    );
  }

  if (error?.name === "ValidationError") {
    const errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return NextResponse.json(
      {
        success: false,
        message: "Validation failed.",
        errors,
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "Something went wrong.",
    },
    { status: 500 }
  );
}

export async function GET(request) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status");
    const courseId = searchParams.get("course");

    const page = Math.max(
      parseInt(searchParams.get("page") || "1", 10),
      1
    );

    const limit = Math.min(
      Math.max(
        parseInt(searchParams.get("limit") || "20", 10),
        1
      ),
      100
    );

    const query = {};

    if (status) {
      query.status = status;
    }

    if (courseId) {
      query.course = courseId;
    }

    if (searchParams.get("admissionDate")) {
      query.admissionDate = {
        $gte: new Date(`${searchParams.get("admissionDate")}-01`),
        $lt: new Date(`${searchParams.get("admissionDate")}-32`),
      };
    }

    if (search) {
      const regex = new RegExp(search, "i");

      query.$or = [
        { fullName: regex },
        { rollNumber: regex },
        { phone: regex },
        { email: regex },
      ];
    }

    const skip = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find(query)
        .populate("course", "title shortTitle slug category")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      Student.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,

      students,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const body = await request.json();

    const fullName = body.fullName?.trim();
    const phone = body.phone?.trim();
    const email = body.email?.trim().toLowerCase();
    const rollNumber = body.rollNumber?.trim();
    const course = body.course;
    const admissionDate = body.admissionDate;

    if (!fullName || !phone || !rollNumber || !course || !admissionDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Full name, phone, course, roll number and admission date are required.",
        },
        { status: 400 }
      );
    }

    const courseExists = await Course.exists({
      _id: course,
    });

    if (!courseExists) {
      return NextResponse.json(
        {
          success: false,
          message: "Selected course does not exist.",
        },
        { status: 400 }
      );
    }

    const existingStudent = await Student.findOne({
      rollNumber,
    });

    if (existingStudent) {
      return NextResponse.json(
        {
          success: false,
          message: "This roll number is already assigned.",
        },
        { status: 409 }
      );
    }

    const student = await Student.create({
      fullName,

      fatherName: body.fatherName?.trim() || "",

      motherName: body.motherName?.trim() || "",

      dateOfBirth: body.dateOfBirth || null,

      phone,

      email: email || "",

      address: body.address?.trim() || "",

      course,

      rollNumber,

      admissionDate,

      courseStartDate: body.courseStartDate || null,

      courseCompletionDate: body.courseCompletionDate || null,

      status: body.status || "Active",

      notes: body.notes?.trim() || "",
    });

    const populatedStudent = await Student.findById(student._id).populate(
      "course",
      "title shortTitle slug category"
    );

    return NextResponse.json(
      {
        success: true,
        message: "Student registered successfully.",
        student: populatedStudent,
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}