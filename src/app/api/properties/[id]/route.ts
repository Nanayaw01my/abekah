import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const property = await Property.findById(id)
      .populate("landlord", "name avatar verified phone bio")
      .lean();
    if (!property) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: property });
  } catch (error) {
    console.error("[GET /api/properties/[id]]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
