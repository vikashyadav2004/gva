"use server";

import { connectDB } from "@/app/lib/db";
import Protection from "@/app/models/Protection";
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

/**
 * ✅ Get all Protections (SUPER ADMIN)
 * ❌ ORG_ADMIN/USER not allowed (same behavior as RightHolder)
 */
export async function getProtections() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("gva_token")?.value;
  const session = token ? await verifyJwt(token) : null;

  if (!session) return [];

  // ⭐ SUPER ADMIN can see ALL protections
  if (session.role === "SUPER_ADMIN") {
    const protections = await Protection.find()
      .populate("rightHolderId", "name")
      .populate("organizationId", "name")
      .populate("assignedUserId", "name email")
      .populate("createdByUserId", "name email");

    return JSON.parse(JSON.stringify(protections));
  }

  // ❌ Other roles cannot fetch all protections
  return [];
}
