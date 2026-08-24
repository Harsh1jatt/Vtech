import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/db";
import Exam from "@/models/Exam";
import Question from "@/models/Question";
import { requireStudent } from "@/lib/examAuth";

export async function GET() {
  try {
    await requireStudent();
    await connectToDatabase();

    const exams = await Exam.find({ isActive: true })
      .sort({ createdAt: -1 })
      .lean();

    const examIds = exams.map((exam) => exam._id);

    const counts = await Question.aggregate([
      { $match: { examId: { $in: examIds } } },
      {
        $group: {
          _id: "$examId",
          count: { $sum: 1 },
        },
      },
    ]);

    const countMap = new Map(
      counts.map((x) => [x._id.toString(), x.count])
    );

    return NextResponse.json({
      success: true,
      exams: exams
        .map((exam) => ({
          ...exam,
          questionCount: countMap.get(exam._id.toString()) || 0,
        }))
        .filter((exam) => exam.questionCount > 0),
    });
  } catch (error) {
    console.error("Available exams error:", error);

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