"use client";

import { useState } from "react";
import { MapPin, X, Bed, Bath, Maximize2, BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { MOCK_PROPERTIES } from "@/lib/constants";
import { Property } from "@/types";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { SearchBar } from "@/components/property/SearchBar";

export default function MapPage() {
  const [selected, setSelected] = useState<Property | null>(null);

  const properties = MOCK_PROPERTIES as Property[];

  return (
    <div className="min-h-screen pt-20 flex flex-col">
      {/* Search bar */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 z-10">
        <div className="max-w-[1280px] mx-auto">
          <SearchBar variant="inline" />
        </div>
      </div>

      <div className="flex flex-1 relative">
        {/* Map placeholder */}
        <div className="flex-1 relative bg-gray-200 overflow-hidden">
          {/* Simulated map background */}
          <img
            src="https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1920&q=80"
            alt="Map view"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md shadow-xl border border-gray-200">
              <MapPin className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Interactive Map</h2>
              <p className="text-gray-600 text-sm mb-4">
                Add your Google Maps API key in the environment variables to enable the full
                interactive map with property pins, neighborhood data, and real-time filtering.
              </p>
              <div className="bg-gray-50 rounded-xl p-3 text-left text-xs text-gray-500 font-mono border border-gray-200">
                NEXT_PUBLIC_GOOGLE_MAPS_KEY=your_key_here
              </div>
            </div>
          </div>

          {/* Property pins (simulated) */}
          {properties.map((p, i) => (
            <button
              key={p._id}
              onClick={() => setSelected(p)}
              style={{
                position: "absolute",
                left: `${15 + ((i * 137) % 70)}%`,
                top: `${20 + ((i * 89) % 60)}%`,
              }}
              className="transform -translate-x-1/2 -translate-y-1/2 group"
            >
              <div className={`px-2.5 py-1.5 rounded-xl font-bold text-xs shadow-lg transition-all group-hover:scale-110 ${
                selected?._id === p._id
                  ? "bg-green-600 text-white scale-110"
                  : "bg-white text-gray-900 hover:bg-green-600 hover:text-white"
              }`}>
                {formatPrice(p.price)}
              </div>
            </button>
          ))}
        </div>

        {/* Property List */}
        <div className="hidden lg:flex flex-col w-96 bg-white border-l border-gray-100 overflow-y-auto">
          <div className="p-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">{properties.length} properties on map</h2>
          </div>
          <div className="flex-1 divide-y divide-gray-100">
            {properties.map((p) => (
              <button
                key={p._id}
                onClick={() => setSelected(p)}
                className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                  selected?._id === p._id ? "bg-green-50 border-l-2 border-green-500" : ""
                }`}
              >
                <div className="flex gap-3">
                  <img
                    src={p.images[0]}
                    alt={p.title}
                    className="w-16 h-14 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{p.title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-green-500" />
                      {p.location.city}, {p.location.state}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                      <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" />{p.bedrooms}bd</span>
                      <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" />{p.bathrooms}ba</span>
                      <span className="flex items-center gap-0.5"><Maximize2 className="w-3 h-3" />{p.area}sqft</span>
                    </div>
                    <p className="text-green-600 font-bold text-sm mt-1">{formatPrice(p.price)}/mo</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Property Popup */}
        {selected && (
          <div className="absolute bottom-6 left-1/2 lg:left-6 -translate-x-1/2 lg:translate-x-0 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-20">
            <button
              onClick={() => setSelected(null)}
              className="absolute top-3 right-3 w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors z-10"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <div className="relative h-40 overflow-hidden rounded-t-2xl">
              <img src={selected.images[0]} alt={selected.title} className="w-full h-full object-cover" />
              {selected.verified && (
                <div className="absolute top-3 left-3 flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  <BadgeCheck className="w-3 h-3" /> Verified
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{selected.title}</h3>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5 mb-2">
                <MapPin className="w-3 h-3 text-green-500" />
                {selected.location.neighborhood ? `${selected.location.neighborhood}, ` : ""}{selected.location.city}
              </p>
              <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{selected.bedrooms}bd</span>
                <span className="flex items-center gap-1"><Bath className="w-3.5 h-3.5" />{selected.bathrooms}ba</span>
                <span className="flex items-center gap-1"><Maximize2 className="w-3.5 h-3.5" />{selected.area}sqft</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-lg text-gray-900">{formatPrice(selected.price)}<span className="text-gray-400 font-normal text-xs">/mo</span></span>
                <Link href={`/properties/${selected._id}`}>
                  <Button size="sm">
                    View <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
