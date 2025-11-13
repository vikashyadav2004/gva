import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";
import RightHolder from "@/app/models/RightHolder";
import { verifyJwt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const form = await req.formData();

    const name = form.get("name") as string;
    const organizationId = form.get("organizationId") as string;
    const createdByUserIdfromfrontend = form.get("organizationId") as string;

    if (!name || !organizationId) {
      return NextResponse.json(
        { message: "Name and Organization ID required" },
        { status: 400 }
      );
    }

    // 🔐 Auth
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const session = token ? await verifyJwt(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // createdByUserId → from token
     const createdByUserId = session.role=== "SUPER_ADMIN"?createdByUserIdfromfrontend:session._id ;

    // 🔍 Prevent duplicate name inside the same organization
    const exists = await RightHolder.findOne({ name, organizationId });
    if (exists) {
      return NextResponse.json(
        { message: "RightHolder with this name already exists in this organization" },
        { status: 400 }
      );
    }

    const newRH = await RightHolder.create({
      name,
      organizationId,
      createdByUserId,
    });

    return NextResponse.json(
      { message: "RightHolder created", data: newRH },
      { status: 201 }
    );

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();

    const list = await RightHolder.find()
      .populate("organizationId", "name code")
      .populate("createdByUserId", "name email");

    return NextResponse.json({ rightholders: list }, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Error fetching rightholders" }, { status: 500 });
  }
}
