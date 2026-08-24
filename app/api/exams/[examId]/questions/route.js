import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import Exam from "@/models/Exam";
import Question from "@/models/Question";
import { requireAdmin } from "@/lib/adminAuth";

function errorResponse(error) {
  console.error("Question API error:", error);

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

export async function GET(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { examId } = await params;

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID.",
        },
        { status: 400 }
      );
    }

    const exam = await Exam.findById(examId)
      .select("_id title isActive")
      .lean();

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

export async function POST(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { examId } = await params;

    if (!mongoose.Types.ObjectId.isValid(examId)) {
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

    const question = String(body.question || "").trim();

    const options = Array.isArray(body.options)
      ? body.options.map((option) => String(option).trim())
      : [];

    const correctAnswer = String(
      body.correctAnswer || ""
    ).trim();

    let order;

    if (body.order !== undefined) {
      order = Number(body.order);
    } else {
      const lastQuestion = await Question.findOne({
        examId,
      })
        .sort({ order: -1 })
        .select("order")
        .lean();

      order = lastQuestion ? lastQuestion.order + 1 : 1;
    }

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message: "Question is required.",
        },
        { status: 400 }
      );
    }

    if (options.length !== 4) {
      return NextResponse.json(
        {
          success: false,
          message: "Exactly 4 options are required.",
        },
        { status: 400 }
      );
    }

    if (options.some((option) => !option)) {
      return NextResponse.json(
        {
          success: false,
          message: "All options must contain text.",
        },
        { status: 400 }
      );
    }

    if (!correctAnswer || !options.includes(correctAnswer)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Correct answer must match one of the provided options.",
        },
        { status: 400 }
      );
    }

    if (!Number.isInteger(order) || order < 1) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Question order must be a positive whole number.",
        },
        { status: 400 }
      );
    }

    const duplicateOrder = await Question.findOne({
      examId,
      order,
    });

    if (duplicateOrder) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A question with this order already exists.",
        },
        { status: 409 }
      );
    }

    const newQuestion = await Question.create({
      examId,
      question,
      options,
      correctAnswer,
      order,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Question created successfully.",
        question: newQuestion,
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}