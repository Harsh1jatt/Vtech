import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Course from "@/models/Course";
import { requireAdmin } from "@/lib/adminAuth";
import { uploadToCloudinary } from "@/lib/cloudinary";

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
  console.error("Course API error:", error);

  if (error?.status) {
    return NextResponse.json(
      {
        success: false,
        message:
          error.status === 401
            ? "Authentication required."
            : "You are not authorized to perform this action.",
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

export async function GET(request) {
  try {
    const requestUrl = new URL(request.url);
    const isAdminRequest = requestUrl.pathname.startsWith("/api/admin/");

    if (isAdminRequest) {
      await requireAdmin();
    }

    await connectToDatabase();

    const { searchParams } = requestUrl;

    const slug = searchParams.get("slug");
    const status = searchParams.get("status");
    const featured = searchParams.get("featured");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const query = {};

    if (!isAdminRequest && !status) {
      query.status = "Active";
    }

    if (slug) {
      query.slug = slug.toLowerCase().trim();
    }

    if (status) {
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (featured !== null) {
      query.featured = featured === "true";
    }

    if (search) {
      const regex = new RegExp(search.trim(), "i");

      query.$or = [
        { title: regex },
        { shortTitle: regex },
        { category: regex },
        { slug: regex },
      ];
    }

    const courses = await Course.find(query).sort({
      featured: -1,
      createdAt: -1,
    });

    return NextResponse.json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request) {
  try {
    await requireAdmin();
    await connectToDatabase();

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

    const title = data.title?.trim();

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          message: "Course title is required.",
        },
        { status: 400 }
      );
    }

    const slug = slugify(data.slug || title);

    const existingCourse = await Course.findOne({ slug });

    if (existingCourse) {
      return NextResponse.json(
        {
          success: false,
          message: "A course with this slug already exists.",
        },
        { status: 409 }
      );
    }

    let thumbnail = {
      url: "",
      publicId: "",
    };

    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());

      const uploaded = await uploadToCloudinary(buffer, {
        folder: "vtech/courses",
        resourceType: "image",
        originalName: imageFile.name,
      });

      thumbnail = {
        url: uploaded.url,
        publicId: uploaded.publicId,
      };
    }

    const course = await Course.create({
      slug,

      title,

      shortTitle: data.shortTitle?.trim(),

      category: data.category?.trim(),

      level: data.level?.trim() || "",

      duration: data.duration?.trim(),

      type: data.type?.trim(),

      featured: parseBoolean(data.featured),

      thumbnail,

      description: data.description?.trim(),

      shortDescription: data.shortDescription?.trim(),

      highlights: parseJSON(data.highlights, []),

      skills: parseJSON(data.skills, []),

      curriculum: parseJSON(data.curriculum, []),

      projects: parseJSON(data.projects, []),

      fees: data.fees?.trim() || "Contact for Fee",

      status: data.status || "Active",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully.",
        course,
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}