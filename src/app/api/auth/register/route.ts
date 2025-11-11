import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/db";    
import User from "@/app/models/User";  

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ error: "All fields required" }, { status: 400 });

    const userExists = await User.findOne({ email });
    if (userExists)
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });

    const hash = await bcrypt.hash(password, 10);

    await User.create({ name, email, password: hash });

    return NextResponse.json({ message: "User registered successfully" });
  } catch (err) {
    console.log(err);
    
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
