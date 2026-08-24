import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import Exam from "@/models/Exam";
import ExamAttempt from "@/models/ExamAttempt";
import { requireAdmin } from "@/lib/adminAuth";

export async function GET(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid exam ID.",
        },
        { status: 400 }
      );
    }

    const exam = await Exam.findById(id).lean();

    if (!exam) {
      return NextResponse.json(
        {
          success: false,
          message: "Exam not found.",
        },
        { status: 404 }
      );
    }

    const attempts = await ExamAttempt.find({
      examId: id,
      status: "submitted",
    })
      .populate(
        "studentId",
        "fullName rollNumber phone email course"
      )
      .sort({ submittedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      exam,
      attempts: attempts.map((attempt) => ({
        id: attempt._id,
        student: attempt.studentId,
        startedAt: attempt.startedAt,
        submittedAt: attempt.submittedAt,
        timeTakenSeconds: attempt.timeTakenSeconds,
        correctCount: attempt.correctCount,
        wrongCount: attempt.wrongCount,
        unansweredCount: attempt.unansweredCount,
        score: attempt.score,
        percentage: attempt.percentage,
        passed: attempt.passed,
        autoSubmitted: attempt.autoSubmitted,
      })),
    });
  } catch (error) {
    console.error("Admin results error:", error);

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