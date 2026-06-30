"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Eye,
  MessageSquare,
  Calendar,
  DollarSign,
  TrendingUp,
  Edit2,
  Trash2,
  BadgeCheck,
  MoreVertical,
  Bell,
  Settings,
  LogOut,
  LayoutDashboard,
  List,
  Users,
  Star,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROPERTIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";
import { useAuth } from "@/context/AuthContext";

const mockLandlordProperties = MOCK_PROPERTIES.slice(0, 3) as Property[];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: List, label: "My Properties" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Calendar, label: "Bookings" },
  { icon: Users, label: "Tenants" },
  { icon: TrendingUp, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

export default function LandlordDashboardPage() {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "L";

  const stats = [
    { label: "Properties", value: "3", icon: Building2, change: "+1", color: "bg-blue-100 text-blue-600" },
    { label: "Total Views", value: "1,247", icon: Eye, change: "+23%", color: "bg-green-100 text-green-600" },
    { label: "Messages", value: "18", icon: MessageSquare, change: "+5", color: "bg-purple-100 text-purple-600" },
    { label: "Bookings", value: "7", icon: Calendar, change: "+2", color: "bg-amber-100 text-amber-600" },
    { label: "Revenue", value: "$9,700", icon: DollarSign, change: "+12%", color: "bg-emerald-100 text-emerald-600" },
    { label: "Avg. Rating", value: "4.7", icon: Star, change: "+0.2", color: "bg-rose-100 text-rose-600" },
  ];

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold overflow-hidden">
            {user?.avatar ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : initials}
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{user?.name || "Landlord"}</p>
            <div className="flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs text-green-600">Verified Landlord</span>
            </div>
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
            {label === "Messages" && (
              <span className="ml-auto w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">3</span>
            )}
          </button>
        ))}
      </nav>
      <div className="p-3 border-t border-gray-100">
        <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 pt-16 lg:pt-20 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <span className="font-bold text-gray-900">Menu</span>
              <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed left-0 top-20 bottom-0 overflow-y-auto">
        <SidebarContent />
      </aside>

      <main className="flex-1 lg:ml-64 min-w-0">
        {/* Mobile top bar */}
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-bold text-gray-900">Dashboard</span>
          <Link href="/dashboard/landlord/new-property">
            <Button size="sm"><Plus className="w-4 h-4" /></Button>
          </Link>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Desktop Header */}
          <div className="hidden lg:flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome back, {user?.name?.split(" ")[0] || "there"}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="relative p-2.5 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                <Bell className="w-5 h-5 text-gray-600" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full" />
              </button>
              <Link href="/dashboard/landlord/new-property">
                <Button><Plus className="w-4 h-4" /> Add Property</Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            {stats.map(({ label, value, icon: Icon, change, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                <p className="text-xs text-green-600 font-medium mt-1">{change}</p>
              </div>
            ))}
          </div>

          {/* Properties */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">My Properties</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="divide-y divide-gray-100">
              {mockLandlordProperties.map((property) => (
                <div key={property._id} className="p-4 flex items-center gap-3 sm:gap-4">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">{property.title}</h3>
                    <p className="text-xs text-gray-500 truncate">{property.location.city}, {property.location.state}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <Badge variant={property.status === "available" ? "success" : "warning"} className="text-xs capitalize">
                        {property.status}
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Eye className="w-3 h-3" /> {property.views}
                      </span>
                    </div>
                  </div>
                  <div className="text-right hidden sm:block flex-shrink-0">
                    <p className="font-bold text-gray-900">{formatPrice(property.price)}</p>
                    <p className="text-xs text-gray-500">/month</p>
                  </div>
                  <div className="relative flex-shrink-0">
                    <button
                      onClick={() => setActiveMenu(activeMenu === property._id ? null : property._id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                    {activeMenu === property._id && (
                      <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-10 py-1">
                        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <Link href={`/properties/${property._id}`}>
                          <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Eye className="w-3.5 h-3.5" /> View Listing
                          </button>
                        </Link>
                        <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Recent Inquiries</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { name: "Alex Johnson", message: "Hi, I'm interested in the downtown apartment. Is it still available?", time: "2 min ago", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80" },
                { name: "Maria Santos", message: "Could I schedule a viewing for this Saturday?", time: "1 hour ago", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80" },
                { name: "David Kim", message: "Are pets allowed in the property?", time: "3 hours ago", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80" },
              ].map(({ name, message, time, avatar }) => (
                <div key={name} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <p className="text-xs text-gray-500 truncate">{message}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
