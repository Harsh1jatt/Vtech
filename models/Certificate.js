import mongoose from "mongoose";

const { Schema } = mongoose;

const certificateFileSchema = new Schema(
  {
    url: {
      type: String,
      required: [true, "Certificate file URL is required"],
    },

    publicId: {
      type: String,
      required: [true, "Certificate file publicId is required"],
    },

    originalName: {
      type: String,
      default: "",
    },

    format: {
      type: String,
      default: "",
    },

    resourceType: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const certificateSchema = new Schema(
  {
    certificateNumber: {
      type: String,
      required: [true, "Certificate number is required"],
      unique: true,
      trim: true,
      uppercase: true,
      index: true,
    },

    student: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "Student reference is required"],
      index: true,
    },

    certificateFile: {
      type: certificateFileSchema,
      required: [true, "Certificate file metadata is required"],
    },

    status: {
      type: String,
      enum: ["VALID", "REVOKED", "EXPIRED"],
      default: "VALID",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

certificateSchema.index({
  certificateNumber: 1,
});

certificateSchema.index({
  student: 1,
  status: 1,
});

const Certificate =
  mongoose.models.Certificate ||
  mongoose.model("Certificate", certificateSchema);

export default Certificate;