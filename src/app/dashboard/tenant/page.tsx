"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart,
  Search,
  Calendar,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  User,
  MapPin,
  Bed,
  Bath,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Heart, label: "Saved Properties" },
  { icon: Search, label: "Recent Searches" },
  { icon: Calendar, label: "Appointments" },
  { icon: MessageSquare, label: "Messages" },
  { icon: User, label: "Profile" },
  { icon: Bell, label: "Notifications" },
  { icon: Settings, label: "Settings" },
];

interface DashboardData {
  stats: { saved: number; appointments: number; messages: number };
  recentBookings: Array<{
    _id: string;
    date: string;
    time: string;
    type: string;
    status: string;
    property: { title: string; location: { city: string; state: string }; images: string[] };
  }>;
  savedProperties: Array<{
    _id: string;
    title: string;
    price: number;
    bedrooms: number;
    bathrooms: number;
    status: string;
    images: string[];
    location: { city: string; state: string };
  }>;
}

export default function TenantDashboardPage() {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<DashboardData>({
    stats: { saved: 0, appointments: 0, messages: 0 },
    recentBookings: [],
    savedProperties: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("rf_token");
    if (!token) { setLoading(false); return; }
    fetch("/api/dashboard/tenant", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (d && !d.error) setData(d); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "T";

  const sidebarInner = (
    <>
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold overflow-hidden">
            {user?.avatar
              ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              : initials}
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
            {label === "Messages" && data.stats.messages > 0 && (
              <span className="ml-auto w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">
                {data.stats.messages}
              </span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
        >
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
          <span className="font-bold text-gray-900">My Dashboard</span>
          <Link href="/properties">
            <Button size="sm"><Search className="w-4 h-4" /></Button>
          </Link>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome back, {user?.name?.split(" ")[0] || "there"}!</p>
            </div>
            <Link href="/properties">
              <Button><Search className="w-4 h-4" /> Find Properties</Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {[
              { label: "Saved", value: data.stats.saved, icon: Heart, color: "bg-rose-100 text-rose-600" },
              { label: "Appointments", value: data.stats.appointments, icon: Calendar, color: "bg-blue-100 text-blue-600" },
              { label: "Messages", value: data.stats.messages, icon: MessageSquare, color: "bg-purple-100 text-purple-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-4 h-4" />
                </div>
                {loading
                  ? <div className="h-7 w-10 bg-gray-200 rounded animate-pulse mx-auto mb-1" />
                  : <p className="text-2xl font-bold text-gray-900">{value}</p>}
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Upcoming Viewings */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Upcoming Viewings</h2>
            </div>
            {loading ? (
              <div className="p-6 text-center text-sm text-gray-400 animate-pulse">Loading...</div>
            ) : data.recentBookings.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No upcoming viewings yet</p>
                <Link href="/properties" className="mt-3 inline-block">
                  <Button size="sm" variant="outline">Browse Properties</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data.recentBookings.map((b) => (
                  <div key={b._id} className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-green-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{b.property?.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(b.date).toLocaleDateString("en-GH", { weekday: "short", month: "short", day: "numeric" })} · {b.time} · {b.type}
                      </p>
                    </div>
                    <Badge variant={b.status === "confirmed" ? "success" : "warning"} className="capitalize flex-shrink-0">
                      {b.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Saved Properties */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Saved Properties</h2>
              {data.stats.saved > 0 && (
                <Link href="/favorites">
                  <Button variant="outline" size="sm">View All {data.stats.saved}</Button>
                </Link>
              )}
            </div>
            {loading ? (
              <div className="p-6 text-center text-sm text-gray-400 animate-pulse">Loading...</div>
            ) : data.savedProperties.length === 0 ? (
              <div className="p-8 text-center">
                <Heart className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No saved properties yet</p>
                <Link href="/properties" className="mt-3 inline-block">
                  <Button size="sm" variant="outline">Browse Properties</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {data.savedProperties.map((property) => (
                  <Link key={property._id} href={`/properties/${property._id}`}>
                    <div className="flex items-center gap-3 sm:gap-4 p-4 hover:bg-gray-50 transition-colors">
                      <img src={property.images[0]} alt={property.title} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 text-sm truncate">{property.title}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="w-3 h-3 text-green-500" />
                          {property.location.city}, {property.location.state}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-0.5"><Bed className="w-3 h-3" /> {property.bedrooms}bd</span>
                          <span className="flex items-center gap-0.5"><Bath className="w-3 h-3" /> {property.bathrooms}ba</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-bold text-gray-900 text-sm">{formatPrice(property.price)}</p>
                        <p className="text-xs text-gray-400">/mo</p>
                        <Badge variant={property.status === "available" ? "success" : "danger"} className="text-xs mt-1 capitalize">
                          {property.status}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
