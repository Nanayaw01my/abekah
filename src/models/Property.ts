import mongoose, { Schema, Document } from "mongoose";

export interface IProperty extends Document {
  title: string;
  description: string;
  type: "apartment" | "house" | "studio" | "villa" | "room" | "townhouse" | "condo";
  price: number;
  priceType: "monthly" | "weekly" | "daily";
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    neighborhood?: string;
    coordinates?: { lat: number; lng: number };
    zipCode?: string;
  };
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  amenities: string[];
  features: {
    furnished: boolean;
    parking: boolean;
    petFriendly: boolean;
    security: boolean;
    water: boolean;
    electricity: boolean;
    internet: boolean;
    airConditioning: boolean;
    gym: boolean;
    pool: boolean;
    laundry: boolean;
  };
  landlord: mongoose.Types.ObjectId;
  status: "available" | "rented" | "maintenance";
  verified: boolean;
  featured: boolean;
  views: number;
  inquiries: number;
  availableFrom: Date;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
      type: String,
      enum: ["apartment", "house", "studio", "villa", "room", "townhouse", "condo"],
      required: true,
    },
    price: { type: Number, required: true },
    priceType: { type: String, enum: ["monthly", "weekly", "daily"], default: "monthly" },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      neighborhood: { type: String },
      coordinates: { lat: Number, lng: Number },
      zipCode: { type: String },
    },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    area: { type: Number, required: true },
    images: [{ type: String }],
    amenities: [{ type: String }],
    features: {
      furnished: { type: Boolean, default: false },
      parking: { type: Boolean, default: false },
      petFriendly: { type: Boolean, default: false },
      security: { type: Boolean, default: false },
      water: { type: Boolean, default: false },
      electricity: { type: Boolean, default: false },
      internet: { type: Boolean, default: false },
      airConditioning: { type: Boolean, default: false },
      gym: { type: Boolean, default: false },
      pool: { type: Boolean, default: false },
      laundry: { type: Boolean, default: false },
    },
    landlord: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["available", "rented", "maintenance"], default: "available" },
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    inquiries: { type: Number, default: 0 },
    availableFrom: { type: Date, default: Date.now },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PropertySchema.index({ "location.city": 1, type: 1, price: 1 });
PropertySchema.index({ landlord: 1 });
PropertySchema.index({ featured: 1, verified: 1 });

export default mongoose.models.Property || mongoose.model<IProperty>("Property", PropertySchema);
