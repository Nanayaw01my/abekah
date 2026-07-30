import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: "tenant" | "landlord" | "admin";
  phone?: string;
  verified: boolean;
  emailVerified: boolean;
  suspended: boolean;
  bio?: string;
  favorites: mongoose.Types.ObjectId[];
  provider?: string;
  providerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String },
    avatar: { type: String },
    role: { type: String, enum: ["tenant", "landlord", "admin"], default: "tenant" },
    phone: { type: String },
    verified: { type: Boolean, default: false },
    emailVerified: { type: Boolean, default: false },
    suspended: { type: Boolean, default: false },
    bio: { type: String },
    favorites: [{ type: Schema.Types.ObjectId, ref: "Property" }],
    provider: { type: String },
    providerId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
