import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";
import Protection from "@/app/models/Protection";
import { verifyJwt } from "@/lib/auth";
import Organization from "@/app/models/Organization";
import User from "@/app/models/User"; 

export async function POST(req: Request) {
  try {
    await connectDB();

    const form = await req.formData();

    const rightHolderId = form.get("rightHolderId") as string;
    const type = form.get("type") as string;
    const title = form.get("title") as string;
    const file = form.get("image") as File;

    const organizationIdRaw = form.get("organizationId") as string | null;
    const assignedUserIdRaw = form.get("assignedUserId") as string | null;

    if (!rightHolderId || !type || !title || !file) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // ⭐ Convert image to Base64 (NO FILESYSTEM)
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Image = `data:${file.type};base64,${buffer.toString("base64")}`;

    // ⭐ AUTH
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const session = token ? await verifyJwt(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const createdByUserId = session._id;

    // ⭐ SUPER ADMIN WORKFLOW
    if (session.role === "SUPER_ADMIN") {
      const organizationId = organizationIdRaw || null;
      const assignedUserId = assignedUserIdRaw || null;

      if (!organizationId || !assignedUserId) {
        return NextResponse.json(
          { message: "SUPER_ADMIN must assign organization & user" },
          { status: 400 }
        );
      }

      const org = await Organization.findById(organizationId);
      if (!org) return NextResponse.json({ message: "Org not found" }, { status: 404 });

      const user = await User.findOne({ _id: assignedUserId, organizationId });
      if (!user)
        return NextResponse.json(
          { message: "Assigned user does not belong to this organization" },
          { status: 400 }
        );

      const prot = await Protection.create({
        rightHolderId,
        type,
        title,
        organizationId,
        createdByUserId,
        assignedUserId,
        imageUrl: base64Image, // ⭐ STORED BASE64
      });

      return NextResponse.json({ message: "Protection created", data: prot });
    }

    // ⭐ ORG_ADMIN / USER workflow
    const organizationId = session.organizationId;

    if (!organizationId) {
      return NextResponse.json(
        { message: "Only organization users can create protections" },
        { status: 400 }
      );
    }

    const prot = await Protection.create({
      rightHolderId,
      type,
      title,
      organizationId,
      createdByUserId,
      assignedUserId: createdByUserId,
      imageUrl: base64Image,
    });

    return NextResponse.json({ message: "Protection created", data: prot });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

//   delete protaction 

export async function DELETE(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Protection ID required" }, { status: 400 });
    }

    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const session = token ? await verifyJwt(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await Protection.findByIdAndDelete(id);

    return NextResponse.json({ message: "Protection deleted" });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}


// update protaction 

export async function PUT(req: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ message: "Protection ID required" }, { status: 400 });
    }

    // Read FormData (supports image)
    const form = await req.formData();

    const type = form.get("type") as string | null;
    const title = form.get("title") as string | null;
    const rightHolderId = form.get("rightHolderId") as string | null;
    const organizationIdRaw = form.get("organizationId") as string | null;
    const assignedUserIdRaw = form.get("assignedUserId") as string | null;

    const file = form.get("image") as File | null;

    // AUTH
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const session = token ? await verifyJwt(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const updateData: any = {};

    if (type) updateData.type = type;
    if (title) updateData.title = title;
    if (rightHolderId) updateData.rightHolderId = rightHolderId;

    // SUPER ADMIN CAN MOVE PROTECTION
    if (session.role === "SUPER_ADMIN") {
      if (organizationIdRaw) updateData.organizationId = organizationIdRaw;
      if (assignedUserIdRaw) updateData.assignedUserId = assignedUserIdRaw;
    }

    // Handling image update
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = `data:${file.type};base64,${buffer.toString("base64")}`;
      updateData.imageUrl = base64;
    }

    const updated = await Protection.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json({ message: "Protection updated", data: updated });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
