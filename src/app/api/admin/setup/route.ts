import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

/**
 * One-time superadmin creation.
 *
 * Requires the ADMIN_SETUP_SECRET env var to be set on the server and sent
 * in the request body. Without it the route is disabled entirely, so there
 * is no way to create an admin account from the public internet.
 */
export async function POST(req: NextRequest) {
  try {
    const secret = process.env.ADMIN_SETUP_SECRET;
    if (!secret) {
      return NextResponse.json({ error: "Admin setup is disabled on this server" }, { status: 403 });
    }

    const { name, email, password, setupSecret } = await req.json();

    if (setupSecret !== secret) {
      return NextResponse.json({ error: "Invalid setup secret" }, { status: 401 });
    }

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Admin password must be at least 8 characters" }, { status: 400 });
    }

    await connectDB();

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });

    // If the account already exists, promote it to admin instead of failing —
    // this makes the route safe to re-run and handles a forgotten password flow.
    if (existing) {
      existing.role = "admin";
      existing.verified = true;
      existing.suspended = false;
      existing.password = await bcrypt.hash(password, 12);
      await existing.save();
      return NextResponse.json({
        success: true,
        promoted: true,
        message: `Existing account ${normalizedEmail} promoted to admin and password reset.`,
      });
    }

    const admin = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: await bcrypt.hash(password, 12),
      role: "admin",
      verified: true,
    });

    return NextResponse.json({
      success: true,
      created: true,
      message: `Admin account created for ${admin.email}. Log in at /auth/login.`,
    }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/admin/setup]", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
