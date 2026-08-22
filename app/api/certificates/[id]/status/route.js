import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import { requireAdmin } from "@/lib/adminAuth";
import Certificate from "@/models/Certificate";

const ALLOWED_STATUSES = [
  "VALID",
  "REVOKED",
  "EXPIRED",
];

export async function PATCH(request, { params }) {
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

    const body = await request.json();

    const status = body.status?.toString().trim().toUpperCase();

    if (!ALLOWED_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid status. Allowed values are VALID, REVOKED and EXPIRED.",
        },
        { status: 400 }
      );
    }

    const certificate = await Certificate.findByIdAndUpdate(
      id,
      {
        $set: {
          status,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
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
      message: `Certificate status changed to ${status}.`,
      data: certificate,
    });
  } catch (error) {
    console.error(
      "PATCH /api/certificates/[id]/status:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error?.message || "Failed to update certificate status.",
      },
      { status: error?.status || 500 }
    );
  }
}