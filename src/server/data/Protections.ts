"use server";

import { connectDB } from "@/app/lib/db";
import Protection from "@/app/models/Protection";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

/**
 * ⭐ Get all protections (SUPER_ADMIN only)
 */
export async function getProtections() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("gva_token")?.value;
  const session = token ? await verifyJwt(token) : null;

  if (!session) return [];

  // ⭐ SUPER_ADMIN → return ALL protections
  if (session.role === "SUPER_ADMIN") {
    const protections = await Protection.find()
      .populate("organizationId", "name code")
      .populate("createdByUserId", "name email")
      .populate("rightholderId", "name");

    return JSON.parse(JSON.stringify(protections));
  }

  // ❌ Other roles cannot see protections (modify if needed)
  return [];
}
