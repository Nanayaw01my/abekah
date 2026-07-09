import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Property from "@/models/Property";
import Booking from "@/models/Booking";
import { Conversation } from "@/models/Message";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const userId = payload.sub as string;
    const user = await User.findById(userId).lean();
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    const [savedCount, bookings, unreadConvos, recentBookings] = await Promise.all([
      Promise.resolve(((user as { favorites?: unknown[] }).favorites || []).length),
      Booking.countDocuments({ tenant: userId }),
      Conversation.countDocuments({ participants: userId, unreadCount: { $gt: 0 } }),
      Booking.find({ tenant: userId })
        .sort({ createdAt: -1 })
        .limit(3)
        .populate("property", "title location images")
        .lean(),
    ]);

    const savedProperties = await Property.find({
      _id: { $in: (user as { favorites?: unknown[] }).favorites || [] },
    })
      .limit(3)
      .lean();

    return NextResponse.json({
      stats: {
        saved: savedCount,
        appointments: bookings,
        messages: unreadConvos,
      },
      recentBookings,
      savedProperties,
    });
  } catch (error) {
    console.error("[GET /api/dashboard/tenant]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
