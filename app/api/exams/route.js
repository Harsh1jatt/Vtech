import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/db";
import Exam from "@/models/Exam";
import Question from "@/models/Question";
import { requireAdmin } from "@/lib/adminAuth";

function errorResponse(error) {
  console.error("Exam API error:", error);

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
        message: "A duplicate record already exists.",
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

export async function GET() {
  try {
    await requireAdmin();
    await connectToDatabase();

    const exams = await Exam.find()
      .sort({ createdAt: -1 })
      .lean();

    const examIds = exams.map((exam) => exam._id);

    const questionCounts = await Question.aggregate([
      {
        $match: {
          examId: { $in: examIds },
        },
      },
      {
        $group: {
          _id: "$examId",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map(
      questionCounts.map((item) => [
        item._id.toString(),
        item.count,
      ])
    );

    const examsWithCounts = exams.map((exam) => ({
      ...exam,
      questionCount: countMap.get(exam._id.toString()) || 0,
    }));

    return NextResponse.json({
      success: true,
      exams: examsWithCounts,
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

    const title = String(body.title || "").trim();
    const description = String(body.description || "").trim();

    const durationMinutes = Number(body.durationMinutes);
    const passingPercentage = Number(body.passingPercentage);

    const isActive = Boolean(body.isActive);
    const allowMultipleAttempts =
      Boolean(body.allowMultipleAttempts);

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam title is required.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(durationMinutes) ||
      durationMinutes < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Duration must be a positive whole number.",
        },
        { status: 400 }
      );
    }

    if (
      !Number.isFinite(passingPercentage) ||
      passingPercentage < 0 ||
      passingPercentage > 100
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

    if (isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Create the exam first, add at least one question, then activate it.",
        },
        { status: 400 }
      );
    }

    const exam = await Exam.create({
      title,
      description,
      durationMinutes,
      passingPercentage,
      isActive: false,
      allowMultipleAttempts,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Exam created successfully.",
        exam,
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}