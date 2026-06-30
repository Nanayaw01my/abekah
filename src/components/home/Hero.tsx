"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, ChevronDown, Search, BadgeCheck } from "lucide-react";
import { PROPERTY_TYPES, GHANA_LOCATIONS } from "@/lib/constants";

const featuredBadge = [
  { label: "West Legon, Accra", price: "GHC 3,000/mo", img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300" },
  { label: "East Legon, Accra", price: "GHC 2,500/mo", img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300" },
];

export function Hero() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState("any");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (propertyType && propertyType !== "all") params.set("type", propertyType);
    if (priceRange && priceRange !== "any") params.set("price", priceRange);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="pt-16 lg:pt-20 min-h-[85vh] bg-white flex items-center">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-12 lg:py-20">
          {/* Left — Text & Search */}
          <div>
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 text-sm font-semibold px-4 py-2 rounded-full mb-5 border border-green-100">
              <BadgeCheck className="w-4 h-4" />
              Verified properties. Trusted landlords.
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold text-gray-900 leading-[1.1] mb-5">
              Find Your{" "}
              <span className="text-green-600">Perfect</span>{" "}
              Rental Home
            </h1>
            <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-lg">
              Find a place you&apos;ll love to live. Verified properties, trusted landlords, direct contact — no agent, no stress.
            </p>

            {/* Search Bar */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-3 flex flex-col sm:flex-row gap-3">
              {/* Location */}
              <div className="flex-1 flex items-center gap-2 px-3 py-2 border border-gray-100 rounded-xl bg-gray-50 min-w-0">
                <MapPin className="w-4 h-4 text-green-600 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-medium">Location</p>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location"
                    className="w-full text-sm text-gray-800 bg-transparent outline-none placeholder-gray-400"
                    list="ghana-locations"
                  />
                  <datalist id="ghana-locations">
                    {GHANA_LOCATIONS.map((l) => <option key={l} value={l} />)}
                  </datalist>
                </div>
              </div>

              {/* Property Type */}
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-100 rounded-xl bg-gray-50 min-w-[140px]">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-medium">Property Type</p>
                  <div className="flex items-center gap-1">
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full text-sm text-gray-800 bg-transparent outline-none appearance-none"
                    >
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </div>

              {/* Price Range */}
              <div className="flex items-center gap-2 px-3 py-2 border border-gray-100 rounded-xl bg-gray-50 min-w-[130px]">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-400 font-medium">Price Range</p>
                  <div className="flex items-center gap-1">
                    <select
                      value={priceRange}
                      onChange={(e) => setPriceRange(e.target.value)}
                      className="w-full text-sm text-gray-800 bg-transparent outline-none appearance-none"
                    >
                      <option value="any">Any Price</option>
                      <option value="0-500">Below GHC 500</option>
                      <option value="500-1500">GHC 500 – 1,500</option>
                      <option value="1500-3000">GHC 1,500 – 3,000</option>
                      <option value="3000+">GHC 3,000+</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm flex-shrink-0"
              >
                <Search className="w-4 h-4" />
                Search
              </button>
            </div>

            {/* Quick stats */}
            <div className="flex items-center gap-6 mt-7 text-sm text-gray-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span><strong className="text-gray-900">5K+</strong> Properties Listed</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <span><strong className="text-gray-900">2K+</strong> Verified Landlords</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-amber-500" />
                <span><strong className="text-gray-900">Free</strong> To Join</span>
              </div>
            </div>
          </div>

          {/* Right — Property image collage */}
          <div className="relative hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl h-[520px]">
              <img
                src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=900&q=80"
                alt="Modern apartment"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>

            {/* Floating cards */}
            {featuredBadge.map((b, i) => (
              <div
                key={b.label}
                className={`absolute ${i === 0 ? "-left-10 top-16" : "-left-10 bottom-20"} bg-white rounded-2xl shadow-xl p-3 flex items-center gap-3 w-56 border border-gray-100`}
              >
                <img src={b.img} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                <div>
                  <div className="flex items-center gap-1 mb-0.5">
                    <BadgeCheck className="w-3 h-3 text-green-600" />
                    <span className="text-xs text-green-600 font-medium">Verified</span>
                  </div>
                  <p className="text-xs text-gray-500">{b.label}</p>
                  <p className="text-sm font-bold text-green-600">{b.price}</p>
                </div>
              </div>
            ))}

            {/* Category chips */}
            <div className="absolute -bottom-4 right-4 flex gap-2">
              {["Apartment", "Self Contain", "Single Room"].map((cat) => (
                <Link key={cat} href={`/properties?type=${cat.toLowerCase().replace(" ", "-")}`}>
                  <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-full shadow-md border border-gray-100 hover:border-green-300 hover:text-green-700 transition-colors cursor-pointer">
                    {cat}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
