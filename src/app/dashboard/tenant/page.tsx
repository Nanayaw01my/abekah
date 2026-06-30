"use client";

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
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { MOCK_PROPERTIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";
import { Property } from "@/types";

const saved = MOCK_PROPERTIES.slice(0, 3) as Property[];
const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Heart, label: "Saved Properties" },
  { icon: Search, label: "Recent Searches" },
  { icon: Calendar, label: "Appointments" },
  { icon: MessageSquare, label: "Messages" },
  { icon: User, label: "Profile" },
  { icon: Bell, label: "Notifications" },
  { icon: Settings, label: "Settings" },
];

const appointments = [
  { property: "Modern Apartment Downtown", date: "Tomorrow, 10:00 AM", type: "In-person viewing", status: "confirmed" },
  { property: "Charming Studio Arts District", date: "Sat, Jan 25, 2:00 PM", type: "Virtual tour", status: "pending" },
];

export default function TenantDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed left-0 top-20 bottom-0 overflow-y-auto">
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">
              E
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">Emily Chen</p>
              <span className="text-xs text-gray-500">Tenant Account</span>
            </div>
          </div>
        </div>
        <nav className="flex-1 p-3">
          {navItems.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 ${
                active ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {label === "Messages" && (
                <span className="ml-auto w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">2</span>
              )}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 min-w-0">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
              <p className="text-gray-500 text-sm">Welcome back, Emily!</p>
            </div>
            <Link href="/properties">
              <Button>
                <Search className="w-4 h-4" /> Find Properties
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Saved", value: "12", icon: Heart, color: "bg-rose-100 text-rose-600" },
              { label: "Appointments", value: "3", icon: Calendar, color: "bg-blue-100 text-blue-600" },
              { label: "Messages", value: "5", icon: MessageSquare, color: "bg-purple-100 text-purple-600" },
              { label: "Viewed", value: "47", icon: Eye, color: "bg-amber-100 text-amber-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}>
                  <Icon className="w-4 h-4" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>

          {/* Appointments */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Upcoming Viewings</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="divide-y divide-gray-100">
              {appointments.map(({ property, date, type, status }) => (
                <div key={property} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{property}</p>
                    <p className="text-xs text-gray-500">{date} · {type}</p>
                  </div>
                  <Badge variant={status === "confirmed" ? "success" : "warning"} className="capitalize flex-shrink-0">
                    {status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Saved Properties */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900">Saved Properties</h2>
              <Button variant="outline" size="sm">View All 12</Button>
            </div>
            <div className="divide-y divide-gray-100">
              {saved.map((property) => (
                <Link key={property._id} href={`/properties/${property._id}`}>
                  <div className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                    />
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
          </div>
        </div>
      </main>
    </div>
  );
}
