import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/jwt";
import { seedAdmin } from "@/lib/seedAdmin";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    await seedAdmin();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");
    if (!user) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password || "");
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    if (user.suspended) {
      return NextResponse.json({ error: "This account has been suspended. Please contact support." }, { status: 403 });
    }

    const safeUser = {
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      verified: user.verified,
      avatar: user.avatar,
    };

    const token = await signToken(safeUser._id);

    return NextResponse.json({ user: safeUser, token });
  } catch (error) {
    console.error("[POST /api/auth/login]", error);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
