import mongoose from "mongoose";

const { Schema } = mongoose;

const questionSchema = new Schema(
  {
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Exam ID is required"],
      index: true,
    },

    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
      maxlength: [2000, "Question cannot exceed 2000 characters"],
    },

    options: {
      type: [String],
      required: [true, "Question options are required"],
      validate: [
        {
          validator: function (value) {
            return Array.isArray(value) && value.length === 4;
          },
          message: "Exactly 4 options are required",
        },
        {
          validator: function (value) {
            return value.every(
              (option) =>
                typeof option === "string" && option.trim().length > 0
            );
          },
          message: "All options must contain text",
        },
      ],
    },

    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
      trim: true,
    },

    order: {
      type: Number,
      required: [true, "Question order is required"],
      min: [1, "Question order must be at least 1"],
    },
  },
  {
    timestamps: true,
  }
);

questionSchema.index({ examId: 1, order: 1 });

questionSchema.pre("validate", function () {
  if (
    Array.isArray(this.options) &&
    this.options.length === 4 &&
    this.correctAnswer &&
    !this.options.includes(this.correctAnswer)
  ) {
    this.invalidate(
      "correctAnswer",
      "Correct answer must match one of the options"
    );
  }
});

const Question =
  mongoose.models.Question ||
  mongoose.model("Question", questionSchema);

export default Question;