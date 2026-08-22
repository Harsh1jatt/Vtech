import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const isLoginPage = pathname === "/admin/login";
  const isRegisterPage = pathname === "/admin/register";

  const token = request.cookies.get("vtech_token")?.value;
  const user = token ? verifyToken(token) : null;

  /*
   * No valid authentication
   */
  if (!user) {
    if (isLoginPage || isRegisterPage) {
      return NextResponse.next();
    }

    const loginUrl = new URL("/admin/login", request.url);

    const response = NextResponse.redirect(loginUrl);

    /*
     * Remove invalid/expired/tampered cookie.
     */
    response.cookies.delete("vtech_token");

    return response;
  }

  /*
   * Valid token but user is already authenticated.
   */
  if (isLoginPage || isRegisterPage) {
    return NextResponse.redirect(
      new URL("/admin/dashboard", request.url)
    );
  }

  /*
   * Token itself is valid.
   * The protected server layout will additionally verify
   * the admin account and isActive status from MongoDB.
   */
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};