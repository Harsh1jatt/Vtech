export function proxy() {
  // Protect admin routes once authentication is implemented.
}

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
};