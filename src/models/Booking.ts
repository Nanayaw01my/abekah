import mongoose, { Schema, Document } from "mongoose";

export interface IBooking extends Document {
  property: mongoose.Types.ObjectId;
  tenant: mongoose.Types.ObjectId;
  landlord: mongoose.Types.ObjectId;
  type: "viewing" | "inspection" | "application";
  date: Date;
  time: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  notes?: string;
  createdAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    tenant: { type: Schema.Types.ObjectId, ref: "User", required: true },
    landlord: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["viewing", "inspection", "application"], required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ["pending", "confirmed", "cancelled", "completed"], default: "pending" },
    notes: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
