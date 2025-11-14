import { connectDB } from "@/app/lib/db";
import { NextResponse } from "next/server";
import RightHolder from "@/app/models/RightHolder";
import { verifyJwt } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const form = await req.formData();

    const name = form.get("name") as string;
    const organizationIdRaw = form.get("organizationId") as string | null;
    const organizationId =
      organizationIdRaw && organizationIdRaw !== "" ? organizationIdRaw : null;

    // 🔐 Auth
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    const session = token ? await verifyJwt(token) : null;

    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // ⭐ ALWAYS TAKE createdByUserId FROM TOKEN ONLY
    const createdByUserId = session._id;

    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    // ⭐ SUPER_ADMIN overrides -> approved = true
    const approved = session.role === "SUPER_ADMIN";

    // ⭐ If organizationId exists → validate no duplicate name in same org
    if (organizationId) {
      const exists = await RightHolder.findOne({ name, organizationId });
      if (exists) {
        return NextResponse.json(
          {
            message:
              "RightHolder with this name already exists in this organization",
          },
          { status: 400 }
        );
      }
    }

    const newRH = await RightHolder.create({
      name,
      organizationId,
      createdByUserId,
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
