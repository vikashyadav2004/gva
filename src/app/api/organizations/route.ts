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

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("id");

    if (!orgId) {
      return NextResponse.json(
        { message: "Organization ID is required" },
        { status: 400 }
      );
    }

    // 🔐 Token from headers
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const session = token ? await verifyJwt(token) : null;

    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    // 🔍 Check if org exists
    const org = await Organization.findById(orgId);

    if (!org) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // 🗑️ Delete it
    await Organization.findByIdAndDelete(orgId);

    return NextResponse.json(
      { message: "Organization deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log("DELETE ORG ERROR:", error);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}



export async function PUT(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("id");

    if (!orgId) {
      return NextResponse.json(
        { message: "Organization ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { name, code } = body;

    if (!name || !code) {
      return NextResponse.json(
        { message: "Name and Code are required" },
        { status: 400 }
      );
    }

    // 🔐 Read token from Authorization header
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const session = token ? await verifyJwt(token) : null;

    // ❗ Only SUPER_ADMIN can edit organization
    if (!session || session.role !== "SUPER_ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 🔍 Check if organization exists
    const org = await Organization.findById(orgId);
    if (!org) {
      return NextResponse.json(
        { message: "Organization not found" },
        { status: 404 }
      );
    }

    // ❗ Check unique code (if changed)
    if (org.code !== code) {
      const codeExists = await Organization.findOne({ code });
      if (codeExists) {
        return NextResponse.json(
          { message: "Organization code already exists" },
          { status: 400 }
        );
      }
    }

    // 📝 Update org
    org.name = name;
    org.code = code;

    await org.save();

    return NextResponse.json(
      { message: "Organization updated successfully", org },
      { status: 200 }
    );
  } catch (error) {
    console.log("UPDATE ORG ERROR:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
