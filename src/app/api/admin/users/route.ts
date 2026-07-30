import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";

async function requireAdmin(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload?.sub) return null;
  await connectDB();
  const user = await User.findById(payload.sub).select("role").lean() as { role: string } | null;
  if (!user || user.role !== "admin") return null;
  return payload;
}

export async function GET(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;
  const search = searchParams.get("q") || "";
  const role = searchParams.get("role") || "";

  const query: Record<string, unknown> = {};
  if (search) query.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }];
  if (role) query.role = role;

  const [users, total] = await Promise.all([
    User.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
      .select("name email role verified suspended createdAt avatar").lean(),
    User.countDocuments(query),
  ]);

  return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
}

export async function PATCH(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id, action } = await req.json();
  if (!id || !action) return NextResponse.json({ error: "ID and action required" }, { status: 400 });

  const updates: Record<string, unknown> = {};
  if (action === "verify") updates.verified = true;
  else if (action === "unverify") updates.verified = false;
  else if (action === "suspend") updates.suspended = true;
  else if (action === "unsuspend") updates.suspended = false;
  else return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  await User.findByIdAndUpdate(id, updates);
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

  await User.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
