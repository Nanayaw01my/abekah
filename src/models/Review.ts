import mongoose, { Schema, Document } from "mongoose";

export interface IReview extends Document {
  property: mongoose.Types.ObjectId;
  reviewer: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  verified: boolean;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    reviewer: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ property: 1, reviewer: 1 }, { unique: true });

export default mongoose.models.Review || mongoose.model<IReview>("Review", ReviewSchema);
