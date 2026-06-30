"use client";

import { useState } from "react";
import Link from "next/link";
import { use } from "react";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Car,
  Heart,
  BadgeCheck,
  Phone,
  MessageSquare,
  Calendar,
  Share2,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Zap,
  Droplets,
  Shield,
  PawPrint,
  Sofa,
  AirVent,
  Dumbbell,
  Waves,
  WashingMachine,
  Star,
  Eye,
  Send,
} from "lucide-react";
import { MOCK_PROPERTIES } from "@/lib/constants";
import { Property } from "@/types";
import { formatPrice, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/ui/StarRating";
import { PropertyCard } from "@/components/property/PropertyCard";

const MOCK_REVIEWS = [
  {
    id: "r1",
    reviewer: {
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      verified: true,
    },
    rating: 5,
    comment:
      "Absolutely fantastic place! The landlord was incredibly responsive and the apartment was exactly as described. The neighborhood is great and I felt safe the entire time.",
    createdAt: "2024-11-15",
  },
  {
    id: "r2",
    reviewer: {
      name: "Maria Santos",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
      verified: true,
    },
    rating: 4,
    comment:
      "Great property overall. The amenities are excellent and maintenance is prompt. Minor issues with noise but overall very satisfied with my stay here.",
    createdAt: "2024-10-22",
  },
];

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const property = MOCK_PROPERTIES.find((p) => p._id === id) as Property | undefined;
  const [imgIdx, setImgIdx] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<"overview" | "amenities" | "reviews">("overview");
  const [showBooking, setShowBooking] = useState(false);
  const [message, setMessage] = useState("");

  if (!property) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h2>
          <Link href="/properties">
            <Button>Browse Properties</Button>
          </Link>
        </div>
      </div>
    );
  }

  const landlord = property.landlord as {
    _id: string;
    name: string;
    avatar?: string;
    verified: boolean;
    phone?: string;
    bio?: string;
  };

  const similar = MOCK_PROPERTIES.filter(
    (p) => p._id !== property._id && p.type === property.type
  ).slice(0, 3) as Property[];

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
    furnished: "Furnished",
    parking: "Parking",
    petFriendly: "Pet Friendly",
    security: "Security",
    water: "Water Included",
    electricity: "Electricity",
    internet: "Internet",
    airConditioning: "Air Conditioning",
    gym: "Gym",
    pool: "Swimming Pool",
    laundry: "Laundry",
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1280px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-green-600">Home</Link>
            <span>/</span>
            <Link href="/properties" className="hover:text-green-600">Properties</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm">
              <div className="relative aspect-[16/9]">
                <img
                  src={property.images[imgIdx]}
                  alt={`${property.title} - Image ${imgIdx + 1}`}
                  className="w-full h-full object-cover"
                />
                {/* Nav buttons */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((i) => Math.max(0, i - 1))}
                      disabled={imgIdx === 0}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md disabled:opacity-40 hover:bg-white transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setImgIdx((i) => Math.min(property.images.length - 1, i + 1))}
                      disabled={imgIdx === property.images.length - 1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md disabled:opacity-40 hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
                  {imgIdx + 1} / {property.images.length}
                </div>
                <button
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md"
                >
                  <Heart className={`w-5 h-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-400"}`} />
                </button>
              </div>
              {/* Thumbnails */}
              {property.images.length > 1 && (
                <div className="flex gap-2 p-3 overflow-x-auto">
                  {property.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`flex-shrink-0 w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${
                        i === imgIdx ? "border-green-500" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
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
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="success" className="capitalize">{property.type}</Badge>
                    {property.verified && (
                      <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                        <BadgeCheck className="w-4 h-4" /> Verified
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <Eye className="w-3.5 h-3.5" /> {property.views} views
                    </span>
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{property.title}</h1>
                  <div className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{property.location.address}, {property.location.city}, {property.location.state}</span>
                  </div>
                </div>
                <button className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                  <Share2 className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Stats */}
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
                <div className="flex items-center gap-2 text-gray-700">
                  <Maximize2 className="w-5 h-5 text-green-500" />
                  <span className="font-semibold">{property.area}</span>
                  <span className="text-gray-500 text-sm">sqft</span>
                </div>
                {property.reviewCount > 0 && (
                  <div className="flex items-center gap-2">
                    <StarRating rating={property.rating} size="sm" />
                    <span className="font-semibold text-gray-700">{property.rating.toFixed(1)}</span>
                    <span className="text-gray-500 text-sm">({property.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex gap-1 mt-4 border-b border-gray-100">
                {(["overview", "amenities", "reviews"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                      activeTab === tab
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab}
                    {tab === "reviews" && ` (${MOCK_REVIEWS.length})`}
                  </button>
                ))}
              </div>

              <div className="pt-4">
                {activeTab === "overview" && (
                  <div>
                    <p className="text-gray-600 leading-relaxed mb-6">{property.description}</p>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Available From</h3>
                      <p className="text-gray-600">{formatDate(property.availableFrom)}</p>
                    </div>
                  </div>
                )}

                {activeTab === "amenities" && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Features & Utilities</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {Object.entries(property.features).map(([key, value]) => (
                        <div
                          key={key}
                          className={`flex items-center gap-2.5 p-3 rounded-xl border ${
                            value
                              ? "border-green-200 bg-green-50 text-green-700"
                              : "border-gray-100 bg-gray-50 text-gray-400"
                          }`}
                        >
                          <span className={value ? "text-green-600" : "text-gray-300"}>
                            {featureIcons[key]}
                          </span>
                          <span className="text-sm font-medium">{featureLabels[key]}</span>
                          {value && (
                            <svg className="w-4 h-4 text-green-500 ml-auto" viewBox="0 0 16 16" fill="none">
                              <path d="M3 8l3.5 3.5 6.5-7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                          )}
                        </div>
                      ))}
                    </div>
                    {property.amenities.length > 0 && (
                      <div className="mt-6">
                        <h3 className="font-semibold text-gray-900 mb-3">Building Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.map((a) => (
                            <span
                              key={a}
                              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium"
                            >
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-4">
                    {MOCK_REVIEWS.map((review) => (
                      <div key={review.id} className="p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={review.reviewer.avatar}
                            alt={review.reviewer.name}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900 text-sm">{review.reviewer.name}</span>
                              {review.reviewer.verified && (
                                <BadgeCheck className="w-4 h-4 text-green-600" />
                              )}
                            </div>
                            <div className="flex items-center gap-2">
                              <StarRating rating={review.rating} size="sm" />
                              <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm leading-relaxed">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Similar Properties */}
            {similar.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Similar Properties</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {similar.map((p) => (
                    <PropertyCard key={p._id} property={p} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Price Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <span className="text-3xl font-bold text-gray-900">{formatPrice(property.price)}</span>
                  <span className="text-gray-500 text-sm">/{property.priceType}</span>
                </div>
                <Badge
                  variant={property.status === "available" ? "success" : "danger"}
                  className="capitalize"
                >
                  {property.status}
                </Badge>
              </div>

              {/* Contact buttons */}
              <div className="space-y-3 mb-4">
                <Button className="w-full" size="lg">
                  <MessageSquare className="w-4 h-4" /> Send Message
                </Button>
                <div className="grid grid-cols-2 gap-3">
                  <a href={`tel:${landlord.phone}`}>
                    <Button variant="outline" className="w-full">
                      <Phone className="w-4 h-4" /> Call
                    </Button>
                  </a>
                  <a href={`https://wa.me/${landlord.phone?.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full text-green-600 border-green-300 hover:bg-green-50">
                      <MessageSquare className="w-4 h-4" /> WhatsApp
                    </Button>
                  </a>
                </div>
                <Button
                  variant="secondary"
                  className="w-full"
                  onClick={() => setShowBooking(!showBooking)}
                >
                  <Calendar className="w-4 h-4" /> Schedule Viewing
                </Button>
              </div>

              {showBooking && (
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm">Book a Viewing</h4>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                  <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                    <option>Select time</option>
                    <option>9:00 AM</option>
                    <option>10:00 AM</option>
                    <option>11:00 AM</option>
                    <option>2:00 PM</option>
                    <option>3:00 PM</option>
                    <option>4:00 PM</option>
                  </select>
                  <select className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none">
                    <option>In-person viewing</option>
                    <option>Virtual tour</option>
                  </select>
                  <Button className="w-full">Confirm Booking</Button>
                </div>
              )}

              {/* Quick message */}
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-semibold text-gray-900 text-sm mb-2">Quick Message</h4>
                <textarea
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Hi, I'm interested in this property..."
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
                <Button className="w-full mt-2" size="sm">
                  <Send className="w-3.5 h-3.5" /> Send
                </Button>
              </div>
            </div>

            {/* Landlord Card */}
            <div className="bg-white rounded-2xl p-5 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4">About the Landlord</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                  {landlord.avatar ? (
                    <img src={landlord.avatar} alt={landlord.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 font-semibold text-lg">
                      {landlord.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-gray-900">{landlord.name}</span>
                    {landlord.verified && <BadgeCheck className="w-4 h-4 text-green-600" />}
                  </div>
                  <span className="text-xs text-gray-500">Verified Landlord</span>
                </div>
              </div>
              {landlord.bio && (
                <p className="text-sm text-gray-600 leading-relaxed">{landlord.bio}</p>
              )}
              <Link href={`/landlords/${landlord._id}`}>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
