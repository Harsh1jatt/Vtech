import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/db";
import Certificate from "@/models/Certificate";
import "@/models/Student";
import "@/models/Course";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const certificateNumber = searchParams
      .get("certificateNumber")
      ?.trim()
      .toUpperCase();

    if (!certificateNumber) {
      return NextResponse.json(
        {
          success: false,
          verified: false,
          message: "Certificate number is required.",
        },
        { status: 400 }
      );
    }

    const certificate = await Certificate.findOne({
      certificateNumber,
    })
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
          success: true,
          verified: false,
          message: "Certificate not found.",
        },
        { status: 200 }
      );
    }

    const student = certificate.student;

    const isValid =
      certificate.status === "VALID";

    return NextResponse.json({
      success: true,
      verified: isValid,

      data: {
        certificateNumber: certificate.certificateNumber,

        status: certificate.status,

        student: {
          fullName: student?.fullName || "",
          rollNumber: student?.rollNumber || "",
        },

        course: student?.course || null,

        issuedAt: certificate.createdAt,

        certificateFile: {
          url: certificate.certificateFile?.url || "",
        },
      },

      message: isValid
        ? "Certificate is valid and verified."
        : `Certificate is ${certificate.status.toLowerCase()}.`,
    });
  } catch (error) {
    console.error("Certificate verification error:", error);

    return NextResponse.json(
      {
        success: false,
        verified: false,
        message: "Unable to verify certificate.",
      },
      { status: 500 }
    );
  }
}