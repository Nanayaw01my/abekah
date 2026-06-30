"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, Grid3X3, List, MapPin, X } from "lucide-react";
import { PropertyCard } from "@/components/property/PropertyCard";
import { FilterSidebar } from "@/components/property/FilterSidebar";
import { SearchBar } from "@/components/property/SearchBar";
import { Button } from "@/components/ui/Button";
import { MOCK_PROPERTIES, SORT_OPTIONS } from "@/lib/constants";
import { Property, SearchFilters } from "@/types";
import { cn } from "@/lib/utils";

function PropertiesContent() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<SearchFilters>({
    location: searchParams.get("location") || undefined,
    type: searchParams.get("type") || undefined,
    bedrooms: searchParams.get("bedrooms") ? Number(searchParams.get("bedrooms")) : undefined,
    maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const LIMIT = 9;

  const filtered = MOCK_PROPERTIES.filter((p) => {
    if (filters.type && p.type !== filters.type) return false;
    if (filters.bedrooms !== undefined && p.bedrooms < filters.bedrooms) return false;
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    if (filters.location) {
      const loc = filters.location.toLowerCase();
      if (
        !p.location.city.toLowerCase().includes(loc) &&
        !p.location.state.toLowerCase().includes(loc) &&
        !p.location.neighborhood?.toLowerCase().includes(loc)
      )
        return false;
    }
    if (filters.furnished && !p.features.furnished) return false;
    if (filters.parking && !p.features.parking) return false;
    if (filters.petFriendly && !p.features.petFriendly) return false;
    return true;
  }) as Property[];

  const sorted = [...filtered].sort((a, b) => {
    if (filters.sortBy === "price_asc") return a.price - b.price;
    if (filters.sortBy === "price_desc") return b.price - a.price;
    if (filters.sortBy === "most_popular") return b.views - a.views;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const pages = Math.ceil(sorted.length / LIMIT);
  const paginated = sorted.slice((page - 1) * LIMIT, page * LIMIT);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-6">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Browse Properties</h1>
              <p className="text-gray-500 text-sm mt-0.5">
                {sorted.length} properties found
                {filters.location ? ` in "${filters.location}"` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "grid" ? "bg-green-100 text-green-600" : "text-gray-400 hover:bg-gray-100"
                )}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  viewMode === "list" ? "bg-green-100 text-green-600" : "text-gray-400 hover:bg-gray-100"
                )}
              >
                <List className="w-4 h-4" />
              </button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </Button>
            </div>
          </div>
          <SearchBar
            variant="inline"
            initialValues={{
              location: filters.location,
              type: filters.type,
            }}
          />
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setPage(1);
              }}
            />
          </div>

          {/* Mobile filter drawer */}
          {showFilters && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setShowFilters(false)} />
              <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-2xl overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between">
                  <span className="font-semibold">Filters</span>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <FilterSidebar
                  filters={filters}
                  onChange={(f) => {
                    setFilters(f);
                    setPage(1);
                    setShowFilters(false);
                  }}
                  className="border-0 shadow-none rounded-none"
                />
              </div>
            </div>
          )}

          {/* Properties Grid */}
          <div className="flex-1 min-w-0">
            {paginated.length === 0 ? (
              <div className="text-center py-20">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No properties found</h3>
                <p className="text-gray-500 mb-6">Try adjusting your filters</p>
                <Button variant="outline" onClick={() => setFilters({})}>
                  Clear all filters
                </Button>
              </div>
            ) : (
              <>
                <div
                  className={cn(
                    "grid gap-6",
                    viewMode === "grid"
                      ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                      : "grid-cols-1"
                  )}
                >
                  {paginated.map((property) => (
                    <PropertyCard key={property._id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                {pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: pages }).map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        className={cn(
                          "w-9 h-9 rounded-xl text-sm font-medium transition-colors",
                          page === i + 1
                            ? "bg-green-600 text-white"
                            : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
                        )}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage((p) => Math.min(pages, p + 1))}
                      disabled={page === pages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 pt-20 flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <PropertiesContent />
    </Suspense>
  );
}
