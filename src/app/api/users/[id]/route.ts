import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User, { UserRole } from "@/app/models/User";
import Organization from "@/app/models/Organization";
import { verifyJwt, cookieName, hashPassword } from "@/lib/auth";

interface UpdateUserBody {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  organizationId?: string | null;
  isActive?: boolean;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const userId = params.id;

    const token = (req as any).cookies.get(cookieName)?.value;
    const session = token ? await verifyJwt(token) : null;

    if (!session || session.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updates: UpdateUserBody = await req.json();

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // Validate email uniqueness
    if (updates.email && updates.email !== user.email) {
      const existing = await User.findOne({ email: updates.email });
      if (existing) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Validate organizationId
    if (updates.organizationId) {
      const org = await Organization.findById(updates.organizationId);
      if (!org) {
        return NextResponse.json(
          { message: "Organization not found" },
          { status: 404 }
        );
      }
    }

    // Hash password if updated
    if (updates.password) {
      updates.password = await hashPassword(updates.password);
    }

    // Apply updates
    Object.assign(user, updates);
    await user.save();

    return NextResponse.json({
      message: "User updated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organizationId: user.organizationId,
        isActive: user.isActive,
      },
    });
  } catch (err) {
    console.error("UPDATE USER ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
