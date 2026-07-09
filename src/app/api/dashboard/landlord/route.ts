import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";
import Booking from "@/models/Booking";
import { Conversation } from "@/models/Message";
import Review from "@/models/Review";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const userId = payload.sub as string;

    const myProperties = await Property.find({ landlord: userId }).lean();
    const propertyIds = myProperties.map((p) => p._id);

    const [bookings, unreadConvos, reviews] = await Promise.all([
      Booking.countDocuments({ landlord: userId }),
      Conversation.countDocuments({ participants: userId, unreadCount: { $gt: 0 } }),
      Review.find({ property: { $in: propertyIds } }).lean(),
    ]);

    const totalViews = myProperties.reduce((sum, p) => sum + (p.views || 0), 0);
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    const recentBookings = await Booking.find({ landlord: userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("property", "title location images")
      .populate("tenant", "name email avatar")
      .lean();

    return NextResponse.json({
      stats: {
        properties: myProperties.length,
        totalViews,
        messages: unreadConvos,
        bookings,
        avgRating: Number(avgRating.toFixed(1)),
      },
      myProperties: myProperties.slice(0, 4),
      recentBookings,
    });
  } catch (error) {
    console.error("[GET /api/dashboard/landlord]", error);
    return NextResponse.json({
      stats: { properties: 0, totalViews: 0, messages: 0, bookings: 0, avgRating: 0 },
      myProperties: [],
      recentBookings: [],
    });
  }
}
