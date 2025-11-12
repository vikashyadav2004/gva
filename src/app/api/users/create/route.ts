import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User, { UserRole } from "@/app/models/User";
import Organization from "@/app/models/Organization";
import { verifyJwt, cookieName, hashPassword } from "@/lib/auth";

interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  role?: UserRole; // default = USER
  organizationId?: string | null;
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const token = (req as any).cookies.get(cookieName)?.value;
    const session = token ? await verifyJwt(token) : null;

    if (!session || session.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, email, password, role = UserRole.USER, organizationId }: CreateUserBody =
      await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, Email & Password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // If user role is ORG_ADMIN or USER and organizationId exists, validate org
    if (organizationId) {
      const org = await Organization.findById(organizationId);
      if (!org) {
        return NextResponse.json(
          { message: "Organization not found" },
          { status: 404 }
        );
      }
    }

    const hashedPassword = await hashPassword(password);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      organizationId: organizationId || null,
      isActive: true,
    });

    return NextResponse.json({
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
      },
    });
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
