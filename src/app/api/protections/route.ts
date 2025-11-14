import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";
import Protection from "@/app/models/Protection";
import { verifyJwt } from "@/lib/auth";
import Organization from "@/app/models/Organization";
import User from "@/app/models/User";
import fs from "fs";
import path from "path";

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

    // ⭐ Save image to /public/uploads/protections/
    const uploadsDir = path.join(process.cwd(), "public/uploads/protections");

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const fileExt = file.name.split(".").pop();
    const filename = `prot-${Date.now()}.${fileExt}`;
    const filepath = path.join(uploadsDir, filename);

    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filepath, buffer);

    const imageUrl = `/uploads/protections/${filename}`;

    // ⭐ AUTH
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    const session = token ? await verifyJwt(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const createdByUserId = session._id;

    // ⭐ SUPER_ADMIN WORKFLOW
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
        imageUrl,
      });

      return NextResponse.json({ message: "Protection created", data: prot });
    }

    // ⭐ ORG_ADMIN / USER WORKFLOW
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
      imageUrl,
    });

    return NextResponse.json({ message: "Protection created", data: prot });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
