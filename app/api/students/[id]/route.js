import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import Student from "@/models/Student";
import Course from "@/models/Course";
import { requireAdmin } from "@/lib/adminAuth";

function errorResponse(error) {
  console.error("Student detail API error:", error);

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
    return NextResponse.json(
      {
        success: false,
        message: "This roll number is already assigned.",
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

export async function GET(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid student ID.",
        },
        { status: 400 }
      );
    }

    const student = await Student.findById(id).populate(
      "course",
      "title shortTitle slug category duration type"
    );

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      student,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid student ID.",
        },
        { status: 400 }
      );
    }

    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (body.fullName !== undefined) {
      student.fullName = body.fullName.trim();
    }

    if (body.fatherName !== undefined) {
      student.fatherName = body.fatherName.trim();
    }

    if (body.motherName !== undefined) {
      student.motherName = body.motherName.trim();
    }

    if (body.dateOfBirth !== undefined) {
      student.dateOfBirth = body.dateOfBirth || null;
    }

    if (body.phone !== undefined) {
      student.phone = body.phone.trim();
    }

    if (body.email !== undefined) {
      student.email = body.email.trim().toLowerCase();
    }

    if (body.address !== undefined) {
      student.address = body.address.trim();
    }

    if (body.course !== undefined) {
      const courseExists = await Course.exists({
        _id: body.course,
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

      student.course = body.course;
    }

    if (body.rollNumber !== undefined) {
      const rollNumber = body.rollNumber.trim();

      const duplicate = await Student.findOne({
        rollNumber,
        _id: { $ne: student._id },
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message: "This roll number is already assigned.",
          },
          { status: 409 }
        );
      }

      student.rollNumber = rollNumber;
    }

    if (body.admissionDate !== undefined) {
      student.admissionDate = body.admissionDate;
    }

    if (body.courseStartDate !== undefined) {
      student.courseStartDate = body.courseStartDate || null;
    }

    if (body.courseCompletionDate !== undefined) {
      student.courseCompletionDate =
        body.courseCompletionDate || null;
    }

    if (body.status !== undefined) {
      student.status = body.status;
    }

    if (body.notes !== undefined) {
      student.notes = body.notes.trim();
    }

    await student.save();

    const updatedStudent = await Student.findById(student._id).populate(
      "course",
      "title shortTitle slug category duration type"
    );

    return NextResponse.json({
      success: true,
      message: "Student updated successfully.",
      student: updatedStudent,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid student ID.",
        },
        { status: 400 }
      );
    }

    const student = await Student.findById(id);

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found.",
        },
        { status: 404 }
      );
    }

    if (student.certificate?.publicId) {
      // Certificate deletion will be handled here later.
      // Keeping the reference intact for now.
    }

    await Student.deleteOne({
      _id: student._id,
    });

    return NextResponse.json({
      success: true,
      message: "Student deleted successfully.",
    });
  } catch (error) {
    return errorResponse(error);
  }
}