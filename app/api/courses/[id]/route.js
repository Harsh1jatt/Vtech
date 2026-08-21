import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import Course from "@/models/Course";
import Student from "@/models/Student";

import { requireAdmin } from "@/lib/adminAuth";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/lib/cloudinary";

function slugify(value) {
  return value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function parseJSON(value, fallback = []) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  if (Array.isArray(value)) {
    return value;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function parseBoolean(value, fallback = false) {
  if (value === undefined || value === null) {
    return fallback;
  }

  if (typeof value === "boolean") {
    return value;
  }

  return value === "true";
}

function errorResponse(error) {
  console.error("Course detail API error:", error);

  if (error?.status) {
    return NextResponse.json(
      {
        success: false,
        message:
          error.status === 401
            ? "Authentication required."
            : "You are not authorized.",
      },
      { status: error.status }
    );
  }

  if (error?.code === 11000) {
    return NextResponse.json(
      {
        success: false,
        message: "A course with this slug already exists.",
      },
      { status: 409 }
    );
  }

  if (error?.name === "ValidationError") {
    const errors = {};

    Object.keys(error.errors).forEach((key) => {
      errors[key] = error.errors[key].message;
    });

    return NextResponse.json(
      {
        success: false,
        message: "Validation failed.",
        errors,
      },
      { status: 400 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      message: "Something went wrong.",
    },
    { status: 500 }
  );
}

async function findCourse(id) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return Course.findById(id);
  }

  return Course.findOne({
    slug: id.toLowerCase(),
  });
}

export async function GET(request, { params }) {
  try {
    const requestUrl = new URL(request.url);

    if (requestUrl.pathname.startsWith("/api/admin/")) {
      await requireAdmin();
    }

    await connectToDatabase();

    const { id } = await params;

    const course = await findCourse(id);

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      course,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { id } = await params;

    const course = await findCourse(id);

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found.",
        },
        { status: 404 }
      );
    }

    const contentType = request.headers.get("content-type") || "";

    let data = {};
    let imageFile = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();

      for (const [key, value] of formData.entries()) {
        if (key === "thumbnail") {
          if (value instanceof File && value.size > 0) {
            imageFile = value;
          }
        } else {
          data[key] = value;
        }
      }
    } else {
      data = await request.json();
    }

    if (data.title !== undefined) {
      course.title = data.title.trim();
    }

    if (data.slug !== undefined) {
      course.slug = slugify(data.slug);
    } else if (data.title !== undefined) {
      course.slug = slugify(data.title);
    }

    if (data.shortTitle !== undefined) {
      course.shortTitle = data.shortTitle.trim();
    }

    if (data.category !== undefined) {
      course.category = data.category.trim();
    }

    if (data.level !== undefined) {
      course.level = data.level.trim();
    }

    if (data.duration !== undefined) {
      course.duration = data.duration.trim();
    }

    if (data.type !== undefined) {
      course.type = data.type.trim();
    }

    if (data.featured !== undefined) {
      course.featured = parseBoolean(data.featured);
    }

    if (data.description !== undefined) {
      course.description = data.description.trim();
    }

    if (data.shortDescription !== undefined) {
      course.shortDescription = data.shortDescription.trim();
    }

    if (data.highlights !== undefined) {
      course.highlights = parseJSON(data.highlights, []);
    }

    if (data.skills !== undefined) {
      course.skills = parseJSON(data.skills, []);
    }

    if (data.curriculum !== undefined) {
      course.curriculum = parseJSON(data.curriculum, []);
    }

    if (data.projects !== undefined) {
      course.projects = parseJSON(data.projects, []);
    }

    if (data.fees !== undefined) {
      course.fees = data.fees.trim();
    }

    if (data.status !== undefined) {
      course.status = data.status;
    }

    const oldPublicId = course.thumbnail?.publicId;

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploaded = await uploadToCloudinary(buffer, {
        folder: "vtech/courses",
        resourceType: "image",
        originalName: imageFile.name,
      });

      course.thumbnail = {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    }

    await course.save();

    if (
      imageFile &&
      oldPublicId &&
      oldPublicId !== course.thumbnail.publicId
    ) {
      await deleteFromCloudinary(oldPublicId, "image");
    }

    return NextResponse.json({
      success: true,
      message: "Course updated successfully.",
      course,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const { id } = await params;

    const course = await findCourse(id);

    if (!course) {
      return NextResponse.json(
        {
          success: false,
          message: "Course not found.",
        },
        { status: 404 }
      );
    }

    const studentCount = await Student.countDocuments({
      course: course._id,
    });

    if (studentCount > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete this course because ${studentCount} student(s) are enrolled in it. Reassign or remove those students first.`,
        },
        { status: 409 }
      );
    }

    const publicId = course.thumbnail?.publicId;

    await Course.deleteOne({
      _id: course._id,
    });

    if (publicId) {
      await deleteFromCloudinary(publicId, "image");
    }

    return NextResponse.json({
      success: true,
      message: "Course deleted successfully.",
    });
  } catch (error) {
    return errorResponse(error);
  }
}