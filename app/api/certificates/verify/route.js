import { NextResponse } from "next/server";

import connectToDatabase from "@/lib/db";
import Certificate from "@/models/Certificate";
import "@/models/Student";
import "@/models/Course";

export async function GET(request) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);

    const certificateNumber =
      searchParams.get("certificateNumber")?.trim();

    if (!certificateNumber) {
      return NextResponse.json(
        {
          success: false,
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

    /*
     * Do not expose private student information publicly.
     */

    const student = certificate.student;
    const course = student?.course;

    return NextResponse.json({
      success: true,
      verified: certificate.status === "VALID",

      data: {
        certificateNumber:
          certificate.certificateNumber,

        status: certificate.status,

        issuedOn: certificate.createdAt,

        student: {
          name: student?.fullName || "",
        },

        course: {
          title: course?.title || "",
          shortTitle: course?.shortTitle || "",
        },

        certificateFile: certificate.certificateFile
          ? {
              url: certificate.certificateFile.url || "",
              originalName:
                certificate.certificateFile.originalName ||
                "",
            }
          : null,
      },

      message:
        certificate.status === "VALID"
          ? "Certificate is valid."
          : `Certificate is ${certificate.status.toLowerCase()}.`,
    });
  } catch (error) {
    console.error(
      "GET /api/certificates/verify:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Certificate verification failed.",
      },
      { status: 500 }
    );
  }
}