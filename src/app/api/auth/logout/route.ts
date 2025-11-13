import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Clear cookies by setting them expired
    const response = NextResponse.json(
      { msg: "Logged out successfully" },
      { status: 200 }
    );

    response.cookies.set("gva_token", "", {
      expires: new Date(0),
      path: "/",
    });

    response.cookies.set("gva_role", "", {
      expires: new Date(0),
      path: "/",
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}
