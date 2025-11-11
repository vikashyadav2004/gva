import { verifyJwt, cookieName, hashPassword } from "@/lib/auth";
import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";
import Organization from "@/app/models/Organization";
import User, { UserRole } from "@/app/models/User";
import mongoose from "mongoose";

interface AssignBody {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const orgId = params.id;
    const { name, email, password }: AssignBody = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: "Name, Email & Password required" }, { status: 400 });
    }

    // ✅ Verify SUPER ADMIN
    const token = (req as any).cookies.get(cookieName)?.value;
    const session = token ? await verifyJwt(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Validate Organization Exists
    const organization = await Organization.findById(orgId);
    if (!organization) {
      return NextResponse.json({ message: "Organization not found" }, { status: 404 });
    }

    // ✅ Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists but must be ORG_ADMIN
      if (user.role !== UserRole.ORG_ADMIN) {
        return NextResponse.json(
          { message: "User exists but is not an Organization Admin" },
          { status: 400 }
        );
      }

      // Update org assignment
      user.organizationId = new mongoose.Types.ObjectId(orgId);
      await user.save();
    } else {
      // ✅ Create new ORG_ADMIN
      const hashedPassword = await hashPassword(password);

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        role: UserRole.ORG_ADMIN,
        organizationId: orgId,
        isActive: true,
      });
    }

    // ✅ Assign admin to organization
    organization.adminUserId = user._id;
    await organization.save();

    return NextResponse.json({
      message: "Admin assigned successfully",
      admin: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error) {
    console.log("ASSIGN ADMIN ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
