"use client";

import { useState } from "react";
import Link from "next/link";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Car,
  Heart,
  BadgeCheck,
  Eye,
  ArrowRight,
} from "lucide-react";
import { Property } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";

interface PropertyCardProps {
  property: Property;
  compact?: boolean;
}

export function PropertyCard({ property, compact = false }: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  const landlord = property.landlord as {
    name: string;
    avatar?: string;
    verified: boolean;
  };

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[16/10]">
        <img
          src={property.images[imgIdx] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Image dots */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1">
            {property.images.slice(0, 4).map((_, i) => (
              <button
                key={i}
                onClick={() => setImgIdx(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === imgIdx ? "bg-white w-3" : "bg-white/60"
                }`}
              />
            ))}
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {property.verified && (
            <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              <BadgeCheck className="w-3 h-3" /> Verified
            </span>
          )}
          {property.featured && (
            <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm">
              Featured
            </span>
          )}
          <span
            className={`text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm ${
              property.status === "available"
                ? "bg-emerald-100 text-emerald-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {property.status === "available" ? "Available" : "Rented"}
          </span>
        </div>

        {/* Favorite */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"
            }`}
          />
        </button>

        {/* Price */}
        <div className="absolute bottom-3 right-3">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-md">
            <span className="font-bold text-gray-900 text-base">
              {formatPrice(property.price)}
            </span>
            <span className="text-gray-500 text-xs">/{property.priceType}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Type & Views */}
        <div className="flex items-center justify-between mb-2">
          <Badge variant="success" className="capitalize">
            {property.type}
          </Badge>
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <Eye className="w-3 h-3" />
            {property.views} views
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-tight mb-1.5 line-clamp-1 group-hover:text-green-600 transition-colors">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
          <MapPin className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
          <span className="truncate">
            {property.location.neighborhood
              ? `${property.location.neighborhood}, `
              : ""}
            {property.location.city}, {property.location.state}
          </span>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-sm text-gray-600 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4 text-gray-400" />
            <span>{property.bedrooms === 0 ? "Studio" : `${property.bedrooms} Bed`}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4 text-gray-400" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Maximize2 className="w-4 h-4 text-gray-400" />
            <span>{property.area} sqft</span>
          </div>
          {property.features.parking && (
            <div className="flex items-center gap-1">
              <Car className="w-4 h-4 text-gray-400" />
              <span>Parking</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-1.5">
            {property.reviewCount > 0 && (
              <>
                <StarRating rating={property.rating} size="sm" />
                <span className="text-xs text-gray-500">
                  {property.rating.toFixed(1)} ({property.reviewCount})
                </span>
              </>
            )}
          </div>
          <Link href={`/properties/${property._id}`}>
            <Button size="sm" className="gap-1">
              View <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
