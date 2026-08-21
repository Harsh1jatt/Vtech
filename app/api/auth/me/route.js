import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const authUser = await getCurrentUser();

    if (!authUser) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          message: "Not authenticated.",
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const user = await User.findById(authUser.userId).select("-password");

    if (!user || !user.isActive) {
      return NextResponse.json(
        {
          success: false,
          authenticated: false,
          message: "User not found or inactive.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
}