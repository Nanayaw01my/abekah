import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  conversation: mongoose.Types.ObjectId;
  sender: mongoose.Types.ObjectId;
  content: string;
  image?: string;
  read: boolean;
  createdAt: Date;
}

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  property: mongoose.Types.ObjectId;
  lastMessage?: string;
  lastMessageAt?: Date;
  unreadCount: number;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversation: { type: Schema.Types.ObjectId, ref: "Conversation", required: true },
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    image: { type: String },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    property: { type: Schema.Types.ObjectId, ref: "Property" },
    lastMessage: { type: String },
    lastMessageAt: { type: Date },
    unreadCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Message =
  mongoose.models.Message || mongoose.model<IMessage>("Message", MessageSchema);
export const Conversation =
  mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);
