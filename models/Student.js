import mongoose from "mongoose";

const { Schema } = mongoose;

const studentSchema = new Schema(
  {
    // ---------- Personal Information ----------

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    fatherName: {
      type: String,
      trim: true,
      default: "",
    },

    motherName: {
      type: String,
      trim: true,
      default: "",
    },

    dateOfBirth: {
      type: Date,
      default: null,
    },

    // ---------- Contact Information ----------

    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      index: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: "",
      validate: {
        validator: function (value) {
          if (!value) return true;

          return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(
            value
          );
        },

        message: "Please provide a valid email address",
      },
    },

    address: {
      type: String,
      trim: true,
      default: "",
    },

    // ---------- Academic Information ----------

    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
      index: true,
    },

    rollNumber: {
      type: String,
      required: [true, "Roll number is required"],
      trim: true,
      unique: true,
      index: true,
    },

    admissionDate: {
      type: Date,
      required: [true, "Admission date is required"],
    },

    courseStartDate: {
      type: Date,
      default: null,
    },

    courseCompletionDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["Active", "Completed", "Inactive"],
      default: "Active",
      required: true,
      index: true,
    },

    notes: {
      type: String,
      trim: true,
      default: "",
    },
  },

  {
    timestamps: true,
  }
);

const Student =
  mongoose.models.Student || mongoose.model("Student", studentSchema);

export default Student;