import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import Property from "@/models/Property";
import Booking from "@/models/Booking";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const payload = await verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();

    const [
      totalProperties,
      totalUsers,
      pendingVerifications,
      recentUsers,
      recentProperties,
      totalBookings,
    ] = await Promise.all([
      Property.countDocuments(),
      User.countDocuments(),
      User.countDocuments({ verified: false, role: "landlord" }),
      User.find().sort({ createdAt: -1 }).limit(5).select("name email role verified createdAt avatar").lean(),
      Property.find().sort({ createdAt: -1 }).limit(5).populate("landlord", "name").lean(),
      Booking.countDocuments(),
    ]);

    return NextResponse.json({
      stats: {
        totalProperties,
        totalUsers,
        pendingVerifications,
        totalBookings,
      },
      recentUsers,
      recentProperties,
    });
  } catch (error) {
    console.error("[GET /api/dashboard/admin]", error);
    return NextResponse.json({
      stats: { totalProperties: 0, totalUsers: 0, pendingVerifications: 0, totalBookings: 0 },
      recentUsers: [],
      recentProperties: [],
    });
  }
}
