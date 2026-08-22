import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";

import Certificate from "@/models/Certificate";
import Student from "@/models/Student";

import "@/models/Course";

/* =========================================================
   GET /api/certificates/[id]
========================================================= */

export async function GET(request, { params }) {
  try {
    await requireAdmin();
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
    console.error(
      "GET /api/certificates/[id]:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to fetch certificate.",
      },
      {
        status: error?.status || 500,
      }
    );
  }
}

/* =========================================================
   PUT /api/certificates/[id]
========================================================= */

export async function PUT(request, { params }) {
  let uploadedNewFile = null;

  try {
    await requireAdmin();
    await connectToDatabase();

    const { id } = await params;

    /* -----------------------------------------------------
       Validate certificate ID
    ----------------------------------------------------- */

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid certificate ID.",
        },
        { status: 400 }
      );
    }

    /* -----------------------------------------------------
       Find existing certificate
    ----------------------------------------------------- */

    const existingCertificate =
      await Certificate.findById(id);

    if (!existingCertificate) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate not found.",
        },
        { status: 404 }
      );
    }

    /* -----------------------------------------------------
       Read FormData
    ----------------------------------------------------- */

    const formData = await request.formData();

    const certificateNumberInput =
      formData.get("certificateNumber");

    const studentIdInput =
      formData.get("studentId");

    const statusInput =
      formData.get("status");

    const file =
      formData.get("certificateFile");

    /* -----------------------------------------------------
       Certificate number
    ----------------------------------------------------- */

    const certificateNumber =
      certificateNumberInput
        ?.toString()
        .trim();

    if (!certificateNumber) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Certificate number is required.",
        },
        { status: 400 }
      );
    }

    /* -----------------------------------------------------
       Student ID
    ----------------------------------------------------- */

    const studentId =
      studentIdInput?.toString().trim();

    if (!studentId) {
      return NextResponse.json(
        {
          success: false,
          message: "Student is required.",
        },
        { status: 400 }
      );
    }

    if (
      !mongoose.Types.ObjectId.isValid(
        studentId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid student ID.",
        },
        { status: 400 }
      );
    }

    /* -----------------------------------------------------
       Check student exists
    ----------------------------------------------------- */

    const student =
      await Student.findById(studentId)
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

    /* -----------------------------------------------------
       Duplicate certificate number
       Ignore current certificate
    ----------------------------------------------------- */

    const duplicateCertificate =
      await Certificate.findOne({
        certificateNumber,
        _id: {
          $ne: id,
        },
      });

    if (duplicateCertificate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Certificate number already exists.",
        },
        { status: 409 }
      );
    }

    /* -----------------------------------------------------
       Status

       If frontend does not send status, preserve
       the existing status.
    ----------------------------------------------------- */

    const allowedStatuses = [
      "VALID",
      "REVOKED",
      "EXPIRED",
    ];

    const status =
      statusInput?.toString().trim() ||
      existingCertificate.status ||
      "VALID";

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid certificate status.",
        },
        { status: 400 }
      );
    }

    /* -----------------------------------------------------
       Prepare update
    ----------------------------------------------------- */

    const updateData = {
      certificateNumber,
      student: student._id,
      status,
    };

    /* -----------------------------------------------------
       Check for new file
    ----------------------------------------------------- */

    const hasNewFile =
      file &&
      typeof file !== "string" &&
      typeof file.arrayBuffer ===
        "function";

    if (hasNewFile) {
      /* ---------------------------------------------------
         File size
      --------------------------------------------------- */

      const maxFileSize =
        5 * 1024 * 1024;

      if (file.size > maxFileSize) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Certificate file must be smaller than 5 MB.",
          },
          { status: 400 }
        );
      }

      /* ---------------------------------------------------
         Allowed file types
      --------------------------------------------------- */

      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
      ];

      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Only PDF, JPG and PNG certificates are allowed.",
          },
          { status: 400 }
        );
      }

      /* ---------------------------------------------------
         Convert File -> Buffer
      --------------------------------------------------- */

      const buffer = Buffer.from(
        await file.arrayBuffer()
      );

      const resourceType =
        file.type ===
        "application/pdf"
          ? "raw"
          : "image";

      /* ---------------------------------------------------
         Upload new file to Cloudinary
      --------------------------------------------------- */

      const {
        uploadToCloudinary,
      } = await import(
        "@/lib/cloudinary"
      );

      uploadedNewFile =
        await uploadToCloudinary(
          buffer,
          {
            folder:
              "vtech/certificates",
            resourceType,
            originalName:
              file.name,
          }
        );

      /* ---------------------------------------------------
         Replace certificate file data
      --------------------------------------------------- */

      updateData.certificateFile = {
        url: uploadedNewFile.url,
        publicId:
          uploadedNewFile.publicId,
        originalName:
          file.name,
        format:
          uploadedNewFile.format,
        resourceType:
          uploadedNewFile.resourceType,
      };
    }

    /* -----------------------------------------------------
       Update MongoDB
    ----------------------------------------------------- */

    let updatedCertificate;

    try {
      updatedCertificate =
        await Certificate.findByIdAndUpdate(
          id,
          {
            $set: updateData,
          },
          {
            new: true,
            runValidators: true,
          }
        );

      if (!updatedCertificate) {
        throw new Error(
          "Certificate not found during update."
        );
      }
    } catch (databaseError) {
      /* ---------------------------------------------------
         MongoDB failed after new Cloudinary upload.
         Delete the new file.
      --------------------------------------------------- */

      if (
        uploadedNewFile?.publicId
      ) {
        try {
          const {
            deleteFromCloudinary,
          } = await import(
            "@/lib/cloudinary"
          );

          await deleteFromCloudinary(
            uploadedNewFile.publicId,
            uploadedNewFile.resourceType
          );
        } catch (cleanupError) {
          console.error(
            "New Cloudinary file cleanup failed:",
            cleanupError
          );
        }
      }

      throw databaseError;
    }

    /* -----------------------------------------------------
       Delete OLD Cloudinary file

       Only after MongoDB successfully references
       the new file.
    ----------------------------------------------------- */

    if (
      hasNewFile &&
      existingCertificate
        .certificateFile
        ?.publicId
    ) {
      try {
        const {
          deleteFromCloudinary,
        } = await import(
          "@/lib/cloudinary"
        );

        await deleteFromCloudinary(
          existingCertificate
            .certificateFile.publicId,
          existingCertificate
            .certificateFile.resourceType
        );
      } catch (cloudinaryError) {
        console.error(
          "Old Cloudinary certificate deletion failed:",
          cloudinaryError
        );
      }
    }

    /* -----------------------------------------------------
       Populate updated certificate
    ----------------------------------------------------- */

    const populatedCertificate =
      await Certificate.findById(id)
        .populate({
          path: "student",
          populate: {
            path: "course",
          },
        })
        .lean();

    /* -----------------------------------------------------
       Success
    ----------------------------------------------------- */

    return NextResponse.json({
      success: true,
      message:
        "Certificate updated successfully.",
      data: populatedCertificate,
    });
  } catch (error) {
    console.error(
      "PUT /api/certificates/[id]:",
      error
    );

    /* -----------------------------------------------------
       Duplicate key
    ----------------------------------------------------- */

    if (error?.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Certificate number already exists.",
        },
        { status: 409 }
      );
    }

    /* -----------------------------------------------------
       Authentication / authorization
    ----------------------------------------------------- */

    if (
      error?.status === 401 ||
      error?.status === 403
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            error.status === 401
              ? "Authentication required."
              : "You are not authorized to update this certificate.",
        },
        {
          status: error.status,
        }
      );
    }

    /* -----------------------------------------------------
       Generic error
    ----------------------------------------------------- */

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to update certificate.",
      },
      { status: 500 }
    );
  }
}
/* =========================================================
   DELETE /api/certificates/[id]
========================================================= */

export async function DELETE(request, { params }) {
  try {
    await requireAdmin();
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

    const certificate = await Certificate.findById(id).lean();

    if (!certificate) {
      return NextResponse.json(
        {
          success: false,
          message: "Certificate not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Delete MongoDB record first.
     * This prevents the database from keeping a certificate
     * whose Cloudinary file has already been deleted.
     */
    await Certificate.findByIdAndDelete(id);

    /*
     * Delete Cloudinary file after MongoDB deletion.
     * If Cloudinary deletion fails, the database record is
     * already gone, so we only log the cleanup failure.
     */
    if (certificate.certificateFile?.publicId) {
      try {
        const {
          deleteFromCloudinary,
        } = await import("@/lib/cloudinary");

        await deleteFromCloudinary(
          certificate.certificateFile.publicId,
          certificate.certificateFile.resourceType
        );
      } catch (cloudinaryError) {
        console.error(
          "Certificate Cloudinary deletion failed:",
          cloudinaryError
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Certificate deleted successfully.",
    });
  } catch (error) {
    console.error(
      "DELETE /api/certificates/[id]:",
      error
    );

    if (error?.status === 401 || error?.status === 403) {
      return NextResponse.json(
        {
          success: false,
          message:
            error.status === 401
              ? "Authentication required."
              : "You are not authorized to delete this certificate.",
        },
        {
          status: error.status,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message ||
          "Failed to delete certificate.",
      },
      {
        status: 500,
      }
    );
  }
}