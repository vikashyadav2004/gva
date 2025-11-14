import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Organization from "@/app/models/Organization";
import User, { UserRole } from "@/app/models/User"; 
import { verifyJwt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { organizationId, userId } = await req.json();

    if (!organizationId || !userId) {
      return NextResponse.json(
        { message: "organizationId and userId are required" },
        { status: 400 }
      );
    }

    // 🔐 Auth from headers
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    const session = token ? await verifyJwt(token) : null;

    if (!session || session.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 🔍 Validate organization
    const org = await Organization.findById(organizationId);
    if (!org) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // 🔍 Validate user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // ❗ A ORG_ADMIN must belong to the organization
    if (String(user.organizationId) !== String(organizationId)) {
      return NextResponse.json(
        { message: "User does not belong to this organization" },
        { status: 400 }
      );
    }

    // 🔥 Remove previous admin (if exists)
    if (org.adminUserId) {
      await User.findByIdAndUpdate(org.adminUserId, {
        role: UserRole.USER,
      });
    }

    // 🔥 Assign new admin
    user.role = UserRole.ORG_ADMIN;
    await user.save();

    // 🔥 Update organization record
    org.adminUserId = user._id;
    await org.save();

    return NextResponse.json(
      { message: "Organization admin assigned successfully", org },
      { status: 200 }
    );
  } catch (error) {
    console.error("ASSIGN ADMIN ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
