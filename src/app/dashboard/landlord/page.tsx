"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2, Plus, Eye, MessageSquare, Calendar, TrendingUp,
  Edit2, Trash2, BadgeCheck, MoreVertical, Bell, Settings,
  LogOut, LayoutDashboard, List, Users, Star, Menu, X, MapPin,
  Send, CheckCircle, Upload,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatPrice } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { icon: LayoutDashboard, label: "Overview" },
  { icon: Plus, label: "Post Property" },
  { icon: List, label: "My Properties" },
  { icon: MessageSquare, label: "Messages" },
  { icon: Calendar, label: "Bookings" },
  { icon: Users, label: "Tenants" },
  { icon: TrendingUp, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

const PROPERTY_TYPES = ["apartment", "house", "studio", "room", "townhouse", "condo"];
const GHANA_CITIES = ["Accra", "Kumasi", "Tema", "Takoradi", "Cape Coast", "Tamale"];
const AMENITIES = ["Water", "Electricity", "Security", "Parking", "Internet", "Air Conditioning", "Furnished", "Generator"];

interface Property {
  _id: string;
  title: string;
  price: number;
  status: string;
  views: number;
  images: string[];
  location: { city: string; state: string };
}

interface Convo {
  _id: string;
  property: { _id: string; title: string; location: { city: string } };
  participants: { _id: string; name: string; role: string }[];
  lastMessage?: string;
  unreadCount: number;
  messages: { _id: string; sender: string; content: string; createdAt: string }[];
}

interface Booking {
  _id: string;
  property: { _id: string; title: string; location: { city: string }; images: string[] };
  tenant: { _id: string; name: string; phone?: string; email?: string };
  date: string;
  time: string;
  status: string;
  type: string;
}

export default function LandlordDashboardPage() {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [myProperties, setMyProperties] = useState<Property[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [convos, setConvos] = useState<Convo[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [activeConvo, setActiveConvo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);
  const [postError, setPostError] = useState("");
  const [posting, setPosting] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("rf_token") : null;
  const authHeader = { Authorization: `Bearer ${token}` };

  const [form, setForm] = useState({
    title: "", type: "apartment", price: "", city: "Accra", state: "Greater Accra",
    address: "", neighborhood: "", bedrooms: "1", bathrooms: "1", area: "",
    description: "", amenities: [] as string[], imageUrls: "",
    furnished: false, parking: false, security: false, water: true, electricity: true,
  });

  useEffect(() => {
    if (!token) { setLoadingProps(false); return; }
    fetch("/api/dashboard/landlord", { headers: authHeader })
      .then(r => r.json())
      .then(d => { if (d && !d.error) setMyProperties(d.myProperties || []); })
      .catch(() => {})
      .finally(() => setLoadingProps(false));
  }, []);

  useEffect(() => {
    if (activeNav !== "Messages" || !token) return;
    setLoadingMsgs(true);
    fetch("/api/landlord/messages", { headers: authHeader })
      .then(r => r.json())
      .then(d => setConvos(d.data || []))
      .catch(() => {})
      .finally(() => setLoadingMsgs(false));
  }, [activeNav]);

  useEffect(() => {
    if (activeNav !== "Bookings" || !token) return;
    setLoadingBookings(true);
    fetch("/api/landlord/bookings", { headers: authHeader })
      .then(r => r.json())
      .then(d => setBookings(d.data || []))
      .catch(() => {})
      .finally(() => setLoadingBookings(false));
  }, [activeNav]);

  const toggleAmenity = (a: string) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    const token = localStorage.getItem("rf_token");
    const images = form.imageUrls.split("\n").map((u) => u.trim()).filter(Boolean);
    const body = {
      title: form.title,
      type: form.type,
      price: Number(form.price),
      priceType: "monthly",
      location: { address: form.address, city: form.city, state: form.state, country: "Ghana", neighborhood: form.neighborhood },
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      area: Number(form.area) || 0,
      description: form.description,
      images,
      amenities: form.amenities,
      features: { furnished: form.furnished, parking: form.parking, security: form.security, water: form.water, electricity: form.electricity },
    };
    setPostError("");
    try {
      const res = await fetch("/api/properties", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setPostSuccess(true);
        setForm({ title: "", type: "apartment", price: "", city: "Accra", state: "Greater Accra", address: "", neighborhood: "", bedrooms: "1", bathrooms: "1", area: "", description: "", amenities: [], imageUrls: "", furnished: false, parking: false, security: false, water: true, electricity: true });
        setTimeout(() => setPostSuccess(false), 5000);
      } else {
        const d = await res.json().catch(() => ({}));
        setPostError(d.error || "Failed to post property. Please try again.");
      }
    } catch {
      setPostError("Network error. Please check your connection.");
    }
    setPosting(false);
  };

  const sendReply = async (convoId: string) => {
    if (!replyText.trim() || !token) return;
    setSendingMsg(true);
    const res = await fetch("/api/landlord/messages", {
      method: "POST",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: convoId, content: replyText }),
    }).catch(() => null);
    if (res?.ok) {
      const data = await res.json();
      setConvos(prev => prev.map(c => c._id === convoId
        ? { ...c, messages: [...c.messages, data.data], lastMessage: replyText }
        : c));
      setReplyText("");
    }
    setSendingMsg(false);
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    if (!token) return;
    const res = await fetch("/api/landlord/bookings", {
      method: "PATCH",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId, status }),
    }).catch(() => null);
    if (res?.ok) {
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status } : b));
    }
  };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "L";
  const unreadCount = convos.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const sidebarInner = (
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
            {label === "Messages" && unreadCount > 0 && (
              <span className="ml-auto w-5 h-5 bg-green-600 text-white text-xs rounded-full flex items-center justify-center">{unreadCount}</span>
            )}
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

      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 fixed left-0 top-20 bottom-0 overflow-y-auto">
        {sidebarInner}
      </aside>

      <main className="flex-1 lg:ml-64 min-w-0">
        <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-lg hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-bold text-gray-900">{activeNav}</span>
          <button onClick={() => setActiveNav("Post Property")} className="p-2 bg-green-600 rounded-lg">
            <Plus className="w-4 h-4 text-white" />
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* ── OVERVIEW ── */}
          {activeNav === "Overview" && (
            <>
              <div className="hidden lg:flex items-center justify-between mb-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Welcome, {user?.name?.split(" ")[0] || "there"} 👋</h1>
                  <p className="text-gray-500 text-sm">Manage your properties and tenant messages</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="relative p-2.5 bg-white rounded-xl border border-gray-200 hover:bg-gray-50">
                    <Bell className="w-5 h-5 text-gray-600" />
                    {unreadCount > 0 && <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-green-500 rounded-full" />}
                  </button>
                  <Button onClick={() => setActiveNav("Post Property")}><Plus className="w-4 h-4" /> Post Property</Button>
                </div>
              </div>

              {/* Quick stat cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                {[
                  { label: "Properties", value: myProperties.length, icon: Building2, color: "bg-blue-100 text-blue-600" },
                  { label: "Unread Messages", value: unreadCount, icon: MessageSquare, color: "bg-green-100 text-green-600" },
                  { label: "Total Views", value: myProperties.reduce((s, p) => s + (p.views || 0), 0), icon: Eye, color: "bg-purple-100 text-purple-600" },
                  { label: "Avg Rating", value: "—", icon: Star, color: "bg-rose-100 text-rose-600" },
                ].map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-center">
                    <div className={`w-9 h-9 rounded-xl ${color} flex items-center justify-center mx-auto mb-2`}><Icon className="w-4 h-4" /></div>
                    <p className="text-xl font-bold text-gray-900">{value}</p>
                    <p className="text-xs text-gray-500">{label}</p>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <button onClick={() => setActiveNav("Post Property")} className="bg-green-600 text-white rounded-2xl p-5 flex items-center gap-4 hover:bg-green-700 transition-colors text-left">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">Post a Property</p>
                    <p className="text-green-100 text-sm">List your property for rent</p>
                  </div>
                </button>
                <button onClick={() => setActiveNav("Messages")} className="bg-white border border-gray-100 rounded-2xl p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors text-left shadow-sm">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">View Messages</p>
                    <p className="text-gray-500 text-sm">{unreadCount} unread from tenants</p>
                  </div>
                </button>
              </div>
            </>
          )}

          {/* ── POST PROPERTY ── */}
          {activeNav === "Post Property" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Post a Property</h1>
                <p className="text-gray-500 text-sm mt-0.5">Fill in the details to list your property for rent</p>
              </div>

              {postSuccess && (
                <div className="mb-5 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-4">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Property posted successfully!</p>
                    <p className="text-sm text-green-600">Your property is now live and visible to tenants.</p>
                  </div>
                </div>
              )}
              {postError && (
                <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4">
                  <span className="font-semibold text-sm">{postError}</span>
                </div>
              )}

              <form onSubmit={handlePost} className="space-y-5">
                {/* Basic Info */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-4">
                  <h2 className="font-bold text-gray-900">Basic Information</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Title *</label>
                    <input
                      required
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      placeholder="e.g. Modern 2-Bedroom Apartment in East Legon"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Type *</label>
                      <select
                        required
                        value={form.type}
                        onChange={(e) => setForm({ ...form, type: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white capitalize"
                      >
                        {PROPERTY_TYPES.map((t) => <option key={t} value={t} className="capitalize">{t}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Monthly Rent (GHC) *</label>
                      <input
                        required
                        type="number"
                        value={form.price}
                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                        placeholder="e.g. 1500"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Bedrooms</label>
                      <select value={form.bedrooms} onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                        {["1","2","3","4","5","6+"].map((n) => <option key={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Bathrooms</label>
                      <select value={form.bathrooms} onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                        {["1","2","3","4+"].map((n) => <option key={n}>{n}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Area (m²)</label>
                      <input type="number" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })}
                        placeholder="e.g. 80"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-4">
                  <h2 className="font-bold text-gray-900 flex items-center gap-2"><MapPin className="w-4 h-4 text-green-600" /> Location</h2>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                      <select required value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                        {GHANA_CITIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Neighborhood</label>
                      <input value={form.neighborhood} onChange={(e) => setForm({ ...form, neighborhood: e.target.value })}
                        placeholder="e.g. East Legon"
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                    <input required value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })}
                      placeholder="e.g. No. 5 Accra New Town Road"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                  <h2 className="font-bold text-gray-900 mb-3">Description *</h2>
                  <textarea
                    required
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="Describe the property — size, condition, nearby facilities, terms, etc."
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  />
                </div>

                {/* Amenities */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                  <h2 className="font-bold text-gray-900 mb-3">Amenities & Features</h2>
                  <div className="flex flex-wrap gap-2">
                    {AMENITIES.map((a) => (
                      <button
                        key={a}
                        type="button"
                        onClick={() => toggleAmenity(a)}
                        className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                          form.amenities.includes(a)
                            ? "bg-green-600 text-white border-green-600"
                            : "border-gray-200 text-gray-600 hover:border-green-300"
                        }`}
                      >
                        {a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Images */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
                  <h2 className="font-bold text-gray-900 mb-1">Property Images</h2>
                  <p className="text-xs text-gray-400 mb-3">Paste image URLs, one per line (e.g. from Unsplash or your image host)</p>
                  <textarea
                    value={form.imageUrls}
                    onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
                    placeholder={"https://images.unsplash.com/photo-xxx\nhttps://..."}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none font-mono text-xs"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" loading={posting}>
                  <Upload className="w-4 h-4" /> Post Property
                </Button>
              </form>
            </>
          )}

          {/* ── MY PROPERTIES ── */}
          {activeNav === "My Properties" && (
            <>
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Properties</h1>
                <Button onClick={() => setActiveNav("Post Property")} size="sm"><Plus className="w-4 h-4" /> Add New</Button>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
                {loadingProps ? (
                  <div className="p-8 text-center text-sm text-gray-400 animate-pulse">Loading...</div>
                ) : myProperties.length === 0 ? (
                  <div className="p-10 text-center">
                    <Building2 className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">No properties yet</p>
                    <button onClick={() => setActiveNav("Post Property")} className="mt-3 inline-block">
                      <Button size="sm">Post Your First Property</Button>
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {myProperties.map((p) => (
                      <div key={p._id} className="p-4 flex items-center gap-3 sm:gap-4">
                        <img src={p.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200"} alt={p.title} className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm truncate">{p.title}</h3>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-green-500" />{p.location.city}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant={p.status === "available" ? "success" : "warning"} className="text-xs capitalize">{p.status}</Badge>
                            <span className="text-xs text-gray-400 flex items-center gap-1"><Eye className="w-3 h-3" /> {p.views ?? 0}</span>
                          </div>
                        </div>
                        <div className="text-right hidden sm:block flex-shrink-0">
                          <p className="font-bold text-gray-900 text-sm">{formatPrice(p.price)}</p>
                          <p className="text-xs text-gray-400">/month</p>
                        </div>
                        <div className="relative flex-shrink-0">
                          <button onClick={() => setActiveMenu(activeMenu === p._id ? null : p._id)} className="p-2 hover:bg-gray-100 rounded-lg">
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>
                          {activeMenu === p._id && (
                            <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-100 rounded-xl shadow-xl z-10 py-1">
                              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"><Edit2 className="w-3.5 h-3.5" /> Edit</button>
                              <Link href={`/properties/${p._id}`}><button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"><Eye className="w-3.5 h-3.5" /> View</button></Link>
                              <button className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* ── MESSAGES ── */}
          {activeNav === "Messages" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-500 text-sm mt-0.5">{unreadCount} unread from tenants</p>
              </div>
              {loadingMsgs ? (
                <div className="space-y-3">{[1,2].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse" />)}</div>
              ) : convos.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">Tenants will message you from your property listings</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {convos.map(c => {
                    const tenant = c.participants?.find(p => p.role === "tenant");
                    const isOpen = activeConvo === c._id;
                    return (
                      <div key={c._id} className={`bg-white rounded-2xl border shadow-sm ${c.unreadCount > 0 ? "border-green-200" : "border-gray-100"}`}>
                        <button onClick={() => setActiveConvo(isOpen ? null : c._id)} className="w-full text-left p-5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                              {tenant?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "T"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-gray-900 text-sm">{tenant?.name || "Tenant"}</p>
                                {c.unreadCount > 0 && <span className="text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">{c.unreadCount}</span>}
                              </div>
                              <p className="text-xs text-gray-500">{c.property?.title}</p>
                              {c.lastMessage && <p className="text-sm text-gray-500 truncate mt-0.5">{c.lastMessage}</p>}
                            </div>
                          </div>
                        </button>
                        {isOpen && (
                          <div className="border-t border-gray-100 px-5 pb-4">
                            <div className="max-h-60 overflow-y-auto py-3 space-y-2">
                              {c.messages.map(m => {
                                const isMine = m.sender?.toString() === (user as unknown as {_id: string})?._id?.toString();
                                return (
                                  <div key={m._id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                                    <div className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${isMine ? "bg-green-500 text-white" : "bg-gray-100 text-gray-800"}`}>
                                      {m.content}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                            <div className="flex gap-2 mt-2">
                              <input value={replyText} onChange={e => setReplyText(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendReply(c._id)}
                                placeholder="Type a reply..." className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                              <Button size="sm" onClick={() => sendReply(c._id)} disabled={sendingMsg}>
                                <Send className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ── BOOKINGS ── */}
          {activeNav === "Bookings" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
                <p className="text-gray-500 text-sm mt-0.5">Viewing requests from tenants</p>
              </div>
              {loadingBookings ? (
                <div className="space-y-3">{[1,2].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-100 h-28 animate-pulse" />)}</div>
              ) : bookings.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No bookings yet</p>
                  <p className="text-sm text-gray-400 mt-1">Tenants will book viewings from your property listings</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.map(b => (
                    <div key={b._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="font-semibold text-gray-900">{b.property?.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">Tenant: {b.tenant?.name}</p>
                          {b.tenant?.phone && <p className="text-xs text-gray-400">{b.tenant.phone}</p>}
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-green-500" />{new Date(b.date).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })}</span>
                            <span>{b.time}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 capitalize">{b.type} visit</p>
                        </div>
                        <Badge variant={b.status === "confirmed" ? "success" : b.status === "cancelled" ? "danger" : "warning"} className="capitalize flex-shrink-0">
                          {b.status}
                        </Badge>
                      </div>
                      {b.status === "pending" && (
                        <div className="flex gap-2 mt-4">
                          <Button size="sm" onClick={() => updateBookingStatus(b._id, "confirmed")}>Confirm</Button>
                          <Button size="sm" variant="outline" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => updateBookingStatus(b._id, "cancelled")}>Decline</Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Other sections */}
          {!["Overview", "Post Property", "My Properties", "Messages", "Bookings"].includes(activeNav) && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-sm">{activeNav} — coming soon</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
