import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });
  if (token) return;

  const { pathname } = req.nextUrl;

  if (pathname === "/" || pathname === "/signin" || pathname === "/signup") return;
  if (pathname.startsWith("/api/auth/")) return;

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL("/signin", req.url);
  url.searchParams.set("callbackUrl", pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon\\.ico|icons|manifest\\.json|signin|signup$).*)"],
};
