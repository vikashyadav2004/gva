import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";
import RightHolder from "@/app/models/RightHolder";
import { verifyJwt } from "@/lib/auth";

interface Params {
  params: { id: string };
}

export async function GET(req: Request, { params }: Params) {
  try {
    await connectDB();

    const rh = await RightHolder.findById(params.id)
      .populate("organizationId", "name code")
      .populate("createdByUserId", "name email");

    if (!rh) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ rightholder: rh }, { status: 200 });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();

    const form = await req.formData();
    const name = form.get("name") as string;
    const organizationId = form.get("organizationId") as string;

    // Validate
    if (!name || !organizationId) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    // Auth
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;
    const session = token ? await verifyJwt(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updated = await RightHolder.findByIdAndUpdate(
      params.id,
      { name, organizationId },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Updated", data: updated });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: Params) {
  try {
    await connectDB();

    const deleted = await RightHolder.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json({ message: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });

  } catch (err) {
    console.log(err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
