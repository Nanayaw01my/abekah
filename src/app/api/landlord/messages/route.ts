import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Conversation, Message } from "@/models/Message";
import { verifyToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectDB();
    const convos = await Conversation.find({ participants: payload.sub })
      .populate("participants", "name avatar role")
      .populate("property", "title location")
      .sort({ lastMessageAt: -1 })
      .lean();
    const result = await Promise.all(convos.map(async (c) => {
      const msgs = await Message.find({ conversation: c._id }).sort({ createdAt: 1 }).lean();
      return { ...c, messages: msgs };
    }));
    return NextResponse.json({ data: result });
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
    const { conversationId, content } = await req.json();
    await connectDB();
    const msg = await Message.create({ conversation: conversationId, sender: payload.sub, content });
    await Conversation.findByIdAndUpdate(conversationId, { lastMessage: content, lastMessageAt: new Date() });
    return NextResponse.json({ data: msg });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
