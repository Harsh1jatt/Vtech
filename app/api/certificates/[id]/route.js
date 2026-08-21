import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import Certificate from "@/models/Certificate";
import Student from "@/models/Student";
import "@/models/Course";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "@/lib/cloudinary";

function getResourceType(fileType) {
  return fileType === "application/pdf" ? "raw" : "image";
}

/**
 * GET /api/certificates/:id
 */
export async function GET(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid certificate ID.",
        },
        { status: 400 }
      );
    }

    const certificate = await Certificate.findById(id)
      .populate({
        path: "student",
        populate: {
          path: "course",
        },
      })
      .lean();

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: certificate,
    });
  } catch (error) {
    console.error("GET certificate error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch certificate.",
      },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/certificates/:id
 *
 * Supports updating:
 * - certificate number
 * - student
 * - status
 * - certificate file
 */
export async function PUT(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid certificate ID.",
        },
        { status: 400 }
      );
    }

    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate not found.",
        },
        { status: 404 }
      );
    }

    const formData = await request.formData();

    const certificateNumber = formData
      .get("certificateNumber")
      ?.toString()
      .trim()
      .toUpperCase();

    const studentId = formData.get("studentId")?.toString();

    const status = formData.get("status")?.toString();

    const file = formData.get("certificateFile");

    if (certificateNumber) {
      const duplicate = await Certificate.findOne({
        certificateNumber,
        _id: { $ne: certificate._id },
      });

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message: "Certificate number already exists.",
          },
          { status: 409 }
        );
      }

      certificate.certificateNumber = certificateNumber;
    }

    if (studentId) {
      if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid student ID.",
          },
          { status: 400 }
        );
      }

      const student = await Student.findById(studentId);

      if (!student) {
        return NextResponse.json(
          {
            success: false,
            message: "Student not found.",
          },
          { status: 404 }
        );
      }

      certificate.student = student._id;
    }

    if (status) {
      const allowedStatuses = [
        "VALID",
        "REVOKED",
        "EXPIRED",
      ];

      if (!allowedStatuses.includes(status)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid certificate status.",
          },
          { status: 400 }
        );
      }

      certificate.status = status;
    }

    let oldCloudinaryFile = null;

    if (file && typeof file !== "string") {
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
            message: "Invalid certificate file type.",
          },
          { status: 400 }
        );
      }

      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json(
          {
            success: false,
            message: "Certificate file must be 10 MB or smaller.",
          },
          { status: 400 }
        );
      }

      oldCloudinaryFile = {
        publicId: certificate.certificateFile.publicId,
        resourceType:
          certificate.certificateFile.resourceType || "image",
      };

      const buffer = Buffer.from(await file.arrayBuffer());

      const uploaded = await uploadToCloudinary(buffer, {
        folder: "vtech/certificates",
        resourceType: getResourceType(file.type),
        originalName: file.name,
      });

      certificate.certificateFile = {
        url: uploaded.url,
        publicId: uploaded.publicId,
        originalName: file.name,
        format: uploaded.format,
        resourceType: uploaded.resourceType,
      };
    }

    await certificate.save();

    if (oldCloudinaryFile) {
      try {
        await deleteFromCloudinary(
          oldCloudinaryFile.publicId,
          oldCloudinaryFile.resourceType
        );
      } catch (cleanupError) {
        console.error(
          "Failed to delete old certificate file:",
          cleanupError
        );
      }
    }

    const updatedCertificate = await Certificate.findById(id)
      .populate({
        path: "student",
        populate: {
          path: "course",
        },
      })
      .lean();

    return NextResponse.json({
      success: true,
      message: "Certificate updated successfully.",
      data: updatedCertificate,
    });
  } catch (error) {
    console.error("PUT certificate error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to update certificate.",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/certificates/:id
 */
export async function DELETE(request, { params }) {
  try {
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid certificate ID.",
        },
        { status: 400 }
      );
    }

    const certificate = await Certificate.findById(id);

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate not found.",
        },
        { status: 404 }
      );
    }

    const file = certificate.certificateFile;

    await Certificate.findByIdAndDelete(id);

    if (file?.publicId) {
      try {
        await deleteFromCloudinary(
          file.publicId,
          file.resourceType || "image"
        );
      } catch (cloudinaryError) {
        console.error(
          "Cloudinary certificate deletion failed:",
          cloudinaryError
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Certificate deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE certificate error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete certificate.",
      },
      { status: 500 }
    );
  }
}