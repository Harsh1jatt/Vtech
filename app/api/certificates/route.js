import { NextResponse } from "next/server";
import mongoose from "mongoose";
import crypto from "crypto";

import connectToDatabase from "@/lib/db";
import Certificate from "@/models/Certificate";
import Student from "@/models/Student";
import "@/models/Course";

import { uploadToCloudinary } from "@/lib/cloudinary";

function generateCertificateNumber() {
  const year = new Date().getFullYear();
  const random = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `VTECH-${year}-${random}`;
}

function getResourceType(fileType) {
  if (fileType === "application/pdf") {
    return "raw";
  }

  return "image";
}

/**
 * GET /api/certificates
 *
 * Query parameters:
 * ?search=
 * ?status=
 * ?course=
 * ?page=
 * ?limit=
 */
export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search")?.trim() || "";
    const status = searchParams.get("status")?.trim() || "";
    const course = searchParams.get("course")?.trim() || "";

    const page = Math.max(
      Number.parseInt(searchParams.get("page") || "1", 10),
      1
    );

    const limit = Math.min(
      Math.max(
        Number.parseInt(searchParams.get("limit") || "20", 10),
        1
      ),
      100
    );

    const skip = (page - 1) * limit;

    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (course && mongoose.Types.ObjectId.isValid(course)) {
      filter["student.course"] = new mongoose.Types.ObjectId(course);
    }

    if (search) {
      const students = await Student.find({
        $or: [
          { fullName: { $regex: search, $options: "i" } },
          { rollNumber: { $regex: search, $options: "i" } },
        ],
      })
        .select("_id")
        .lean();

      const studentIds = students.map((student) => student._id);

      filter.$or = [
        {
          certificateNumber: {
            $regex: search,
            $options: "i",
          },
        },
        {
          student: {
            $in: studentIds,
          },
        },
      ];
    }

    const [certificates, total] = await Promise.all([
      Certificate.find(filter)
        .populate({
          path: "student",
          populate: {
            path: "course",
          },
        })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Certificate.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      data: certificates,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("GET /api/certificates error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch certificates.",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/certificates
 *
 * multipart/form-data
 */
export async function POST(request) {
  try {
    await connectToDatabase();

    const formData = await request.formData();

    const studentId = formData.get("studentId");
    const certificateNumberInput = formData.get("certificateNumber");
    const statusInput = formData.get("status");
    const file = formData.get("certificateFile");

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Student is required.",
        },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid student ID.",
        },
        { status: 400 }
      );
    }

    if (!file || typeof file === "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate file is required.",
        },
        { status: 400 }
      );
    }

    const student = await Student.findById(studentId)
      .populate("course")
      .lean();

    if (!student) {
      return NextResponse.json(
        {
          success: false,
          message: "Student not found.",
        },
        { status: 404 }
      );
    }

    if (student.status !== "Completed") {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate can only be issued to a completed student.",
        },
        { status: 400 }
      );
    }

    const maxFileSize = 10 * 1024 * 1024;

    if (file.size > maxFileSize) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate file must be 10 MB or smaller.",
        },
        { status: 400 }
      );
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only PDF, JPG, PNG and WebP certificates are allowed.",
        },
        { status: 400 }
      );
    }

    let certificateNumber =
      certificateNumberInput?.toString().trim().toUpperCase() ||
      generateCertificateNumber();

    const existingCertificate = await Certificate.findOne({
      certificateNumber,
    });

    if (existingCertificate) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate number already exists.",
        },
        { status: 409 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    const resourceType = getResourceType(file.type);

    const uploadedFile = await uploadToCloudinary(buffer, {
      folder: "vtech/certificates",
      resourceType,
      originalName: file.name,
    });

    try {
      const certificate = await Certificate.create({
        certificateNumber,
        student: student._id,
        status: statusInput || "VALID",
        certificateFile: {
          url: uploadedFile.url,
          publicId: uploadedFile.publicId,
          originalName: file.name,
          format: uploadedFile.format,
          resourceType: uploadedFile.resourceType,
        },
      });

      const populatedCertificate = await Certificate.findById(
        certificate._id
      )
        .populate({
          path: "student",
          populate: {
            path: "course",
          },
        })
        .lean();

      return NextResponse.json(
        {
          success: true,
          message: "Certificate issued successfully.",
          data: populatedCertificate,
        },
        { status: 201 }
      );
    } catch (databaseError) {
      // If MongoDB creation fails after Cloudinary upload,
      // clean up the uploaded file.
      try {
        const { deleteFromCloudinary } = await import("@/lib/cloudinary");

        await deleteFromCloudinary(
          uploadedFile.publicId,
          uploadedFile.resourceType
        );
      } catch (cleanupError) {
        console.error(
          "Cloudinary cleanup failed:",
          cleanupError
        );
      }

      throw databaseError;
    }
  } catch (error) {
    console.error("POST /api/certificates error:", error);

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate number already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to issue certificate.",
      },
      { status: 500 }
    );
  }
}