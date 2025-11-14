"use server";

import { connectDB } from "@/app/lib/db";
import RightHolder from "@/app/models/RightHolder";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

/**
 * ✅ Get all RightHolders (SUPER ADMIN)
 * ❌ ORG_ADMIN not allowed (if you want, I can add)
 */
export async function getRightHolders() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("gva_token")?.value;
  const session = token ? await verifyJwt(token) : null;

  if (!session) return [];

  // ⭐ SUPER ADMIN can see ALL RightHolders
  if (session.role === "SUPER_ADMIN") {
    const rightHolders = await RightHolder.find() 
    return JSON.parse(JSON.stringify(rightHolders));
  }

  // ❌ Other roles: no access
  return [];
}
