import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User  from "@/app/models/User";
import {hashPassword} from "@/lib/auth";
import { UserRole } from "../../organizations/[id]/assign-admin/route";

export async function GET() {
  try {
    await connectDB();

    const exists = await User.findOne({ role: UserRole.SUPER_ADMIN });
    if (exists) {
      return NextResponse.json({ message: "Super admin already exists" });
    }

    const password = await hashPassword("Admin@123");

    await User.create({
      name: "System Super Admin",
      email: "super@gva.com",
      password,
      role: UserRole.SUPER_ADMIN,
      organizationId: null,
    });

    return NextResponse.json({
      message: "Super admin created ✅",
      loginDetails: {
        email: "super@gva.com",
        password: "Admin@123",
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error seeding super admin" }, { status: 500 });
  }
}
