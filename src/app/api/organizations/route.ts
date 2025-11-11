import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";
import Organization from "@/app/models/Organization";
import { verifyJwt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, code } = body;

    if (!name || !code) {
      return NextResponse.json({ message: "Name and Code required" }, { status: 400 });
    }

    // ✅ Get token from Authorization header (client cookie -> header)
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const session = token ? await verifyJwt(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ✅ Check unique code
    const exists = await Organization.findOne({ code });
    if (exists) {
      return NextResponse.json({ message: "Organization code already exists" }, { status: 400 });
    }

    const org = await Organization.create({ name, code });

    return NextResponse.json({ message: "Organization created", org });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// ✅ GET: organizations list
export async function GET() {
  try {
    await connectDB();
    const orgs = await Organization.find().populate("adminUserId", "name email");
    return NextResponse.json({ orgs });
  } catch (error) {
    console.log(error);
    
    return NextResponse.json({ message: "Error fetching orgs" }, { status: 500 });
  }
}
