import { NextResponse } from "next/server";
import { cookieName } from "@/lib/auth";
export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set(cookieName, "", { path: "/", maxAge: 0 });

  return response;
}
