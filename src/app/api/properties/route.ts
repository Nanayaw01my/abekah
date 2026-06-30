import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Property from "@/models/Property";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 12;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    const city = searchParams.get("city");
    const type = searchParams.get("type");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const bedrooms = searchParams.get("bedrooms");
    const bathrooms = searchParams.get("bathrooms");
    const furnished = searchParams.get("furnished");
    const parking = searchParams.get("parking");
    const sortBy = searchParams.get("sortBy") || "newest";

    if (city) query["location.city"] = { $regex: city, $options: "i" };
    if (type) query.type = type;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) (query.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (query.price as Record<string, number>).$lte = Number(maxPrice);
    }
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    if (furnished === "true") query["features.furnished"] = true;
    if (parking === "true") query["features.parking"] = true;

    type SortOption = { [key: string]: 1 | -1 };
    const sortMap: Record<string, SortOption> = {
      newest: { createdAt: -1 },
      price_asc: { price: 1 },
      price_desc: { price: -1 },
      most_popular: { views: -1 },
    };

    const sort: SortOption = sortMap[sortBy] || { createdAt: -1 };

    const [properties, total] = await Promise.all([
      Property.find(query)
        .populate("landlord", "name avatar verified phone bio")
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Property.countDocuments(query),
    ]);

    return NextResponse.json({
      data: properties,
      total,
      page,
      pages: Math.ceil(total / limit),
      limit,
    });
  } catch (error) {
    console.error("[GET /api/properties]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const property = await Property.create(body);
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error("[POST /api/properties]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
