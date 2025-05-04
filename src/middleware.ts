import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    const userRole = token.role;

    if (userRole === "admin") {
      if (pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    } else {
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: () => {
        return true;
      }
    }
  }
);

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"]
};
