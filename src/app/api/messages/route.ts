import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Conversation, Message } from "@/models/Message";
import { verifyToken } from "@/lib/jwt";

// POST — find or create a conversation and send the first message
export async function POST(req: NextRequest) {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = await verifyToken(token);
    if (!payload?.sub) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { landlordId, propertyId, content } = await req.json();
    if (!landlordId || !propertyId || !content?.trim()) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();
    const tenantId = payload.sub as string;

    // Find existing conversation between tenant + landlord for this property
    let convo = await Conversation.findOne({
      property: propertyId,
      participants: { $all: [tenantId, landlordId] },
    });

    if (!convo) {
      convo = await Conversation.create({
        participants: [tenantId, landlordId],
        property: propertyId,
        lastMessage: content,
        lastMessageAt: new Date(),
        unreadCount: 1,
      });
    } else {
      convo.lastMessage = content;
      convo.lastMessageAt = new Date();
      convo.unreadCount = (convo.unreadCount || 0) + 1;
      await convo.save();
    }

    const msg = await Message.create({
      conversation: convo._id,
      sender: tenantId,
      content: content.trim(),
    });

    return NextResponse.json({ data: { conversationId: convo._id, message: msg } }, { status: 201 });
  } catch (error) {
    console.error("[POST /api/messages]", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
