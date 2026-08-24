import mongoose from "mongoose";

const { Schema } = mongoose;

const examSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Exam title is required"],
      trim: true,
      maxlength: [200, "Exam title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    durationMinutes: {
      type: Number,
      required: [true, "Exam duration is required"],
      min: [1, "Exam duration must be at least 1 minute"],
      max: [1440, "Exam duration cannot exceed 1440 minutes"],
    },

    passingPercentage: {
      type: Number,
      required: [true, "Passing percentage is required"],
      min: [0, "Passing percentage cannot be below 0"],
      max: [100, "Passing percentage cannot exceed 100"],
    },

    isActive: {
      type: Boolean,
      default: false,
      index: true,
    },

    allowMultipleAttempts: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

examSchema.index({ isActive: 1, createdAt: -1 });

const Exam =
  mongoose.models.Exam || mongoose.model("Exam", examSchema);

export default Exam;