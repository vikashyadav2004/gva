import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";
import RightHolder from "@/app/models/RightHolder";
import { verifyJwt } from "@/lib/auth";

/* ========================================================
    CREATE RIGHT HOLDER  (you already have this)
========================================================= */
export async function POST(req: Request) {
  try {
    await connectDB();

    const form = await req.formData();
    const name = form.get("name") as string;
    const organizationIdRaw = form.get("organizationId") as string | null;

    const organizationId =
      organizationIdRaw && organizationIdRaw !== "" ? organizationIdRaw : null;

    const authHeader = req.headers.get("authorization");
    const token = authHeader?.split(" ")[1] || null;
    const session = token ? await verifyJwt(token) : null;
    console.log(session, "session")
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    console.log(session._id, "session._id")
    const createdByUserId = session._id;
    const approved = session.role === "SUPER_ADMIN";
    console.log(createdByUserId, "createdByUserId")
    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    if (organizationId) {
      const exists = await RightHolder.findOne({ name, organizationId });
      if (exists) {
        return NextResponse.json(
          {
            message: "RightHolder with this name already exists in this organization",
          },
          { status: 400 }
        );
      }
    } 
    const newRH = await RightHolder.create({
      name,
      organizationId,
      createdByUserId:createdByUserId,
      approved,
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

/* ========================================================
    GET ALL RIGHHOLDERS
========================================================= */
export async function GET() {
  try {
    await connectDB();

    const list = await RightHolder.find()
      .populate("organizationId", "name code")
      .populate("createdByUserId", "name email");

    return NextResponse.json({ rightholders: list }, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching rightholders" },
      { status: 500 }
    );
  }
}

/* ========================================================
    UPDATE RIGHT HOLDER (PUT)
========================================================= */
export async function PUT(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "RightHolder ID required" }, { status: 400 });
    }

    const token = req.headers.get("authorization")?.replace("Bearer ", "") || null;
    const session = token ? await verifyJwt(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const name = form.get("name") as string;
    const organizationIdRaw = form.get("organizationId") as string | null;

    const organizationId =
      organizationIdRaw && organizationIdRaw !== "" ? organizationIdRaw : null;

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    // Prevent duplicates
    if (organizationId) {
      const exists = await RightHolder.findOne({
        _id: { $ne: id },
        name,
        organizationId,
      });

      if (exists) {
        return NextResponse.json(
          { message: "Same name exists in this organization" },
          { status: 400 }
        );
      }
    }

    const updatedRH = await RightHolder.findByIdAndUpdate(
      id,
      {
        name,
        organizationId,
      },
      { new: true }
    );

    if (!updatedRH) {
      return NextResponse.json(
        { message: "RightHolder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "RightHolder updated",
      data: updatedRH,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

/* ========================================================
    DELETE RIGHT HOLDER
========================================================= */
export async function DELETE(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "RightHolder ID required" }, { status: 400 });
    }

    const token = req.headers.get("authorization")?.replace("Bearer ", "") || null;
    const session = token ? await verifyJwt(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const deleted = await RightHolder.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json(
        { message: "RightHolder not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "RightHolder deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
