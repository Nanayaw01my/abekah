import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Property from "@/models/Property";
import Booking from "@/models/Booking";
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

export async function DELETE(req: NextRequest) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { scope, confirm } = await req.json();
  if (confirm !== "RESET") return NextResponse.json({ error: "Confirmation required" }, { status: 400 });

  await connectDB();

  if (scope === "properties") {
    const result = await Property.deleteMany({});
    return NextResponse.json({ success: true, deleted: result.deletedCount, scope: "properties" });
  }

  if (scope === "bookings") {
    const result = await Booking.deleteMany({});
    return NextResponse.json({ success: true, deleted: result.deletedCount, scope: "bookings" });
  }

  if (scope === "tenants") {
    const result = await User.deleteMany({ role: "tenant" });
    return NextResponse.json({ success: true, deleted: result.deletedCount, scope: "tenants" });
  }

  if (scope === "landlords") {
    const result = await User.deleteMany({ role: "landlord" });
    await Property.deleteMany({});
    return NextResponse.json({ success: true, deleted: result.deletedCount, scope: "landlords" });
  }

  if (scope === "all") {
    const [p, b, u] = await Promise.all([
      Property.deleteMany({}),
      Booking.deleteMany({}),
      User.deleteMany({ role: { $ne: "admin" } }),
    ]);
    return NextResponse.json({ success: true, deleted: { properties: p.deletedCount, bookings: b.deletedCount, users: u.deletedCount }, scope: "all" });
  }

  return NextResponse.json({ error: "Invalid scope" }, { status: 400 });
}
