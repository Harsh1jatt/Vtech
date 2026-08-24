import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import Exam from "@/models/Exam";
import Question from "@/models/Question";
import { requireAdmin } from "@/lib/adminAuth";

function errorResponse(error) {
  console.error("Exam detail API error:", error);

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

async function validateExamId(examId) {
  if (!mongoose.Types.ObjectId.isValid(examId)) {
    return false;
  }

  return true;
}

export async function GET(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { examId } = await params;

    if (!(await validateExamId(examId))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID.",
        },
        { status: 400 }
      );
    }

    const exam = await Exam.findById(examId).lean();

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam not found.",
        },
        { status: 404 }
      );
    }

    const questions = await Question.find({ examId })
      .sort({ order: 1, createdAt: 1 })
      .lean();

    return NextResponse.json({
      success: true,
      exam,
      questions,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { examId } = await params;

    if (!(await validateExamId(examId))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID.",
        },
        { status: 400 }
      );
    }

    const exam = await Exam.findById(examId);

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam not found.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (body.title !== undefined) {
      const title = String(body.title).trim();

      if (!title) {
        return NextResponse.json(
          {
            success: false,
            message: "Exam title cannot be empty.",
          },
          { status: 400 }
        );
      }

      exam.title = title;
    }

    if (body.description !== undefined) {
      exam.description = String(body.description).trim();
    }

    if (body.durationMinutes !== undefined) {
      const duration = Number(body.durationMinutes);

      if (!Number.isInteger(duration) || duration < 1) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Duration must be a positive whole number.",
          },
          { status: 400 }
        );
      }

      exam.durationMinutes = duration;
    }

    if (body.passingPercentage !== undefined) {
      const percentage = Number(body.passingPercentage);

      if (
        !Number.isFinite(percentage) ||
        percentage < 0 ||
        percentage > 100
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Passing percentage must be between 0 and 100.",
          },
          { status: 400 }
        );
      }

      exam.passingPercentage = percentage;
    }

    if (body.allowMultipleAttempts !== undefined) {
      exam.allowMultipleAttempts =
        Boolean(body.allowMultipleAttempts);
    }

    if (body.isActive !== undefined) {
      const requestedActive = Boolean(body.isActive);

      if (requestedActive && !exam.isActive) {
        const questionCount = await Question.countDocuments({
          examId: exam._id,
        });

        if (questionCount === 0) {
          return NextResponse.json(
            {
              success: false,
              message:
                "An exam must have at least one question before activation.",
            },
            { status: 400 }
          );
        }
      }

      exam.isActive = requestedActive;
    }

    await exam.save();

    return NextResponse.json({
      success: true,
      message: "Exam updated successfully.",
      exam,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { examId } = await params;

    if (!(await validateExamId(examId))) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID.",
        },
        { status: 400 }
      );
    }

    const exam = await Exam.findById(examId);

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam not found.",
        },
        { status: 404 }
      );
    }

    const questionCount = await Question.countDocuments({
      examId,
    });

    if (questionCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Delete all questions before deleting this exam.",
        },
        { status: 409 }
      );
    }

    await Exam.deleteOne({ _id: exam._id });

    return NextResponse.json({
      success: true,
      message: "Exam deleted successfully.",
    });
  } catch (error) {
    return errorResponse(error);
  }
}