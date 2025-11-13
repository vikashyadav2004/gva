"use server";

import { connectDB } from "@/app/lib/db";
import User from "@/app/models/User";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

/**
 * ✅ Get all users (SUPER ADMIN)
 * ✅ OR users of their organization (ORG_ADMIN)
 */
export async function getUsers() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("gva_token")?.value;
  const session = token ? await verifyJwt(token) : null;

  if (!session) return [];

  // ✅ SUPER ADMIN → return all users
  if (session.role === "SUPER_ADMIN") {
    const users = await User.find() 
    return JSON.parse(JSON.stringify(users));
  }
 
  // ✅ Default (regular user or no role)
  return [];
}