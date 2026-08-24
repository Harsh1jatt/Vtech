import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import Exam from "@/models/Exam";
import Question from "@/models/Question";
import ExamAttempt from "@/models/ExamAttempt";
import { requireStudent } from "@/lib/examAuth";

export async function POST(request, { params }) {
  try {
    const student = await requireStudent();
    await connectToDatabase();

    const { examId } = await params;

    if (!mongoose.Types.ObjectId.isValid(examId)) {
      return NextResponse.json(
        { success: false, message: "Invalid exam ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const attemptId = body.attemptId;

    if (!mongoose.Types.ObjectId.isValid(attemptId)) {
      return NextResponse.json(
        { success: false, message: "Invalid attempt ID." },
        { status: 400 }
      );
    }

    const submittedAnswers = Array.isArray(body.answers)
      ? body.answers
      : [];

    const exam = await Exam.findOne({
      _id: examId,
      isActive: true,
    }).lean();

    if (!exam) {
      return NextResponse.json(
        { success: false, message: "Exam not found or inactive." },
        { status: 404 }
      );
    }

    const attempt = await ExamAttempt.findOne({
      _id: attemptId,
      examId,
      studentId: student._id,
      status: "in-progress",
    });

    if (!attempt) {
      return NextResponse.json(
        {
          success: false,
          message: "Active exam attempt not found.",
        },
        { status: 404 }
      );
    }

    const questions = await Question.find({ examId })
      .sort({ order: 1 })
      .lean();

    const questionMap = new Map(
      questions.map((question) => [
        question._id.toString(),
        question,
      ])
    );

    const answerMap = new Map();

    for (const answer of submittedAnswers) {
      if (!answer?.questionId) continue;

      if (!mongoose.Types.ObjectId.isValid(answer.questionId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid question ID in submission.",
          },
          { status: 400 }
        );
      }

      const question = questionMap.get(
        answer.questionId.toString()
      );

      if (!question) {
        return NextResponse.json(
          {
            success: false,
            message: "Submission contains an invalid question.",
          },
          { status: 400 }
        );
      }

      const selectedAnswer =
        answer.selectedAnswer === null ||
        answer.selectedAnswer === undefined
          ? null
          : String(answer.selectedAnswer).trim();

      if (
        selectedAnswer !== null &&
        !question.options.includes(selectedAnswer)
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Submission contains an invalid answer option.",
          },
          { status: 400 }
        );
      }

      answerMap.set(answer.questionId.toString(), selectedAnswer);
    }

    const elapsedSeconds = Math.max(
      0,
      Math.floor(
        (Date.now() - attempt.startedAt.getTime()) / 1000
      )
    );

    const maxSeconds = exam.durationMinutes * 60;

    const autoSubmitted = elapsedSeconds >= maxSeconds;

    const finalTimeTaken = Math.min(
      elapsedSeconds,
      maxSeconds
    );

    let correctCount = 0;
    let wrongCount = 0;
    let unansweredCount = 0;

    const finalAnswers = questions.map((question) => {
      const questionId = question._id.toString();

      const selectedAnswer = answerMap.has(questionId)
        ? answerMap.get(questionId)
        : null;

      if (selectedAnswer === null) {
        unansweredCount++;
      } else if (selectedAnswer === question.correctAnswer) {
        correctCount++;
      } else {
        wrongCount++;
      }

      return {
        questionId: question._id,
        selectedAnswer,
      };
    });

    const totalQuestions = questions.length;

    const score = correctCount;

    const percentage =
      totalQuestions > 0
        ? Number(
            ((correctCount / totalQuestions) * 100).toFixed(2)
          )
        : 0;

    const passed = percentage >= exam.passingPercentage;

    attempt.answers = finalAnswers;
    attempt.correctCount = correctCount;
    attempt.wrongCount = wrongCount;
    attempt.unansweredCount = unansweredCount;
    attempt.score = score;
    attempt.percentage = percentage;
    attempt.passed = passed;
    attempt.submittedAt = new Date();
    attempt.timeTakenSeconds = finalTimeTaken;
    attempt.autoSubmitted = autoSubmitted;
    attempt.status = "submitted";

    await attempt.save();

    return NextResponse.json({
      success: true,
      message: autoSubmitted
        ? "Exam automatically submitted because time expired."
        : "Exam submitted successfully.",
      attemptId: attempt._id,
      result: {
        correctCount,
        wrongCount,
        unansweredCount,
        totalQuestions,
        score,
        percentage,
        passed,
        timeTakenSeconds: finalTimeTaken,
        autoSubmitted,
      },
    });
  } catch (error) {
    console.error("Submit exam error:", error);

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