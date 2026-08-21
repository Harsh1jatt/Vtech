import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function requireAdmin() {
  const authUser = await getCurrentUser();

  if (!authUser) {
    const error = new Error("UNAUTHORIZED");
    error.status = 401;
    throw error;
  }

  await connectToDatabase();

  const user = await User.findById(authUser.userId)
    .select("_id name email role isActive");

  if (!user || !user.isActive) {
    const error = new Error("UNAUTHORIZED");
    error.status = 401;
    throw error;
  }

  if (user.role !== "admin") {
    const error = new Error("FORBIDDEN");
    error.status = 403;
    throw error;
  }

  return user;
}