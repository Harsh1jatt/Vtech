import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import ExamAttempt from "@/models/ExamAttempt";
import Question from "@/models/Question";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { id, attemptId } = await params;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(attemptId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam or attempt ID.",
        },
        { status: 400 }
      );
    }

    const attempt = await ExamAttempt.findOne({
      _id: attemptId,
      examId: id,
      status: "submitted",
    })
      .populate(
        "studentId",
        "fullName rollNumber phone email dateOfBirth course"
      )
      .populate(
        "examId",
        "title description durationMinutes passingPercentage"
      )
      .lean();

    if (!attempt) {
      return NextResponse.json(
        {
          success: false,
          message: "Submitted attempt not found.",
        },
        { status: 404 }
      );
    }

    const questionIds = attempt.answers.map(
      (answer) => answer.questionId
    );

    const questions = await Question.find({
      _id: { $in: questionIds },
      examId: id,
    }).lean();

    const questionMap = new Map(
      questions.map((question) => [
        question._id.toString(),
        question,
      ])
    );

    const answers = attempt.answers.map((answer) => {
      const question = questionMap.get(
        answer.questionId.toString()
      );

      const selectedAnswer = answer.selectedAnswer;
      const correctAnswer = question?.correctAnswer || null;

      let status = "unanswered";

      if (selectedAnswer !== null) {
        status =
          selectedAnswer === correctAnswer
            ? "correct"
            : "wrong";
      }

      return {
        questionId: answer.questionId,
        question: question?.question || "",
        options: question?.options || [],
        order: question?.order || 0,
        selectedAnswer,
        correctAnswer,
        status,
      };
    });

    answers.sort((a, b) => a.order - b.order);

    return NextResponse.json({
      success: true,
      attempt: {
        id: attempt._id,
        student: attempt.studentId,
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
        answers,
      },
    });
  } catch (error) {
    console.error("Admin detailed result error:", error);

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