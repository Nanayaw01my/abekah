import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const bookings = await Booking.find({ landlord: payload.sub })
      .populate("property", "title location images")
      .populate("tenant", "name phone email")
      .sort({ date: 1 })
      .lean();
    return NextResponse.json({ data: bookings });
  } catch {
    return NextResponse.json({ data: [] });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { bookingId, status } = await req.json();
    await connectDB();
    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, landlord: payload.sub },
      { status },
      { new: true }
    );
    return NextResponse.json({ data: booking });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
