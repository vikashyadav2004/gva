import { connectDB } from '@/app/lib/db';
import { NextResponse } from "next/server"; 
import User from '@/app/models/User';
import { comparePassword, signJwt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ msg: "Email and password required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json({ msg: "Invalid credentials" }, { status: 401 });
    }

    const valid = await comparePassword(password, user.password);
    if (!valid) {
      return NextResponse.json({ msg: "Invalid credentials" }, { status: 401 });
    }

    // ✅ JWT token returned to frontend
    const token = await signJwt({
      _id: user._id.toString(),
      role: user.role,
      organizationId: user.organizationId ? user.organizationId.toString() : null,
    });

    return NextResponse.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}
