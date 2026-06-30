"use client";

import { useState } from "react";
import { SlidersHorizontal, X, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PROPERTY_TYPES } from "@/lib/constants";
import { SearchFilters } from "@/types";
import { cn } from "@/lib/utils";

interface FilterSidebarProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  className?: string;
}

const featureFilters = [
  { key: "furnished", label: "Furnished" },
  { key: "parking", label: "Parking" },
  { key: "petFriendly", label: "Pet Friendly" },
];

const amenityFilters = [
  { key: "security", label: "Security" },
  { key: "water", label: "Water Included" },
  { key: "electricity", label: "Electricity Included" },
  { key: "internet", label: "Internet Included" },
];

export function FilterSidebar({ filters, onChange, className }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState({
    min: filters.minPrice || 0,
    max: filters.maxPrice || 10000,
  });

  const update = (key: keyof SearchFilters, value: unknown) => {
    onChange({ ...filters, [key]: value });
  };

  const reset = () => {
    setPriceRange({ min: 0, max: 10000 });
    onChange({});
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className={cn("bg-white rounded-2xl border border-gray-100 shadow-sm", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-green-600" />
          <span className="font-semibold text-gray-900">Filters</span>
          {activeCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </div>
        {activeCount > 0 && (
          <button onClick={reset} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 transition-colors">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
        )}
      </div>

      <div className="p-5 space-y-6">
        {/* Property Type */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Property Type</h4>
          <div className="grid grid-cols-2 gap-2">
            {PROPERTY_TYPES.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => update("type", filters.type === value ? undefined : value)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-medium border transition-all",
                  filters.type === value
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300 hover:text-green-600"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Price Range (Monthly)</h4>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Min</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setPriceRange((p) => ({ ...p, min: v }));
                      update("minPrice", v || undefined);
                    }}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    min={0}
                    step={100}
                  />
                </div>
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-500 mb-1 block">Max</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => {
                      const v = Number(e.target.value);
                      setPriceRange((p) => ({ ...p, max: v }));
                      update("maxPrice", v || undefined);
                    }}
                    className="w-full pl-7 pr-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    min={0}
                    step={100}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Bedrooms</h4>
          <div className="flex gap-2">
            {["Any", "0", "1", "2", "3", "4+"].map((val) => (
              <button
                key={val}
                onClick={() => update("bedrooms", val === "Any" ? undefined : Number(val.replace("+", "")))}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-medium border transition-all",
                  (val === "Any" && !filters.bedrooms) ||
                    filters.bedrooms === Number(val.replace("+", ""))
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                )}
              >
                {val === "0" ? "S" : val}
              </button>
            ))}
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Bathrooms</h4>
          <div className="flex gap-2">
            {["Any", "1", "2", "3", "4+"].map((val) => (
              <button
                key={val}
                onClick={() => update("bathrooms", val === "Any" ? undefined : Number(val.replace("+", "")))}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-medium border transition-all",
                  (val === "Any" && !filters.bathrooms) ||
                    filters.bathrooms === Number(val.replace("+", ""))
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-green-300"
                )}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Features */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Features</h4>
          <div className="space-y-2">
            {featureFilters.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => update(key as keyof SearchFilters, !filters[key as keyof SearchFilters])}
                  className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0",
                    filters[key as keyof SearchFilters]
                      ? "bg-green-600 border-green-600"
                      : "border-gray-300 group-hover:border-green-400"
                  )}
                >
                  {filters[key as keyof SearchFilters] && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Utilities */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Utilities Included</h4>
          <div className="space-y-2">
            {amenityFilters.map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => update(key as keyof SearchFilters, !filters[key as keyof SearchFilters])}
                  className={cn(
                    "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0",
                    filters[key as keyof SearchFilters]
                      ? "bg-green-600 border-green-600"
                      : "border-gray-300 group-hover:border-green-400"
                  )}
                >
                  {filters[key as keyof SearchFilters] && (
                    <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-3">Sort By</h4>
          <select
            value={filters.sortBy || "newest"}
            onChange={(e) => update("sortBy", e.target.value as SearchFilters["sortBy"])}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="most_popular">Most Popular</option>
          </select>
        </div>

        <Button onClick={() => onChange(filters)} className="w-full" size="lg">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
