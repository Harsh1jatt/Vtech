import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import ExamAttempt from "@/models/ExamAttempt";
import { requireStudent } from "@/lib/examAuth";

export async function GET(request, { params }) {
  try {
    const student = await requireStudent();
    await connectToDatabase();

    const { attemptId } = await params;

    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid attempt ID.",
        },
        { status: 400 }
      );
    }

    const attempt = await ExamAttempt.findOne({
      _id: attemptId,
      studentId: student._id,
    })
      .populate(
        "examId",
        "title description durationMinutes passingPercentage"
      )
      .populate(
        "answers.questionId",
        "question options order"
      )
      .lean();

    if (!attempt) {
      return NextResponse.json(
        {
          success: false,
          message: "Attempt not found.",
        },
        { status: 404 }
      );
    }

    const safeAnswers = attempt.answers.map((answer) => ({
      questionId: answer.questionId?._id || answer.questionId,
      question: answer.questionId?.question || "",
      options: answer.questionId?.options || [],
      order: answer.questionId?.order || 0,
      selectedAnswer: answer.selectedAnswer,
    }));

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt._id,
        exam: attempt.examId,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        timeTakenSeconds: attempt.timeTakenSeconds,
        status: attempt.status,
        correctCount: attempt.correctCount,
        wrongCount: attempt.wrongCount,
        unansweredCount: attempt.unansweredCount,
        score: attempt.score,
        percentage: attempt.percentage,
        passed: attempt.passed,
        autoSubmitted: attempt.autoSubmitted,
        answers: safeAnswers,
      },
    });
  } catch (error) {
    console.error("Student result error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error?.status === 401
            ? "Authentication required."
            : "Something went wrong.",
      },
      { status: error?.status || 500 }
    );
  }
}