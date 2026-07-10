import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Property from "@/models/Property";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const user = await User.findById(payload.sub).lean() as { favorites?: string[] } | null;
    if (!user) return NextResponse.json({ data: [] });
    const props = await Property.find({ _id: { $in: user.favorites || [] } })
      .populate("landlord", "name phone")
      .lean();
    return NextResponse.json({ data: props });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { propertyId, action } = await req.json();
    await connectDB();
    if (action === "add") {
      await User.findByIdAndUpdate(payload.sub, { $addToSet: { favorites: propertyId } });
    } else {
      await User.findByIdAndUpdate(payload.sub, { $pull: { favorites: propertyId } });
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
