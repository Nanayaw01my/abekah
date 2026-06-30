"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Home, Bed, Bath, DollarSign, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PROPERTY_TYPES } from "@/lib/constants";

interface SearchBarProps {
  variant?: "hero" | "inline";
  initialValues?: {
    location?: string;
    type?: string;
    bedrooms?: string;
    bathrooms?: string;
    maxPrice?: string;
  };
}

export function SearchBar({ variant = "hero", initialValues = {} }: SearchBarProps) {
  const router = useRouter();
  const [location, setLocation] = useState(initialValues.location || "");
  const [type, setType] = useState(initialValues.type || "");
  const [bedrooms, setBedrooms] = useState(initialValues.bedrooms || "");
  const [bathrooms, setBathrooms] = useState(initialValues.bathrooms || "");
  const [maxPrice, setMaxPrice] = useState(initialValues.maxPrice || "");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (type) params.set("type", type);
    if (bedrooms) params.set("bedrooms", bedrooms);
    if (bathrooms) params.set("bathrooms", bathrooms);
    if (maxPrice) params.set("maxPrice", maxPrice);
    router.push(`/properties?${params.toString()}`);
  };

  if (variant === "inline") {
    return (
      <div className="flex flex-wrap gap-3 items-end">
        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City or neighborhood"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        <div className="min-w-[130px]">
          <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
          >
            <option value="">All Types</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
        <Button onClick={handleSearch} size="md">
          <Search className="w-4 h-4" /> Search
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-2 w-full max-w-4xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1">
        {/* Location */}
        <div className="sm:col-span-2 lg:col-span-1 relative group">
          <div className="p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Location
            </label>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or neighborhood"
                className="w-full text-sm text-gray-900 placeholder:text-gray-400 outline-none bg-transparent"
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
          </div>
        </div>

        <div className="hidden sm:block w-px bg-gray-200 self-stretch my-2" />

        {/* Property Type */}
        <div className="relative">
          <div className="p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Type
            </label>
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-green-500 flex-shrink-0" />
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-sm text-gray-900 outline-none bg-transparent appearance-none cursor-pointer"
              >
                <option value="">Any type</option>
                {PROPERTY_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="hidden sm:block w-px bg-gray-200 self-stretch my-2" />

        {/* Bedrooms */}
        <div className="relative">
          <div className="p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Bedrooms
            </label>
            <div className="flex items-center gap-2">
              <Bed className="w-4 h-4 text-green-500 flex-shrink-0" />
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="w-full text-sm text-gray-900 outline-none bg-transparent appearance-none cursor-pointer"
              >
                <option value="">Any</option>
                <option value="0">Studio</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
              </select>
            </div>
          </div>
        </div>

        <div className="hidden sm:block w-px bg-gray-200 self-stretch my-2" />

        {/* Price */}
        <div className="relative">
          <div className="p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase tracking-wide">
              Max Price
            </label>
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500 flex-shrink-0" />
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full text-sm text-gray-900 outline-none bg-transparent appearance-none cursor-pointer"
              >
                <option value="">Any price</option>
                <option value="1000">$1,000/mo</option>
                <option value="2000">$2,000/mo</option>
                <option value="3000">$3,000/mo</option>
                <option value="5000">$5,000/mo</option>
                <option value="10000">$10,000/mo</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="sm:col-span-2 lg:col-span-1 p-2">
          <Button onClick={handleSearch} className="w-full h-full min-h-[52px] text-base" size="lg">
            <Search className="w-5 h-5" />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}
