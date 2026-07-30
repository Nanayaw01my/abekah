"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Building2, Users, MessageSquare, BadgeCheck, Shield,
  TrendingUp, Settings, LogOut, Bell, Search, Eye, Trash2, CheckCircle,
  XCircle, MoreVertical, AlertTriangle, MapPin, ChevronRight, RefreshCw,
  UserX, Home, AlertOctagon,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

interface DashStats {
  totalProperties: number; totalUsers: number; pendingVerifications: number; totalBookings: number;
}
interface AdminUser {
  _id: string; name: string; email: string; role: string; verified: boolean; suspended?: boolean; createdAt: string; avatar?: string;
}
interface AdminProperty {
  _id: string; title: string; price: number; status: string; verified: boolean; images: string[];
  location: { city: string; state: string }; landlord?: { name: string; email: string };
}

const navItems = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: Building2, label: "Properties" },
  { icon: Users, label: "Users" },
  { icon: BadgeCheck, label: "Verifications" },
  { icon: AlertOctagon, label: "Danger Zone" },
  { icon: MessageSquare, label: "Reports" },
  { icon: TrendingUp, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

function authHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("rf_token") : "";
  return { Authorization: `Bearer ${token}`, "Content-Type": "application/json" };
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Overview");

  // Overview stats
  const [stats, setStats] = useState<DashStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Properties
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [propSearch, setPropSearch] = useState("");
  const [propPage, setPropPage] = useState(1);
  const [propTotal, setPropTotal] = useState(0);
  const [propLoading, setPropLoading] = useState(false);

  // Users
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [userSearch, setUserSearch] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [userTotal, setUserTotal] = useState(0);
  const [userLoading, setUserLoading] = useState(false);

  // Reset
  const [resetScope, setResetScope] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");
  const [resetLoading, setResetLoading] = useState(false);
  const [resetMsg, setResetMsg] = useState("");

  // Toasts
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = (msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const loadStats = useCallback(() => {
    setStatsLoading(true);
    fetch("/api/dashboard/admin", { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { if (d.stats) setStats(d.stats); })
      .finally(() => setStatsLoading(false));
  }, []);

  const loadProperties = useCallback(() => {
    setPropLoading(true);
    const qs = new URLSearchParams({ page: String(propPage), q: propSearch });
    fetch(`/api/admin/properties?${qs}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setProperties(d.properties || []); setPropTotal(d.total || 0); })
      .finally(() => setPropLoading(false));
  }, [propPage, propSearch]);

  const loadUsers = useCallback(() => {
    setUserLoading(true);
    const qs = new URLSearchParams({ page: String(userPage), q: userSearch, role: userRole });
    fetch(`/api/admin/users?${qs}`, { headers: authHeaders() })
      .then((r) => r.json())
      .then((d) => { setUsers(d.users || []); setUserTotal(d.total || 0); })
      .finally(() => setUserLoading(false));
  }, [userPage, userSearch, userRole]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { if (activeNav === "Properties") loadProperties(); }, [activeNav, loadProperties]);
  useEffect(() => { if (activeNav === "Users") loadUsers(); }, [activeNav, loadUsers]);

  const deleteProperty = async (id: string) => {
    if (!confirm("Delete this property?")) return;
    const r = await fetch("/api/admin/properties", { method: "DELETE", headers: authHeaders(), body: JSON.stringify({ id }) });
    if (r.ok) { showToast("Property deleted"); loadProperties(); loadStats(); }
    else showToast("Failed to delete property", "error");
  };

  const verifyProperty = async (id: string, verified: boolean) => {
    const r = await fetch(`/api/properties/${id}`, { method: "PATCH", headers: authHeaders(), body: JSON.stringify({ verified: !verified }) });
    if (r.ok) { showToast(verified ? "Property unverified" : "Property verified"); loadProperties(); }
    else showToast("Action failed", "error");
  };

  const userAction = async (id: string, action: string) => {
    if (action === "delete" && !confirm("Delete this user permanently?")) return;
    const method = action === "delete" ? "DELETE" : "PATCH";
    const body = action === "delete" ? { id } : { id, action };
    const r = await fetch("/api/admin/users", { method, headers: authHeaders(), body: JSON.stringify(body) });
    if (r.ok) { showToast("Done"); setActiveMenu(null); loadUsers(); loadStats(); }
    else showToast("Action failed", "error");
  };

  const handleReset = async () => {
    if (!resetScope) return showToast("Select a reset scope", "error");
    if (resetConfirm !== "RESET") return showToast("Type RESET to confirm", "error");
    setResetLoading(true);
    const r = await fetch("/api/admin/reset", { method: "DELETE", headers: authHeaders(), body: JSON.stringify({ scope: resetScope, confirm: "RESET" }) });
    const d = await r.json();
    setResetLoading(false);
    if (r.ok) { setResetMsg(`Deleted: ${JSON.stringify(d.deleted)}`); setResetConfirm(""); loadStats(); showToast("Reset complete"); }
    else showToast(d.error || "Reset failed", "error");
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16 flex">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg transition-all ${toast.type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"}`}>
          {toast.msg}
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 bottom-0 z-30 w-60 bg-gray-900 text-white flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-bold text-sm">Super Admin</p>
              <p className="text-xs text-gray-400 truncate max-w-[140px]">{user?.email || "Administrator"}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map(({ icon: Icon, label }) => (
            <button
              key={label}
              onClick={() => { setActiveNav(label); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 ${
                activeNav === label
                  ? label === "Danger Zone" ? "bg-red-600 text-white" : "bg-green-600 text-white"
                  : label === "Danger Zone" ? "text-red-400 hover:bg-gray-800 hover:text-red-300" : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
              {label === "Verifications" && stats?.pendingVerifications ? (
                <span className="ml-auto w-5 h-5 bg-amber-500 text-white text-xs rounded-full flex items-center justify-center">{stats.pendingVerifications}</span>
              ) : null}
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

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-20 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <main className="flex-1 lg:ml-60 min-w-0">
        {/* Top bar */}
        <div className="bg-white border-b border-gray-100 px-4 sm:px-6 py-3 flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg">
            <LayoutDashboard className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              placeholder="Search users, properties..."
              className="w-full max-w-md pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const val = (e.target as HTMLInputElement).value;
                  if (activeNav === "Properties") { setPropSearch(val); setPropPage(1); }
                  else if (activeNav === "Users") { setUserSearch(val); setUserPage(1); }
                }
              }}
            />
          </div>
          <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            {stats?.pendingVerifications ? <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" /> : null}
          </button>
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-bold text-sm">A</div>
        </div>

        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{activeNav === "Overview" ? "Admin Dashboard" : activeNav}</h1>
              <p className="text-gray-500 text-sm">Full platform control</p>
            </div>
            <button onClick={loadStats} className="p-2 hover:bg-gray-100 rounded-xl transition-colors" title="Refresh stats">
              <RefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Total Properties", value: stats?.totalProperties, icon: Building2, color: "bg-blue-100 text-blue-600" },
              { label: "Total Users", value: stats?.totalUsers, icon: Users, color: "bg-green-100 text-green-600" },
              { label: "Pending Verifications", value: stats?.pendingVerifications, icon: BadgeCheck, color: "bg-amber-100 text-amber-600" },
              { label: "Total Bookings", value: stats?.totalBookings, icon: AlertTriangle, color: "bg-purple-100 text-purple-600" },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mb-3`}>
                  <Icon className="w-4 h-4" />
                </div>
                {statsLoading ? (
                  <div className="h-7 w-14 bg-gray-200 rounded animate-pulse mb-1" />
                ) : (
                  <p className="text-lg sm:text-xl font-bold text-gray-900">{value?.toLocaleString() ?? "0"}</p>
                )}
                <p className="text-xs text-gray-500 leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* Overview */}
          {activeNav === "Overview" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Manage Properties", desc: "View, verify, delete listings", icon: Building2, nav: "Properties", color: "text-blue-600 bg-blue-50" },
                { label: "Manage Users", desc: "Verify, suspend, delete users", icon: Users, nav: "Users", color: "text-green-600 bg-green-50" },
                { label: "Danger Zone", desc: "Reset platform data", icon: AlertOctagon, nav: "Danger Zone", color: "text-red-600 bg-red-50" },
              ].map(({ label, desc, icon: Icon, nav, color }) => (
                <button key={label} onClick={() => setActiveNav(nav)} className="bg-white rounded-2xl border border-gray-100 p-5 text-left hover:shadow-md transition-shadow flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}><Icon className="w-5 h-5" /></div>
                  <div>
                    <p className="font-semibold text-gray-900">{label}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 ml-auto mt-1" />
                </button>
              ))}
            </div>
          )}

          {/* Properties Tab */}
          {activeNav === "Properties" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={propSearch}
                    onChange={(e) => { setPropSearch(e.target.value); setPropPage(1); }}
                    placeholder="Search properties..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <span className="text-sm text-gray-500">{propTotal} properties</span>
                <button onClick={loadProperties} className="p-2 hover:bg-gray-100 rounded-xl"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
              </div>

              <div className="divide-y divide-gray-100">
                {propLoading ? (
                  <div className="p-8 text-center text-sm text-gray-400 animate-pulse">Loading...</div>
                ) : !properties.length ? (
                  <div className="p-8 text-center text-sm text-gray-400">No properties found</div>
                ) : properties.map((p) => (
                  <div key={p._id} className="flex items-center gap-3 p-3 sm:p-4">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0"><Home className="w-5 h-5 text-gray-400" /></div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{p.title}</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-green-500" />{p.location.city}, {p.location.state}
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant={p.verified ? "success" : "warning"} className="text-xs">{p.verified ? "Verified" : "Pending"}</Badge>
                        <span className="text-xs text-gray-500">{formatPrice(p.price)}/mo</span>
                        {p.landlord && <span className="text-xs text-gray-400">{(p.landlord as { name: string }).name}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => verifyProperty(p._id, p.verified)}
                        className={`p-1.5 rounded-lg transition-colors ${p.verified ? "hover:bg-amber-50 text-amber-500" : "hover:bg-green-50 text-green-600"}`}
                        title={p.verified ? "Unverify" : "Verify"}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <Link href={`/properties/${p._id}`}>
                        <button className="p-1.5 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors"><Eye className="w-4 h-4" /></button>
                      </Link>
                      <button onClick={() => deleteProperty(p._id)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {propTotal > 20 && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                  <button disabled={propPage === 1} onClick={() => setPropPage(p => p - 1)} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40">Previous</button>
                  <span className="text-sm text-gray-500">Page {propPage} of {Math.ceil(propTotal / 20)}</span>
                  <button disabled={propPage >= Math.ceil(propTotal / 20)} onClick={() => setPropPage(p => p + 1)} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40">Next</button>
                </div>
              )}
            </div>
          )}

          {/* Users Tab */}
          {activeNav === "Users" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className="p-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    value={userSearch}
                    onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                    placeholder="Search users..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <select value={userRole} onChange={(e) => { setUserRole(e.target.value); setUserPage(1); }} className="px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none">
                  <option value="">All roles</option>
                  <option value="tenant">Tenants</option>
                  <option value="landlord">Landlords</option>
                  <option value="admin">Admins</option>
                </select>
                <span className="text-sm text-gray-500">{userTotal} users</span>
                <button onClick={loadUsers} className="p-2 hover:bg-gray-100 rounded-xl"><RefreshCw className="w-4 h-4 text-gray-500" /></button>
              </div>

              <div className="divide-y divide-gray-100">
                {userLoading ? (
                  <div className="p-8 text-center text-sm text-gray-400 animate-pulse">Loading...</div>
                ) : !users.length ? (
                  <div className="p-8 text-center text-sm text-gray-400">No users found</div>
                ) : users.map((u) => (
                  <div key={u._id} className="flex items-center gap-3 p-3 sm:p-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${u.suspended ? "bg-red-100 text-red-600" : "bg-green-100 text-green-700"}`}>
                      {u.name?.[0] ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{u.name}</p>
                      <p className="text-xs text-gray-500 truncate">{u.email}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant={u.role === "landlord" ? "info" : u.role === "admin" ? "success" : "default"} className="text-xs capitalize">{u.role}</Badge>
                        <Badge variant={u.verified ? "success" : "warning"} className="text-xs">{u.verified ? "Verified" : "Unverified"}</Badge>
                        {u.suspended && <Badge variant="danger" className="text-xs">Suspended</Badge>}
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
                          <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-xl z-10 py-1">
                            <button onClick={() => userAction(u._id, u.verified ? "unverify" : "verify")} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-green-600 hover:bg-green-50">
                              <CheckCircle className="w-3.5 h-3.5" /> {u.verified ? "Unverify" : "Verify"}
                            </button>
                            <button onClick={() => userAction(u._id, u.suspended ? "unsuspend" : "suspend")} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-amber-600 hover:bg-amber-50">
                              <XCircle className="w-3.5 h-3.5" /> {u.suspended ? "Unsuspend" : "Suspend"}
                            </button>
                            <button onClick={() => userAction(u._id, "delete")} className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {userTotal > 20 && (
                <div className="p-4 border-t border-gray-100 flex items-center justify-between">
                  <button disabled={userPage === 1} onClick={() => setUserPage(p => p - 1)} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40">Previous</button>
                  <span className="text-sm text-gray-500">Page {userPage} of {Math.ceil(userTotal / 20)}</span>
                  <button disabled={userPage >= Math.ceil(userTotal / 20)} onClick={() => setUserPage(p => p + 1)} className="px-3 py-1.5 text-sm border rounded-lg disabled:opacity-40">Next</button>
                </div>
              )}
            </div>
          )}

          {/* Verifications Tab */}
          {activeNav === "Verifications" && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <BadgeCheck className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <p className="font-semibold text-gray-900">Unverified Landlords</p>
              <p className="text-sm text-gray-500 mb-4">Use the Users tab to find and verify landlord accounts.</p>
              <Button onClick={() => { setUserRole("landlord"); setActiveNav("Users"); }} variant="outline">Go to Users</Button>
            </div>
          )}

          {/* Danger Zone */}
          {activeNav === "Danger Zone" && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <AlertOctagon className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800">Danger Zone — Irreversible Actions</p>
                  <p className="text-sm text-red-600 mt-0.5">These actions permanently delete data from the database. There is no undo.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-red-500" /> Reset Platform Data</h2>

                <div className="space-y-3 mb-6">
                  {[
                    { scope: "properties", label: "Delete all properties", desc: "Removes every property listing from the platform", icon: Building2 },
                    { scope: "bookings", label: "Delete all bookings", desc: "Clears all booking records", icon: AlertTriangle },
                    { scope: "tenants", label: "Delete all tenants", desc: "Removes all tenant accounts", icon: Users },
                    { scope: "landlords", label: "Delete all landlords + their properties", desc: "Removes all landlord accounts and their listings", icon: UserX },
                    { scope: "all", label: "FULL RESET — Delete everything", desc: "Wipes all properties, bookings, and non-admin users", icon: RefreshCw },
                  ].map(({ scope, label, desc, icon: Icon }) => (
                    <label
                      key={scope}
                      className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${resetScope === scope ? "border-red-500 bg-red-50" : "border-gray-100 hover:border-red-200"}`}
                    >
                      <input type="radio" name="scope" value={scope} checked={resetScope === scope} onChange={() => setResetScope(scope)} className="accent-red-600" />
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${scope === "all" ? "bg-red-600 text-white" : "bg-red-100 text-red-600"}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className={`font-semibold text-sm ${scope === "all" ? "text-red-700" : "text-gray-900"}`}>{label}</p>
                        <p className="text-xs text-gray-500">{desc}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {resetScope && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Type <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-red-600">RESET</span> to confirm:</p>
                    <input
                      value={resetConfirm}
                      onChange={(e) => setResetConfirm(e.target.value)}
                      placeholder="Type RESET here"
                      className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-red-400 text-sm focus:outline-none font-mono"
                    />
                    <Button
                      onClick={handleReset}
                      loading={resetLoading}
                      disabled={resetConfirm !== "RESET"}
                      className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-40 w-full sm:w-auto"
                    >
                      Execute Reset
                    </Button>
                    {resetMsg && <p className="text-xs text-gray-500 font-mono bg-gray-50 rounded-lg p-2">{resetMsg}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {(activeNav === "Reports" || activeNav === "Analytics" || activeNav === "Settings") && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
              <TrendingUp className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="font-semibold text-gray-700">{activeNav} coming soon</p>
              <p className="text-sm text-gray-400 mt-1">This section is under development.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
