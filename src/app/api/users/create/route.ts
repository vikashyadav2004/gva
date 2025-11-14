import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import User, { UserRole } from "@/app/models/User";
import Organization from "@/app/models/Organization";
import { verifyJwt, cookieName, hashPassword } from "@/lib/auth";

/* ============================================================
   CREATE USER  (POST)
   ============================================================ */
export async function POST(req: Request) {
  try {
    await connectDB();

    const token = (req as any).cookies.get(cookieName)?.value;
    const session = token ? await verifyJwt(token) : null;

    if (!session || session.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, role = UserRole.USER, organizationId } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, Email & Password are required" },
        { status: 400 }
      );
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

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

    const newUser = await User.create({
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
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        organizationId: newUser.organizationId,
      },
    });
  } catch (err) {
    console.error("CREATE USER ERROR:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ============================================================
   UPDATE USER  (PUT)
   ============================================================ */
export async function PUT(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");
console.log(userId,"userId")
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const token = (req as any).cookies.get(cookieName)?.value;
    const session = token ? await verifyJwt(token) : null;

    if (!session || session.role !== UserRole.SUPER_ADMIN) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, role, organizationId } = body;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    // EMAIL CHECK — unique
    if (email && email !== user.email) {
      const exists = await User.findOne({ email });
      if (exists) {
        return NextResponse.json(
          { message: "Email already in use" },
          { status: 400 }
        );
      }
    }

    // Validate new organization
    if (organizationId) {
      const org = await Organization.findById(organizationId);
      if (!org) {
        return NextResponse.json(
          { message: "Organization not found" },
          { status: 404 }
        );
      }
    }

    // APPLY CHANGES
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;
    if (organizationId !== undefined) user.organizationId = organizationId;

    if (password) {
      user.password = await hashPassword(password);
    }

    await user.save();

    return NextResponse.json({
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.error("UPDATE USER ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ============================================================
   DELETE USER (DELETE)
   ============================================================ */
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const session = token ? await verifyJwt(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const del = await User.findByIdAndDelete(userId);

    if (!del) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE USER ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
