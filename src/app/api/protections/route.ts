import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Protection from "@/app/models/Protection";

export async function POST(req: Request) {
  try {
    await connectDB();

    const form = await req.formData();

    const newData = await Protection.create({
      organizationId: form.get("organizationId"),
      createdByUserId: form.get("createdByUserId"),
      rightholderId: form.get("rightholderId"),
      protectionType: form.get("protectionType"),
      regReference: form.get("regReference"),
      designation: form.get("designation"),
      oePartNo: form.get("oePartNo"),
      title: form.get("title"),
      imagePath: form.get("imageUrl"),  // ⭐ ONLY URL STORED
       
    });

    return NextResponse.json(newData, { status: 201 });

  } catch (err) {
    console.log("CREATE ERROR:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
