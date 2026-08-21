import { NextResponse } from "next/server";
import mongoose from "mongoose";

import connectToDatabase from "@/lib/db";
import Certificate from "@/models/Certificate";

export async function PATCH(request, { params }) {
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

    const body = await request.json();

    const status = body.status;

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
      });

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
      message: `Certificate ${status.toLowerCase()} successfully.`,
      data: certificate,
    });
  } catch (error) {
    console.error("PATCH certificate status error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update certificate status.",
      },
      { status: 500 }
    );
  }
}