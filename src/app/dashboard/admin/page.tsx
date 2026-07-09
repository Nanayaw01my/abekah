"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  BadgeCheck,
  Shield,
  TrendingUp,
  Settings,
  LogOut,
  Bell,
  Search,
  Eye,
  Trash2,
  CheckCircle,
  XCircle,
  MoreVertical,
  AlertTriangle,
  DollarSign,
  MapPin,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface AdminData {
  stats: { totalProperties: number; totalUsers: number; pendingVerifications: number; totalBookings: number };
  recentUsers: Array<{ _id: string; name: string; email: string; role: string; verified: boolean; createdAt: string; avatar?: string }>;
  recentProperties: Array<{ _id: string; title: string; price: number; status: string; verified: boolean; images: string[]; location: { city: string; state: string } }>;
}

const navItems = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: Building2, label: "Properties" },
  { icon: Users, label: "Users" },
  { icon: BadgeCheck, label: "Verifications" },
  { icon: MessageSquare, label: "Reports" },
  { icon: TrendingUp, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

const pendingVerifications = [
  { id: "v1", name: "James Osei", type: "Landlord", email: "james@example.com", submitted: "2h ago" },
  { id: "v2", name: "Akosua Mensah", type: "Landlord", email: "akosua@example.com", submitted: "5h ago" },
  { id: "v3", name: "Kofi Atta", type: "Property", email: "kofi@example.com", submitted: "1d ago" },
];

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"properties" | "users" | "verifications">("properties");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("rf_token");
    if (!token) { setLoading(false); return; }
    fetch("/api/dashboard/admin", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => { if (!d.error) setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pt-16 flex">
      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 z-30 w-60 bg-gray-900 text-white flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Admin Panel</p>
              <p className="text-xs text-gray-400">{user?.email || "Administrator"}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => { setActiveNav(label); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 ${activeNav === label ? "bg-green-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {label === "Verifications" && (
                <span className="ml-auto w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">37</span>
              )}
              {label === "Reports" && (
                <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">8</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-3 border-t border-gray-700">
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-gray-800 transition-colors">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Main */}
      <main className="flex-1 lg:ml-60 min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search users, properties, reports..."
              className="w-full max-w-md pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">A</div>
        </div>

        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{activeNav === "Overview" ? "Admin Dashboard" : activeNav}</h1>
            <p className="text-gray-500 text-sm">Platform overview and management</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Properties", value: data?.stats.totalProperties, icon: Building2, color: "bg-blue-100 text-blue-600" },
              { label: "Total Users", value: data?.stats.totalUsers, icon: Users, color: "bg-green-100 text-green-600" },
              { label: "Pending Verifications", value: data?.stats.pendingVerifications, icon: BadgeCheck, color: "bg-amber-100 text-amber-600" },
              { label: "Total Bookings", value: data?.stats.totalBookings, icon: AlertTriangle, color: "bg-purple-100 text-purple-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
                  <Icon className="w-4 h-4" />
                </div>
                {loading ? (
                  <div className="h-7 w-14 bg-gray-200 rounded animate-pulse mb-1" />
                ) : (
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{value?.toLocaleString() ?? "0"}</p>
                )}
                <p className="text-xs text-gray-500 leading-tight">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Main Table */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
                <div className="flex gap-1">
                  {(["properties", "users", "verifications"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${activeTab === tab ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-100"}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>

              {/* Properties Tab */}
              {activeTab === "properties" && (
                <div className="divide-y divide-gray-100">
                  {loading ? (
                    <div className="p-6 text-center text-sm text-gray-400 animate-pulse">Loading...</div>
                  ) : !data?.recentProperties?.length ? (
                    <div className="p-8 text-center text-sm text-gray-400">No properties yet</div>
                  ) : data.recentProperties.map((p) => (
                    <div key={p._id} className="flex items-center gap-3 p-3 sm:p-4">
                      <img src={p.images?.[0]} alt={p.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm truncate">{p.title}</p>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-green-500" />{p.location.city}, {p.location.state}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={p.verified ? "success" : "warning"} className="text-xs">
                            {p.verified ? "Verified" : "Pending"}
                          </Badge>
                          <span className="text-xs text-gray-500">{formatPrice(p.price)}/mo</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 hover:bg-green-50 text-green-600 rounded-lg transition-colors">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <Link href={`/properties/${p._id}`}>
                          <button className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                        </Link>
                        <button className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Users Tab */}
              {activeTab === "users" && (
                <div className="divide-y divide-gray-100">
                  {loading ? (
                    <div className="p-6 text-center text-sm text-gray-400 animate-pulse">Loading...</div>
                  ) : !data?.recentUsers?.length ? (
                    <div className="p-8 text-center text-sm text-gray-400">No users yet</div>
                  ) : data.recentUsers.map((u) => (
                    <div key={u._id} className="flex items-center gap-3 p-3 sm:p-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center font-bold text-green-700 text-sm flex-shrink-0">
                        {u.name?.[0] ?? "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant={u.role === "landlord" ? "info" : "default"} className="text-xs capitalize">{u.role}</Badge>
                          <Badge variant={u.verified ? "success" : "warning"} className="text-xs">{u.verified ? "Verified" : "Unverified"}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <span className="text-xs text-gray-400 hidden sm:block">
                          {new Date(u.createdAt).toLocaleDateString("en-GH", { month: "short", day: "numeric" })}
                        </span>
                        <div className="relative">
                          <button
                            onClick={() => setActiveMenu(activeMenu === u._id ? null : u._id)}
                            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                          </button>
                          {activeMenu === u._id && (
                            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-10 py-1">
                              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                <Eye className="w-3.5 h-3.5" /> View Profile
                              </button>
                              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50">
                                <CheckCircle className="w-3.5 h-3.5" /> Verify
                              </button>
                              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-amber-600 hover:bg-amber-50">
                                <XCircle className="w-3.5 h-3.5" /> Suspend
                              </button>
                              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                                <Trash2 className="w-3.5 h-3.5" /> Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Verifications Tab */}
              {activeTab === "verifications" && (
                <div className="divide-y divide-gray-100">
                  {pendingVerifications.map((v) => (
                    <div key={v.id} className="flex items-center gap-3 p-3 sm:p-4">
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-700 flex-shrink-0">
                        {v.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm">{v.name}</p>
                        <p className="text-xs text-gray-500 truncate">{v.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="warning" className="text-xs">{v.type} Verification</Badge>
                          <span className="text-xs text-gray-400">{v.submitted}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button className="px-2.5 py-1.5 bg-green-100 text-green-700 hover:bg-green-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button className="px-2.5 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1">
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sidebar panels */}
            <div className="space-y-4">
              {/* Quick Actions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Actions</h3>
                <div className="space-y-2">
                  {[
                    { label: "Add Admin User", icon: Users, color: "text-blue-600 bg-blue-50" },
                    { label: "Verify Property", icon: BadgeCheck, color: "text-green-600 bg-green-50" },
                    { label: "Send Announcement", icon: Bell, color: "text-purple-600 bg-purple-50" },
                    { label: "Export Reports", icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
                  ].map(({ label, icon: Icon, color }) => (
                    <button
                      key={label}
                      className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                      <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 flex-1">{label}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">Recent Activity</h3>
                <div className="space-y-3">
                  {[
                    { text: "New landlord registered", time: "2 min ago", color: "bg-green-500" },
                    { text: "Property #1284 verified", time: "15 min ago", color: "bg-blue-500" },
                    { text: "Report resolved", time: "1h ago", color: "bg-amber-500" },
                    { text: "User account suspended", time: "2h ago", color: "bg-red-500" },
                    { text: "New property listing", time: "3h ago", color: "bg-green-500" },
                  ].map(({ text, time, color }, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className={`w-2 h-2 rounded-full ${color} mt-1.5 flex-shrink-0`} />
                      <div>
                        <p className="text-sm text-gray-700">{text}</p>
                        <p className="text-xs text-gray-400">{time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Health */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 sm:p-5">
                <h3 className="font-bold text-gray-900 mb-3 text-sm">System Health</h3>
                <div className="space-y-3">
                  {[
                    { label: "Database", value: 98, color: "bg-green-500" },
                    { label: "API Response", value: 94, color: "bg-green-500" },
                    { label: "Storage", value: 67, color: "bg-amber-500" },
                    { label: "Email Service", value: 100, color: "bg-green-500" },
                  ].map(({ label, value, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{label}</span>
                        <span className={`font-semibold ${value >= 90 ? "text-green-600" : "text-amber-600"}`}>{value}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className={`${color} h-1.5 rounded-full transition-all`} style={{ width: `${value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
