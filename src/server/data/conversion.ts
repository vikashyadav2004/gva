"use server";
import RightHolder  from '@/app/models/RightHolder';

import { connectDB } from "@/app/lib/db";
import Organization from "@/app/models/Organization";
import User from "@/app/models/User";
import mongoose from "mongoose";

// ✅ 1. Get Organization Name
export async function getOrgNameById(orgId: string): Promise<string | null> {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(orgId)) return null;

  const org = await Organization.findById(orgId).select("name");
  return org ? org.name : null;
}

// ✅ 2. Get User Name
export async function getUserNameById(userId: string): Promise<string | null> {
  await connectDB();

  if (!mongoose.Types.ObjectId.isValid(userId)) return null;

  const user = await User.findById(userId).select("name");
  return user ? user.name : null;
}
export async function getRightHolderNameById(id: string): Promise<string | null> {
  await connectDB();
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  const rh = await RightHolder.findById(id).select("name");
  return rh?.name ?? null;
}