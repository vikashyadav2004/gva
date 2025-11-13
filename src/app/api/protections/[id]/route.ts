import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Protection from "@/app/models/Protection";

interface Params {
  params: { id: string };
}

export async function PUT(req: Request, { params }: Params) {
  try {
    await connectDB();

    const form = await req.formData();

    const updateData: any = {
      protectionType: form.get("protectionType"),
      regReference: form.get("regReference"),
      designation: form.get("designation"),
      oePartNo: form.get("oePartNo"),
      rightholderId: form.get("rightholderId"),
    };

    // ⭐ Update URL only IF provided
    if (form.get("imageUrl")) {
      updateData.imagePath = form.get("imageUrl");
    }

    const updated = await Protection.findByIdAndUpdate(params.id, updateData, {
      new: true,
    });

    if (!updated)
      return NextResponse.json({ message: "Not Found" }, { status: 404 });

    return NextResponse.json(updated);

  } catch (err) {
    console.log("UPDATE ERROR:", err);
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
}
