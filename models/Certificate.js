const mongoose = require("mongoose");
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
    },
    format: {
      type: String,
    },
    resourceType: {
      type: String,
    },
  },
  { _id: false }
);

const certificateSchema = new Schema(
  {
    certificateNumber: {
      type: String,
      required: [true, "Certificate number is required"],
      unique: true,
      trim: true,
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
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Certificate || mongoose.model("Certificate", certificateSchema);