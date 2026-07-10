"use client";

import { useState, useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import {
  MapPin, Bed, Bath, Maximize2, Car, Heart, BadgeCheck, Phone,
  MessageSquare, Calendar, Share2, ChevronLeft, ChevronRight,
  Wifi, Zap, Droplets, Shield, PawPrint, Sofa, AirVent,
  Dumbbell, Waves, WashingMachine, Eye, Send, CheckCircle,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/context/AuthContext";

interface Property {
  _id: string;
  title: string;
  description: string;
  type: string;
  price: number;
  priceType: string;
  status: string;
  verified: boolean;
  views: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images: string[];
  amenities: string[];
  features: Record<string, boolean>;
  location: { address: string; city: string; state: string; neighborhood?: string };
  landlord?: { _id: string; name: string; avatar?: string; verified?: boolean; phone?: string; bio?: string };
  availableFrom?: string;
  rating: number;
  reviewCount: number;
}

const featureIcons: Record<string, React.ReactNode> = {
  furnished: <Sofa className="w-4 h-4" />,
  parking: <Car className="w-4 h-4" />,
  petFriendly: <PawPrint className="w-4 h-4" />,
  security: <Shield className="w-4 h-4" />,
  water: <Droplets className="w-4 h-4" />,
  electricity: <Zap className="w-4 h-4" />,
  internet: <Wifi className="w-4 h-4" />,
  airConditioning: <AirVent className="w-4 h-4" />,
  gym: <Dumbbell className="w-4 h-4" />,
  pool: <Waves className="w-4 h-4" />,
  laundry: <WashingMachine className="w-4 h-4" />,
};

const featureLabels: Record<string, string> = {
  furnished: "Furnished", parking: "Parking", petFriendly: "Pet Friendly",
  security: "Security", water: "Water Included", electricity: "Electricity",
  internet: "Internet", airConditioning: "Air Conditioning", gym: "Gym",
  pool: "Swimming Pool", laundry: "Laundry",
};

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "amenities">("overview");
  const [showBooking, setShowBooking] = useState(false);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    fetch(`/api/properties/${id}`)
      .then((r) => r.json())
      .then((d) => { setProperty(d.data || d || null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <Link href="/dashboard/tenant"><Button>Browse Properties</Button></Link>
        </div>
      </div>
    );
  }

  const landlord = property.landlord;
  const images = property.images?.length ? property.images : ["https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800"];

  const sendMessage = async () => {
    if (!message.trim()) return;
    if (!user) { setSendError("Please log in to send a message."); return; }
    if (!landlord?._id) { setSendError("Landlord information not available."); return; }
    setSending(true);
    setSendError("");
    const token = localStorage.getItem("rf_token");
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ landlordId: landlord._id, propertyId: property._id, content: message }),
    }).catch(() => null);
    setSending(false);
    if (res?.ok) {
      setSent(true);
      setMessage("");
      setTimeout(() => setSent(false), 4000);
    } else {
      setSendError("Failed to send. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/dashboard/tenant" className="hover:text-green-600">Properties</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative aspect-[16/9]">
                <img src={images[imgIdx]} alt={property.title} className="w-full h-full object-cover" />
                {images.length > 1 && (
                  <>
                    <button onClick={() => setImgIdx((i) => Math.max(0, i - 1))} disabled={imgIdx === 0}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md disabled:opacity-40">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={() => setImgIdx((i) => Math.min(images.length - 1, i + 1))} disabled={imgIdx === images.length - 1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md disabled:opacity-40">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                  {imgIdx + 1} / {images.length}
                </div>
                <button onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-md">
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>
              {images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setImgIdx(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? "border-green-500" : "border-transparent opacity-60 hover:opacity-100"}`}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="success" className="capitalize">{property.type}</Badge>
                    {property.verified && (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                        <BadgeCheck className="w-4 h-4" /> Verified
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye className="w-3.5 h-3.5" /> {property.views ?? 0} views
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{property.location.address}, {property.location.city}</span>
                  </div>
                </div>
                <button className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 flex-shrink-0">
                  <Share2 className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              <div className="flex flex-wrap gap-6 py-4 border-y border-gray-100">
                <div className="flex items-center gap-2 text-gray-700">
                  <Bed className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">{property.bedrooms === 0 ? "Studio" : property.bedrooms}</span>
                  <span className="text-gray-500 text-sm">Bedrooms</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Bath className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">{property.bathrooms}</span>
                  <span className="text-gray-500 text-sm">Bathrooms</span>
                </div>
                {property.area > 0 && (
                  <div className="flex items-center gap-2 text-gray-700">
                    <Maximize2 className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">{property.area}</span>
                    <span className="text-gray-500 text-sm">sqft</span>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-4 border-b border-gray-100">
                {(["overview", "amenities"] as const).map((tab) => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? "border-green-500 text-green-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
                    {tab}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                {activeTab === "overview" && (
                  <p className="text-gray-600 leading-relaxed">{property.description}</p>
                )}
                {activeTab === "amenities" && (
                  <div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(property.features || {}).map(([key, value]) => (
                        <div key={key} className={`flex items-center gap-2.5 p-3 rounded-xl border ${value ? "border-green-200 bg-green-50 text-green-700" : "border-gray-100 bg-gray-50 text-gray-400"}`}>
                          <span className={value ? "text-green-600" : "text-gray-300"}>{featureIcons[key]}</span>
                          <span className="text-sm font-medium">{featureLabels[key] ?? key}</span>
                        </div>
                      ))}
                    </div>
                    {property.amenities?.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Building Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.map((a) => (
                            <span key={a} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">{a}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(property.price)}</span>
                  <span className="text-gray-500 text-sm">/{property.priceType || "month"}</span>
                </div>
                <Badge variant={property.status === "available" ? "success" : "warning"} className="capitalize">
                  {property.status}
                </Badge>
              </div>

              <div className="space-y-3 mb-4">
                <Button className="w-full" size="lg" onClick={() => {
                  const el = document.getElementById("quick-message");
                  el?.scrollIntoView({ behavior: "smooth" });
                  el?.focus();
                }}>
                  <MessageSquare className="w-4 h-4" /> Send Message
                </Button>
                {landlord?.phone && (
                  <div className="grid grid-cols-2 gap-3">
                    <a href={`tel:${landlord.phone}`}>
                      <Button variant="outline" className="w-full"><Phone className="w-4 h-4" /> Call</Button>
                    </a>
                    <a href={`https://wa.me/${landlord.phone.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="w-full text-green-600 border-green-300 hover:bg-green-50">
                        <MessageSquare className="w-4 h-4" /> WhatsApp
                      </Button>
                    </a>
                  </div>
                )}
                <Button variant="secondary" className="w-full" onClick={() => setShowBooking(!showBooking)}>
                  <Calendar className="w-4 h-4" /> Schedule Viewing
                </Button>
              </div>

              {showBooking && (
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm">Book a Viewing</h4>
                  <input type="date" min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                  <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                    <option>Select time</option>
                    <option>9:00 AM</option><option>10:00 AM</option><option>11:00 AM</option>
                    <option>2:00 PM</option><option>3:00 PM</option><option>4:00 PM</option>
                  </select>
                  <Button className="w-full">Confirm Booking</Button>
                </div>
              )}

              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Message Landlord</h4>

                {sent && (
                  <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-3 py-2.5 mb-2 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" /> Message sent! Check your Messages tab.
                  </div>
                )}
                {sendError && (
                  <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-3 py-2.5 mb-2 text-sm">{sendError}</div>
                )}

                <textarea
                  id="quick-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi, I'm interested in this property..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
                <Button
                  className="w-full mt-2"
                  size="sm"
                  onClick={sendMessage}
                  disabled={sending || !message.trim()}
                  loading={sending}
                >
                  <Send className="w-3.5 h-3.5" /> {sending ? "Sending..." : "Send Message"}
                </Button>

                {!user && (
                  <p className="text-xs text-center text-gray-400 mt-2">
                    <Link href="/auth/login" className="text-green-600 font-medium">Log in</Link> to message this landlord
                  </p>
                )}
              </div>
            </div>

            {landlord && (
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">About the Landlord</h3>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-green-100 flex items-center justify-center text-green-700 font-bold text-lg">
                    {landlord.avatar
                      ? <img src={landlord.avatar} alt={landlord.name} className="w-full h-full object-cover" />
                      : landlord.name?.[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-gray-900">{landlord.name}</span>
                      {landlord.verified && <BadgeCheck className="w-4 h-4 text-green-600" />}
                    </div>
                    <span className="text-xs text-gray-500">Landlord</span>
                  </div>
                </div>
                {landlord.bio && <p className="text-sm text-gray-600">{landlord.bio}</p>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
