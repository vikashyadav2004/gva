import { verifyJwt,cookieName, hashPassword } from "@/lib/auth";
import { connectDB } from '@/app/lib/db';
import { NextResponse } from "next/server"; 
import Organization from '@/app/models/Organization';
import User,{ UserRole } from '@/app/models/User'; 
import mongoose from "mongoose";

interface AssignBody {
  name: string;
  email: string;
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const orgId = params.id;
    const { name, email }: AssignBody = await req.json();

    const token = (req as any).cookies.get(cookieName)?.value;
    const session = token ? verifyJwt(token) : null;
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const organization = await Organization.findById(orgId);
    if (!organization) {
      return NextResponse.json({ message: "Organization not found" }, { status: 404 });
    }

    let admin = await User.findOne({ email });

    // Case 1: User exists → verify & assign
    if (admin) {
      if (admin.role !== UserRole.ORG_ADMIN) {
        return NextResponse.json({ message: "User exists but not Org Admin" }, { status: 400 });
      }

      admin.organizationId = new mongoose.Types.ObjectId(orgId);
      await admin.save();
    }
    else {
      // Case 2: New Org Admin → generate temp password
      const tempPassword = "Admin@123"; // you can randomize later
      const hashed = await hashPassword(tempPassword);

      admin = await User.create({
        name,
        email,
        password: hashed,
        role: UserRole.ORG_ADMIN,
        organizationId: orgId,
      });
    }

    // Save admin reference
    organization.adminUserId = admin._id;
    await organization.save();

    return NextResponse.json({
      message: "Admin assigned successfully",
      admin,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
