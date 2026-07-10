"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Heart, Search, Calendar, MessageSquare, Bell, Settings,
  LogOut, LayoutDashboard, User, MapPin, Bed, Bath, Menu, X,
  Home, SlidersHorizontal, Save, Mail, Lock, Eye, EyeOff,
  Trash2, CheckCircle, Clock, AlertCircle, Send,
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
  landlord?: { _id: string; name: string; phone?: string };
}

interface Booking {
  _id: string;
  property: { _id: string; title: string; location: { city: string }; images: string[] };
  landlord: { name: string; phone?: string };
  date: string;
  time: string;
  status: string;
  type: string;
}

interface Convo {
  _id: string;
  property: { _id: string; title: string; location: { city: string } };
  participants: { _id: string; name: string; role: string }[];
  lastMessage?: string;
  unreadCount: number;
  messages: { _id: string; sender: string; content: string; createdAt: string }[];
}

export default function TenantDashboardPage() {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("Browse Properties");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Browse
  const [properties, setProperties] = useState<Property[]>([]);
  const [loadingProps, setLoadingProps] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Saved
  const [savedProps, setSavedProps] = useState<Property[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Appointments
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Messages
  const [convos, setConvos] = useState<Convo[]>([]);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const [activeConvo, setActiveConvo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);

  // Profile
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: "", location: "", bio: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Settings
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [settingsSaved, setSettingsSaved] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("rf_token") : null;
  const authHeader = { Authorization: `Bearer ${token}` };

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "T";

  // Load properties
  useEffect(() => {
    fetch("/api/properties?limit=20&sortBy=newest")
      .then((r) => r.json())
      .then((d) => { setProperties(d.data || []); setLoadingProps(false); })
      .catch(() => setLoadingProps(false));
  }, []);

  // Load saved when tab active
  useEffect(() => {
    if (activeNav !== "Saved" || !token) return;
    setLoadingSaved(true);
    fetch("/api/tenant/saved", { headers: authHeader })
      .then(r => r.json())
      .then(d => {
        const props = d.data || [];
        setSavedProps(props);
        setSavedIds(new Set(props.map((p: Property) => p._id)));
      })
      .catch(() => {})
      .finally(() => setLoadingSaved(false));
  }, [activeNav]);

  // Load bookings when tab active
  useEffect(() => {
    if (activeNav !== "Appointments" || !token) return;
    setLoadingBookings(true);
    fetch("/api/tenant/bookings", { headers: authHeader })
      .then(r => r.json())
      .then(d => setBookings(d.data || []))
      .catch(() => {})
      .finally(() => setLoadingBookings(false));
  }, [activeNav]);

  // Load messages when tab active
  useEffect(() => {
    if (activeNav !== "Messages" || !token) return;
    setLoadingMsgs(true);
    fetch("/api/tenant/messages", { headers: authHeader })
      .then(r => r.json())
      .then(d => setConvos(d.data || []))
      .catch(() => {})
      .finally(() => setLoadingMsgs(false));
  }, [activeNav]);

  const toggleSave = useCallback(async (propertyId: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (!token) return;
    const isSaved = savedIds.has(propertyId);
    const action = isSaved ? "remove" : "add";
    setSavedIds(prev => { const s = new Set(prev); isSaved ? s.delete(propertyId) : s.add(propertyId); return s; });
    await fetch("/api/tenant/saved", {
      method: "POST",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ propertyId, action }),
    }).catch(() => {});
  }, [savedIds, token]);

  const sendReply = async (convoId: string) => {
    if (!replyText.trim() || !token) return;
    setSendingMsg(true);
    const res = await fetch("/api/tenant/messages", {
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

  const handleProfileSave = async () => {
    setProfileSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setProfileSaving(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const filtered = properties.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.city.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type === typeFilter;
    return matchSearch && matchType;
  });

  const totalUnread = convos.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

  const PropertyCard = ({ p }: { p: Property }) => (
    <Link href={`/properties/${p._id}`}>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer">
        <div className="relative">
          <img src={p.images?.[0] || "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400"} alt={p.title} className="w-full h-44 object-cover" />
          <div className="absolute top-3 left-3">
            <Badge variant={p.status === "available" ? "success" : "warning"} className="capitalize text-xs">{p.status}</Badge>
          </div>
          <button onClick={(e) => toggleSave(p._id, e)}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
            <Heart className={`w-4 h-4 ${savedIds.has(p._id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm truncate">{p.title}</h3>
          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
            <MapPin className="w-3 h-3 text-green-500 flex-shrink-0" />
            {p.location.neighborhood ? `${p.location.neighborhood}, ` : ""}{p.location.city}
          </p>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{p.bedrooms} bed</span>
            <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms} bath</span>
            {p.features?.furnished && <span className="text-green-600">Furnished</span>}
          </div>
          <div className="flex items-center justify-between mt-3">
            <p className="font-bold text-gray-900">{formatPrice(p.price)}<span className="text-xs text-gray-400 font-normal">/mo</span></p>
            <span className="text-xs text-gray-400 capitalize">{p.type}</span>
          </div>
        </div>
      </div>
    </Link>
  );

  const EmptyState = ({ icon: Icon, title, sub, action, actionLabel }: { icon: React.ElementType; title: string; sub: string; action?: () => void; actionLabel?: string }) => (
    <div className="text-center py-16">
      <Icon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
      <p className="text-gray-500 font-medium">{title}</p>
      <p className="text-sm text-gray-400 mt-1">{sub}</p>
      {action && <Button className="mt-4" onClick={action}>{actionLabel}</Button>}
    </div>
  );

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
          <button key={label} onClick={() => { setActiveNav(label); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors mb-1 ${activeNav === label ? "bg-green-50 text-green-700" : "text-gray-600 hover:bg-gray-50"}`}>
            <Icon className="w-4 h-4" />
            {label}
            {label === "Saved" && savedIds.size > 0 && (
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{savedIds.size}</span>
            )}
            {label === "Messages" && totalUnread > 0 && (
              <span className="ml-auto w-2 h-2 bg-green-500 rounded-full" />
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
          <div className="w-8" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8">

          {/* BROWSE PROPERTIES */}
          {activeNav === "Browse Properties" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Good {new Date().getHours() < 12 ? "Morning" : new Date().getHours() < 17 ? "Afternoon" : "Evening"}, {user?.name?.split(" ")[0] || "there"} 👋
                </h1>
                <p className="text-gray-500 text-sm mt-0.5">Browse available properties for rent across Ghana</p>
              </div>
              <div className="flex gap-3 mb-5 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or city..."
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div className="relative">
                  <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                    className="pl-9 pr-8 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white appearance-none">
                    <option value="all">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="room">Single Room</option>
                    <option value="studio">Self Contain / Studio</option>
                    <option value="house">House</option>
                    <option value="townhouse">Chamber & Hall</option>
                  </select>
                </div>
              </div>
              {!loadingProps && <p className="text-sm text-gray-500 mb-4">{filtered.length} {filtered.length === 1 ? "property" : "properties"} available</p>}
              {loadingProps ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                      <div className="h-44 bg-gray-200" />
                      <div className="p-4 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-100 rounded w-1/2" /></div>
                    </div>
                  ))}
                </div>
              ) : filtered.length === 0 ? (
                <EmptyState icon={Home} title="No properties found" sub="Try a different search or filter" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.map(p => <PropertyCard key={p._id} p={p} />)}
                </div>
              )}
              {!loadingProps && filtered.length > 0 && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg" onClick={() =>
                    fetch("/api/properties?limit=50&sortBy=newest").then(r => r.json()).then(d => setProperties(d.data || []))
                  }>Load More</Button>
                </div>
              )}
            </>
          )}

          {/* SAVED */}
          {activeNav === "Saved" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>
                <p className="text-gray-500 text-sm mt-0.5">Properties you've saved</p>
              </div>
              {loadingSaved ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1,2].map(i => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                      <div className="h-44 bg-gray-200" /><div className="p-4 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4" /></div>
                    </div>
                  ))}
                </div>
              ) : savedProps.length === 0 ? (
                <EmptyState icon={Heart} title="No saved properties yet" sub="Tap the heart on any property to save it here" action={() => setActiveNav("Browse Properties")} actionLabel="Browse Properties" />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedProps.map(p => <PropertyCard key={p._id} p={p} />)}
                </div>
              )}
            </>
          )}

          {/* APPOINTMENTS */}
          {activeNav === "Appointments" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                <p className="text-gray-500 text-sm mt-0.5">Your scheduled property viewings</p>
              </div>
              {loadingBookings ? (
                <div className="space-y-3">{[1,2].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-100 h-28 animate-pulse" />)}</div>
              ) : bookings.length === 0 ? (
                <EmptyState icon={Calendar} title="No appointments yet" sub="Schedule a viewing from any property page" />
              ) : (
                <div className="space-y-4">
                  {bookings.map(b => (
                    <div key={b._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{b.property?.title}</p>
                          <p className="text-sm text-gray-500 mt-0.5">Landlord: {b.landlord?.name}</p>
                          <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-green-500" />{new Date(b.date).toLocaleDateString("en-GH", { day: "numeric", month: "short", year: "numeric" })}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-green-500" />{b.time}</span>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 capitalize">{b.type} visit</p>
                        </div>
                        <Badge variant={b.status === "confirmed" ? "success" : b.status === "cancelled" ? "danger" : "warning"} className="capitalize flex-shrink-0">
                          {b.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* MESSAGES */}
          {activeNav === "Messages" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-500 text-sm mt-0.5">Conversations with landlords</p>
              </div>
              {loadingMsgs ? (
                <div className="space-y-3">{[1,2].map(i => <div key={i} className="bg-white rounded-2xl border border-gray-100 h-24 animate-pulse" />)}</div>
              ) : convos.length === 0 ? (
                <EmptyState icon={MessageSquare} title="No messages yet" sub="Send a message from any property page to start a conversation" />
              ) : (
                <div className="space-y-3">
                  {convos.map(c => {
                    const otherUser = c.participants?.find(p => p.role === "landlord");
                    const isOpen = activeConvo === c._id;
                    return (
                      <div key={c._id} className={`bg-white rounded-2xl border shadow-sm ${c.unreadCount > 0 ? "border-green-200" : "border-gray-100"}`}>
                        <button onClick={() => setActiveConvo(isOpen ? null : c._id)} className="w-full text-left p-5">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                              {otherUser?.name?.split(" ").map(n => n[0]).join("").slice(0, 2) || "L"}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="font-semibold text-gray-900 text-sm">{otherUser?.name || "Landlord"}</p>
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
                                placeholder="Type a message..." className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
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

          {/* PROFILE */}
          {activeNav === "Profile" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                <p className="text-gray-500 text-sm mt-0.5">Manage your personal information</p>
              </div>
              {profileSaved && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Profile updated successfully!
                </div>
              )}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl">{initials}</div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{user?.role} Account</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5"><Mail className="w-3.5 h-3.5" />{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {[
                    { label: "Full Name", key: "name", placeholder: "Your full name" },
                    { label: "Phone Number", key: "phone", placeholder: "+233 24 000 0000" },
                    { label: "Location", key: "location", placeholder: "e.g. East Legon, Accra" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">{label}</label>
                      <input value={profileForm[key as keyof typeof profileForm]} placeholder={placeholder}
                        onChange={e => setProfileForm({ ...profileForm, [key]: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Bio</label>
                    <textarea value={profileForm.bio} onChange={e => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Tell landlords about yourself..." rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                  </div>
                </div>
                <Button onClick={handleProfileSave} disabled={profileSaving} className="mt-5 w-full">
                  <Save className="w-4 h-4" />{profileSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}

          {/* NOTIFICATIONS */}
          {activeNav === "Notifications" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-500 text-sm mt-0.5">Your recent activity and alerts</p>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
                <Bell className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No notifications yet</p>
                <p className="text-sm text-gray-400 mt-1">You'll be notified about messages, appointments, and property updates here</p>
              </div>
            </>
          )}

          {/* SETTINGS */}
          {activeNav === "Settings" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-gray-500 text-sm mt-0.5">Manage your account preferences</p>
              </div>
              {settingsSaved && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" /> Settings saved!
                </div>
              )}
              <div className="space-y-4">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Email Notifications", desc: "Receive updates via email", value: emailNotifs, set: setEmailNotifs },
                      { label: "SMS Notifications", desc: "Receive updates via SMS", value: smsNotifs, set: setSmsNotifs },
                    ].map(({ label, desc, value, set }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div><p className="font-medium text-gray-900 text-sm">{label}</p><p className="text-xs text-gray-500">{desc}</p></div>
                        <button onClick={() => { set(!value); setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 2000); }}
                          className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-green-500" : "bg-gray-200"}`}>
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : ""}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-3">
                    {["current", "newPw", "confirm"].map((field, i) => (
                      <div key={field} className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input type={showPassword ? "text" : "password"}
                          placeholder={["Current password", "New password", "Confirm new password"][i]}
                          value={pwForm[field as keyof typeof pwForm]}
                          onChange={e => setPwForm({ ...pwForm, [field]: e.target.value })}
                          className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                        {i === 2 && (
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        )}
                      </div>
                    ))}
                    <Button onClick={async () => { await new Promise(r => setTimeout(r, 500)); setSettingsSaved(true); setTimeout(() => setSettingsSaved(false), 3000); }} className="w-full">Update Password</Button>
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-6">
                  <h3 className="font-bold text-red-600 mb-2">Danger Zone</h3>
                  <p className="text-sm text-gray-500 mb-4">Permanently delete your account and all your data.</p>
                  <Button variant="outline" className="text-red-500 border-red-200 hover:bg-red-50">
                    <Trash2 className="w-4 h-4" /> Delete Account
                  </Button>
                </div>
              </div>
            </>
          )}

        </div>
      </main>
    </div>
  );
}
