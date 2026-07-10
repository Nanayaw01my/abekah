"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart, Search, Calendar, MessageSquare, Bell, Settings,
  LogOut, LayoutDashboard, User, MapPin, Bed, Bath, Menu, X,
  Home, SlidersHorizontal, Save, Phone, Mail, Lock, Eye, EyeOff,
  Trash2, CheckCircle, Clock, AlertCircle,
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
  landlord?: { name: string; phone?: string };
}

export default function TenantDashboardPage() {
  const { user, logout } = useAuth();
  const [activeNav, setActiveNav] = useState("Browse Properties");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [saved, setSaved] = useState<string[]>([]);

  // Profile state
  const [profileForm, setProfileForm] = useState({ name: user?.name || "", phone: "", location: "", bio: "" });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSaved, setProfileSaved] = useState(false);

  // Settings state
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [pwForm, setPwForm] = useState({ current: "", newPw: "", confirm: "" });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Sample appointments
  const appointments = [
    { id: "a1", property: "2-Bedroom Apartment, East Legon", landlord: "Kwame Boateng", date: "2026-07-15", time: "10:00 AM", status: "confirmed" },
    { id: "a2", property: "Self Contain, Madina", landlord: "Abena Owusu", date: "2026-07-18", time: "2:00 PM", status: "pending" },
  ];

  // Sample messages
  const [messages] = useState([
    { id: "m1", landlord: "Kwame Boateng", property: "2-Bedroom Apartment, East Legon", text: "Hello! The apartment is still available. Would you like to schedule a viewing?", time: "2 min ago", read: false },
    { id: "m2", landlord: "Abena Owusu", property: "Self Contain, Madina", text: "Yes, pets are allowed. There's a small deposit required.", time: "1 hr ago", read: true },
  ]);

  // Sample notifications
  const notifications = [
    { id: "n1", icon: CheckCircle, color: "text-green-500", title: "Appointment Confirmed", desc: "Your viewing for East Legon apartment is confirmed for July 15.", time: "5 min ago" },
    { id: "n2", icon: MessageSquare, color: "text-blue-500", title: "New Message", desc: "Kwame Boateng sent you a message about the apartment.", time: "10 min ago" },
    { id: "n3", icon: AlertCircle, color: "text-yellow-500", title: "Property Update", desc: "A property you viewed has reduced its price.", time: "1 hr ago" },
    { id: "n4", icon: Clock, color: "text-gray-400", title: "Reminder", desc: "You have a viewing appointment tomorrow at 10:00 AM.", time: "3 hrs ago" },
  ];

  useEffect(() => {
    fetch("/api/properties?limit=20&sortBy=newest")
      .then((r) => r.json())
      .then((d) => { setProperties(d.data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "T";

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSaved((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const savedProperties = properties.filter((p) => saved.includes(p._id));

  const filtered = properties.filter((p) => {
    const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || p.location.city.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "all" || p.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleProfileSave = async () => {
    setProfileSaving(true);
    await new Promise((r) => setTimeout(r, 700));
    setProfileSaving(false);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const handleSettingsSave = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

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
            <Heart className={`w-4 h-4 ${saved.includes(p._id) ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
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
            {label === "Saved" && saved.length > 0 && (
              <span className="ml-auto text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">{saved.length}</span>
            )}
            {label === "Messages" && messages.filter(m => !m.read).length > 0 && (
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

          {/* ── BROWSE PROPERTIES ── */}
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
              {!loading && <p className="text-sm text-gray-500 mb-4">{filtered.length} {filtered.length === 1 ? "property" : "properties"} available</p>}
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                      <div className="h-44 bg-gray-200" />
                      <div className="p-4 space-y-2"><div className="h-4 bg-gray-200 rounded w-3/4" /><div className="h-3 bg-gray-100 rounded w-1/2" /></div>
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
                  {filtered.map((p) => <PropertyCard key={p._id} p={p} />)}
                </div>
              )}
              {!loading && filtered.length > 0 && (
                <div className="text-center mt-8">
                  <Button variant="outline" size="lg" onClick={() =>
                    fetch("/api/properties?limit=50&sortBy=newest").then(r => r.json()).then(d => setProperties(d.data || []))
                  }>Load More Properties</Button>
                </div>
              )}
            </>
          )}

          {/* ── SAVED ── */}
          {activeNav === "Saved" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Saved Properties</h1>
                <p className="text-gray-500 text-sm mt-0.5">Properties you've hearted</p>
              </div>
              {savedProperties.length === 0 ? (
                <div className="text-center py-16">
                  <Heart className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No saved properties yet</p>
                  <p className="text-sm text-gray-400 mt-1">Tap the heart icon on any property to save it here</p>
                  <Button className="mt-4" onClick={() => setActiveNav("Browse Properties")}>Browse Properties</Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedProperties.map((p) => <PropertyCard key={p._id} p={p} />)}
                </div>
              )}
            </>
          )}

          {/* ── APPOINTMENTS ── */}
          {activeNav === "Appointments" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
                <p className="text-gray-500 text-sm mt-0.5">Your scheduled property viewings</p>
              </div>
              {appointments.length === 0 ? (
                <div className="text-center py-16">
                  <Calendar className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No appointments yet</p>
                  <p className="text-sm text-gray-400 mt-1">Schedule a viewing from any property page</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {appointments.map((a) => (
                    <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-gray-900">{a.property}</p>
                          <p className="text-sm text-gray-500 mt-0.5">Landlord: {a.landlord}</p>
                          <div className="flex items-center gap-3 mt-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-green-500" />{a.date}</span>
                            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-green-500" />{a.time}</span>
                          </div>
                        </div>
                        <Badge variant={a.status === "confirmed" ? "success" : "warning"} className="capitalize flex-shrink-0">
                          {a.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">Cancel</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── MESSAGES ── */}
          {activeNav === "Messages" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
                <p className="text-gray-500 text-sm mt-0.5">Conversations with landlords</p>
              </div>
              {messages.length === 0 ? (
                <div className="text-center py-16">
                  <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No messages yet</p>
                  <p className="text-sm text-gray-400 mt-1">Send a message from any property page</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {messages.map((m) => (
                    <div key={m.id} className={`bg-white rounded-2xl border shadow-sm p-5 ${!m.read ? "border-green-200" : "border-gray-100"}`}>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-sm flex-shrink-0">
                          {m.landlord.split(" ").map(n => n[0]).join("").slice(0, 2)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-gray-900 text-sm">{m.landlord}</p>
                            <span className="text-xs text-gray-400 flex-shrink-0">{m.time}</span>
                          </div>
                          <p className="text-xs text-gray-500 mb-1">{m.property}</p>
                          <p className="text-sm text-gray-700">{m.text}</p>
                          {!m.read && <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">New</span>}
                        </div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <input placeholder="Type a reply..." className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                        <Button size="sm">Send</Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* ── PROFILE ── */}
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
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center text-green-700 font-bold text-2xl">
                    {initials}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{user?.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{user?.role} Account</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5"><Mail className="w-3.5 h-3.5" />{user?.email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Full Name</label>
                    <input value={profileForm.name} onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Phone Number</label>
                    <input value={profileForm.phone} onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                      placeholder="+233 24 000 0000"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Location</label>
                    <input value={profileForm.location} onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                      placeholder="e.g. East Legon, Accra"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5 block">Bio</label>
                    <textarea value={profileForm.bio} onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
                      placeholder="Tell landlords a bit about yourself..." rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none" />
                  </div>
                </div>
                <Button onClick={handleProfileSave} disabled={profileSaving} className="mt-5 w-full">
                  <Save className="w-4 h-4" /> {profileSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </>
          )}

          {/* ── NOTIFICATIONS ── */}
          {activeNav === "Notifications" && (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-500 text-sm mt-0.5">Your recent activity and alerts</p>
              </div>
              <div className="space-y-3">
                {notifications.map((n) => (
                  <div key={n.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-start gap-4">
                    <div className={`mt-0.5 flex-shrink-0 ${n.color}`}>
                      <n.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm">{n.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{n.desc}</p>
                      <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                    </div>
                    <button className="text-gray-300 hover:text-gray-500 flex-shrink-0">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* ── SETTINGS ── */}
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
                {/* Notifications */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Email Notifications", desc: "Receive updates via email", value: emailNotifs, set: setEmailNotifs },
                      { label: "SMS Notifications", desc: "Receive updates via SMS", value: smsNotifs, set: setSmsNotifs },
                    ].map(({ label, desc, value, set }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{label}</p>
                          <p className="text-xs text-gray-500">{desc}</p>
                        </div>
                        <button onClick={() => set(!value)}
                          className={`relative w-11 h-6 rounded-full transition-colors ${value ? "bg-green-500" : "bg-gray-200"}`}>
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${value ? "translate-x-5" : ""}`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                  <h3 className="font-bold text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-3">
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} placeholder="Current password" value={pwForm.current}
                        onChange={(e) => setPwForm({ ...pwForm, current: e.target.value })}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} placeholder="New password" value={pwForm.newPw}
                        onChange={(e) => setPwForm({ ...pwForm, newPw: e.target.value })}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type={showPassword ? "text" : "password"} placeholder="Confirm new password" value={pwForm.confirm}
                        onChange={(e) => setPwForm({ ...pwForm, confirm: e.target.value })}
                        className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    <Button onClick={handleSettingsSave} className="w-full">Update Password</Button>
                  </div>
                </div>

                {/* Danger zone */}
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
