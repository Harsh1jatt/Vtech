import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import Exam from "@/models/Exam";
import Question from "@/models/Question";
import { requireAdmin } from "@/lib/adminAuth";

function errorResponse(error) {
  console.error("Question detail API error:", error);

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

export async function PUT(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { examId, questionId } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(examId) ||
      !mongoose.Types.ObjectId.isValid(questionId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam or question ID.",
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

    const questionDoc = await Question.findOne({
      _id: questionId,
      examId,
    });

    if (!questionDoc) {
      return NextResponse.json(
        {
          success: false,
          message: "Question not found.",
        },
        { status: 404 }
      );
    }

    const body = await request.json();

    if (body.question !== undefined) {
      const value = String(body.question).trim();

      if (!value) {
        return NextResponse.json(
          {
            success: false,
            message: "Question cannot be empty.",
          },
          { status: 400 }
        );
      }

      questionDoc.question = value;
    }

    if (body.options !== undefined) {
      if (!Array.isArray(body.options)) {
        return NextResponse.json(
          {
            success: false,
            message: "Options must be an array.",
          },
          { status: 400 }
        );
      }

      const options = body.options.map((option) =>
        String(option).trim()
      );

      if (
        options.length !== 4 ||
        options.some((option) => !option)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Exactly 4 non-empty options are required.",
          },
          { status: 400 }
        );
      }

      questionDoc.options = options;
    }

    if (body.correctAnswer !== undefined) {
      questionDoc.correctAnswer = String(
        body.correctAnswer
      ).trim();
    }

    if (body.order !== undefined) {
      const order = Number(body.order);

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
        _id: { $ne: questionDoc._id },
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

      questionDoc.order = order;
    }

    if (
      !questionDoc.options.includes(
        questionDoc.correctAnswer
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Correct answer must match one of the options.",
        },
        { status: 400 }
      );
    }

    await questionDoc.save();

    return NextResponse.json({
      success: true,
      message: "Question updated successfully.",
      question: questionDoc,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { examId, questionId } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(examId) ||
      !mongoose.Types.ObjectId.isValid(questionId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam or question ID.",
        },
        { status: 400 }
      );
    }

    const question = await Question.findOne({
      _id: questionId,
      examId,
    });

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message: "Question not found.",
        },
        { status: 404 }
      );
    }

    await Question.deleteOne({
      _id: question._id,
    });

    return NextResponse.json({
      success: true,
      message: "Question deleted successfully.",
    });
  } catch (error) {
    return errorResponse(error);
  }
}