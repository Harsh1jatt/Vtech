import mongoose from "mongoose";

const { Schema } = mongoose;

const answerSchema = new Schema(
  {
    questionId: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },

    selectedAnswer: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    _id: false,
  }
);

const examAttemptSchema = new Schema(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student ID is required"],
      index: true,
    },

    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Exam ID is required"],
      index: true,
    },

    startedAt: {
      type: Date,
      required: [true, "Start time is required"],
      default: Date.now,
    },

    submittedAt: {
      type: Date,
      default: null,
    },

    timeTakenSeconds: {
      type: Number,
      default: 0,
      min: 0,
    },

    status: {
      type: String,
      enum: ["in-progress", "submitted"],
      default: "in-progress",
      index: true,
    },

    answers: {
      type: [answerSchema],
      default: [],
    },

    correctCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    wrongCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    unansweredCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    score: {
      type: Number,
      default: 0,
      min: 0,
    },

    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    passed: {
      type: Boolean,
      default: false,
    },

    autoSubmitted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

examAttemptSchema.index({
  studentId: 1,
  examId: 1,
  status: 1,
});

examAttemptSchema.index({
  examId: 1,
  submittedAt: -1,
});

examAttemptSchema.index({
  studentId: 1,
  createdAt: -1,
});

const ExamAttempt =
  mongoose.models.ExamAttempt ||
  mongoose.model("ExamAttempt", examAttemptSchema);

export default ExamAttempt;