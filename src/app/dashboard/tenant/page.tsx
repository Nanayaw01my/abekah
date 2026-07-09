"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart, Search, Calendar, MessageSquare, Bell, Settings,
  LogOut, LayoutDashboard, User, MapPin, Bed, Bath, Menu, X,
  Home, SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Browse Properties" },
  { icon: Heart, label: "Saved" },
  { icon: Calendar, label: "Appointments" },
  { icon: MessageSquare, label: "Messages" },
  { icon: User, label: "Profile" },
  { icon: Bell, label: "Notifications" },
  { icon: Settings, label: "Settings" },
];

interface Property {
  _id: string;
  title: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  status: string;
  type: string;
  images: string[];
  location: { city: string; state: string; neighborhood?: string };
  features?: { furnished?: boolean };
  landlord?: { name: string };
}

export default function TenantDashboardPage() {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("Browse Properties");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    fetch("/api/properties?limit=20&sortBy=newest")
      .then((r) => r.json())
      .then((d) => { setProperties(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "T";

  const filtered = properties.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.city.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type === typeFilter;
    return matchSearch && matchType;
  });

  const sidebarInner = (
    <>
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold overflow-hidden">
            {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{user?.name || "Tenant"}</p>
            <span className="text-xs text-gray-500">Tenant Account</span>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3">
        {navItems.map(({ icon: Icon, label }) => (
          <button
            key={label}
            onClick={() => { setActiveNav(label); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 ${
              activeNav === label ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 flex">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Menu</span>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            {sidebarInner}
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed left-0 top-20 bottom-0 overflow-y-auto">
        {sidebarInner}
      </aside>

      <main className="flex-1 lg:ml-64 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-bold text-gray-900">Find Properties</span>
          <div className="w-8" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {user?.name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">Browse available properties for rent across Ghana</p>
          </div>

          {/* Search + Filter */}
          <div className="flex gap-3 mb-5 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or city..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="relative">
              <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white appearance-none"
              >
                <option value="all">All Types</option>
                <option value="apartment">Apartment</option>
                <option value="room">Single Room</option>
                <option value="studio">Self Contain / Studio</option>
                <option value="house">House</option>
                <option value="townhouse">Chamber & Hall</option>
              </select>
            </div>
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-sm text-gray-500 mb-4">
              {filtered.length} {filtered.length === 1 ? "property" : "properties"} available
            </p>
          )}

          {/* Properties Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                  <div className="h-44 bg-gray-200" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                    <div className="h-5 bg-gray-200 rounded w-1/3 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Home className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 font-medium">No properties found</p>
              <p className="text-sm text-gray-400 mt-1">Try a different search or filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((p) => (
                <Link key={p._id} href={`/properties/${p._id}`}>
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
                    <div className="relative">
                      <img
                        src={p.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"}
                        alt={p.title}
                        className="w-full h-44 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <Badge variant={p.status === "available" ? "success" : "warning"} className="capitalize text-xs">
                          {p.status}
                        </Badge>
                      </div>
                      <button
                        onClick={(e) => { e.preventDefault(); }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
                      >
                        <Heart className="w-4 h-4 text-gray-400" />
                      </button>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">{p.title}</h3>
                      <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
                        {p.location.neighborhood ? `${p.location.neighborhood}, ` : ""}{p.location.city}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {p.bedrooms} bed</span>
                        <span className="flex items-center gap-1"><Bath className="w-3 h-3" /> {p.bathrooms} bath</span>
                        {p.features?.furnished && <span className="text-green-600">Furnished</span>}
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <p className="font-bold text-gray-900">{formatPrice(p.price)}<span className="text-xs text-gray-400 font-normal">/mo</span></p>
                        <span className="text-xs text-gray-400 capitalize">{p.type}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* Browse more */}
          {!loading && filtered.length > 0 && (
            <div className="text-center mt-8">
              <Link href="/properties">
                <Button variant="outline" size="lg">View All Properties</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
