
// import { NextResponse } from "next/server";
// // import { verifyJwt, cookieName, AuthPayload } from "@/lib/auth";
// import { verifyJwt, cookieName, AuthPayload } from "./app/lib/auth";

// export function middleware(req: Request) {
//   const url = req.url;
//   const cookie = (req as any).cookies.get(cookieName)?.value;

//   if (!cookie) {
//     if (url.includes("/admin")) {
//       return NextResponse.redirect(new URL("/auth/login", url));
//     }
//     return NextResponse.next();
//   }

//   const session = verifyJwt(cookie) as AuthPayload | null;

//   if (!session) {
//     return NextResponse.redirect(new URL("/auth/login", url));
//   }

//   // ROLE CHECK
//   if (url.includes("/admin") && session.role !== "SUPER_ADMIN") {
//     return NextResponse.redirect(new URL("/auth/login", url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"],
// };
import { NextResponse } from "next/server";

export function middleware(req:any) {
  const { pathname } = req.nextUrl;

  const token = req.cookies.get("gva_token")?.value;
  const role = req.cookies.get("gva_role")?.value;

  // Public pages allowed
  if (pathname.startsWith("/signin") || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // If no login cookie → redirect to signin
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // If logged in but try to go back to signin → redirect to proper dashboard
  if (pathname === "/signin") {
    if (role === "SUPER_ADMIN") return NextResponse.redirect(new URL("/admin", req.url));
    if (role === "ORG_ADMIN") return NextResponse.redirect(new URL("/org", req.url));
    return NextResponse.redirect(new URL("/user", req.url));
  }

  return NextResponse.next();
}

// ✅ Run middleware on all pages except static and API
export const config = {
  matcher: [
    "/((?!_next|favicon.ico|api|images).*)",
  ],
};
