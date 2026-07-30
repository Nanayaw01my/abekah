import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import { verifyToken } from "@/lib/jwt";
import User from "@/models/User";

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

  const query = search ? { title: { $regex: search, $options: "i" } } : {};
  const [properties, total] = await Promise.all([
    Property.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit)
      .populate("landlord", "name email").lean(),
    Property.countDocuments(query),
  ]);

  return NextResponse.json({ properties, total, page, pages: Math.ceil(total / limit) });
}

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "Property ID required" }, { status: 400 });

  await Property.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
