import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

// Same secret you used in /api/login
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "tracklicant_dev_secret"
);

// Define routes that should NOT be protected
const publicRoutes = ["/login", "/api/login"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public routes without token
  if (publicRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    await jwtVerify(token, SECRET_KEY);
    return NextResponse.next(); // token is valid, let them through
  } catch (err) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - login page
     * - API routes that don’t need auth
     * - static files (favicon, etc.)
     */
    "/((?!login|api/login|_next|favicon.ico).*)",
  ],
};
