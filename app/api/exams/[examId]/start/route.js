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

    const questionCount = await Question.countDocuments({
      examId,
    });

    if (!questionCount) {
      return NextResponse.json(
        { success: false, message: "This exam has no questions." },
        { status: 409 }
      );
    }

    const activeAttempt = await ExamAttempt.findOne({
      studentId: student._id,
      examId,
      status: "in-progress",
    });

    if (activeAttempt) {
      const elapsed =
        Math.floor(
          (Date.now() - activeAttempt.startedAt.getTime()) / 1000
        );

      const duration = exam.durationMinutes * 60;

      if (elapsed < duration) {
        const questions = await Question.find({ examId })
          .select("_id question options order")
          .sort({ order: 1 })
          .lean();

        return NextResponse.json({
          success: true,
          message: "Existing attempt resumed.",
          attemptId: activeAttempt._id,
          exam,
          startedAt: activeAttempt.startedAt,
          remainingSeconds: duration - elapsed,
          questions,
        });
      }

      activeAttempt.status = "submitted";
      activeAttempt.submittedAt = new Date();
      activeAttempt.timeTakenSeconds = duration;
      activeAttempt.autoSubmitted = true;
      await activeAttempt.save();
    }

    if (!exam.allowMultipleAttempts) {
      const previousAttempt = await ExamAttempt.exists({
        studentId: student._id,
        examId,
        status: "submitted",
      });

      if (previousAttempt) {
        return NextResponse.json(
          {
            success: false,
            message: "You have already attempted this exam.",
          },
          { status: 409 }
        );
      }
    }

    const attempt = await ExamAttempt.create({
      studentId: student._id,
      examId,
      startedAt: new Date(),
      status: "in-progress",
      answers: [],
    });

    const questions = await Question.find({ examId })
      .select("_id question options order")
      .sort({ order: 1 })
      .lean();

    return NextResponse.json(
      {
        success: true,
        message: "Exam started successfully.",
        attemptId: attempt._id,
        exam,
        startedAt: attempt.startedAt,
        remainingSeconds: exam.durationMinutes * 60,
        questions,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Start exam error:", error);

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