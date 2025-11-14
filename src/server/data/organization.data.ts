"use server";

import { connectDB } from "@/app/lib/db";
import Organization from "@/app/models/Organization"; 
import { cookies } from "next/headers";
import { verifyJwt } from "@/lib/auth";

// ✅ Get all organizations (SUPER ADMIN) OR single org (ORG ADMIN)
export async function getOrganizations() {
  await connectDB();

  const cookieStore = await cookies();
  const token = cookieStore.get("gva_token")?.value;
  const session = token ? await verifyJwt(token) : null;

  if (!session) return [];

  // ✅ SUPER ADMIN → return all orgs
  if (session.role === "SUPER_ADMIN") {
   const orgs = await Organization.find().sort({ createdAt: -1 });

    return JSON.parse(JSON.stringify(orgs));
  }

  // ✅ ORG_ADMIN → return his org only
  // if (session.role === "ORG_ADMIN" && session.organizationId) {
  //   const org = await Organization.find({ _id: session.organizationId })
  //     .populate("adminUserId", "name email role");
  //   return JSON.parse(JSON.stringify(org));
  // }

  return [];
}
