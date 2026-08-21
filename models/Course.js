import mongoose from "mongoose";

const { Schema } = mongoose;

const curriculumItemSchema = new Schema(
  {
    month: {
      type: Number,
      required: [true, "Month is required"],
      min: [1, "Month must be at least 1"],
    },

    title: {
      type: String,
      required: [true, "Curriculum title is required"],
      trim: true,
    },

    topics: {
      type: [String],
      default: [],
    },
  },
  { _id: false }
);

const projectItemSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const thumbnailSchema = new Schema(
  {
    url: {
      type: String,
      trim: true,
      default: "",
    },

    publicId: {
      type: String,
      trim: true,
      default: "",
    },
  },
  { _id: false }
);

const courseSchema = new Schema(
  {
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    shortTitle: {
      type: String,
      required: [true, "Short title is required"],
      trim: true,
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true,
      index: true,
    },

    level: {
      type: String,
      trim: true,
      default: "",
    },

    duration: {
      type: String,
      required: [true, "Duration is required"],
      trim: true,
    },

    type: {
      type: String,
      required: [true, "Type is required"],
      trim: true,
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },

    thumbnail: {
      type: thumbnailSchema,
      default: () => ({
        url: "",
        publicId: "",
      }),
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },

    shortDescription: {
      type: String,
      required: [true, "Short description is required"],
      trim: true,
    },

    highlights: {
      type: [String],
      default: [],
    },

    skills: {
      type: [String],
      default: [],
    },

    curriculum: {
      type: [curriculumItemSchema],
      default: [],
    },

    projects: {
      type: [projectItemSchema],
      default: [],
    },

    fees: {
      type: String,
      trim: true,
      default: "Contact for Fee",
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

const Course =
  mongoose.models.Course || mongoose.model("Course", courseSchema);

export default Course;