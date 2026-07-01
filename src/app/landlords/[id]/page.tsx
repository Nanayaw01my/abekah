import { notFound } from "next/navigation";
import Link from "next/link";
import { BadgeCheck, Star, Building2, Phone, Mail, MapPin, ArrowLeft, MessageSquare, Calendar } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";
import { MOCK_PROPERTIES } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

const landlords = [
  {
    id: "l1",
    name: "Kofi Mensah",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300",
    properties: 8,
    rating: 4.9,
    reviews: 47,
    bio: "Professional property manager with 10+ years of experience in residential rentals across Accra. Specialise in apartments and self-contain units in prime locations.",
    specialties: ["Apartments", "Self Contain"],
    location: "West Legon, Accra",
    phone: "+233 24 000 0001",
    email: "kofi@rentfinder.gh",
    joined: "January 2022",
    responseTime: "Within 1 hour",
    verified: true,
  },
  {
    id: "l2",
    name: "Akosua Asante",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300",
    properties: 5,
    rating: 4.7,
    reviews: 32,
    bio: "Real estate investor with residential properties across Greater Accra. All units are well maintained with reliable water and security.",
    specialties: ["Apartments", "Chamber & Hall"],
    location: "East Legon, Accra",
    phone: "+233 24 000 0002",
    email: "akosua@rentfinder.gh",
    joined: "March 2022",
    responseTime: "Within 2 hours",
    verified: true,
  },
  {
    id: "l3",
    name: "Yaw Darko",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300",
    properties: 12,
    rating: 4.2,
    reviews: 11,
    bio: "Landlord with affordable single rooms and self-contain units in Madina. Ideal for students and young professionals.",
    specialties: ["Single Room", "Self Contain"],
    location: "Madina, Accra",
    phone: "+233 24 000 0003",
    email: "yaw@rentfinder.gh",
    joined: "June 2022",
    responseTime: "Same day",
    verified: true,
  },
  {
    id: "l4",
    name: "Abena Osei",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300",
    properties: 6,
    rating: 4.9,
    reviews: 32,
    bio: "Executive property specialist managing furnished studios and apartments in Airport Residential Area. All utilities included.",
    specialties: ["Executive Studios", "Apartments"],
    location: "Airport Residential, Accra",
    phone: "+233 24 000 0004",
    email: "abena@rentfinder.gh",
    joined: "September 2021",
    responseTime: "Within 1 hour",
    verified: true,
  },
  {
    id: "l5",
    name: "Kwame Boateng",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300",
    properties: 9,
    rating: 4.3,
    reviews: 8,
    bio: "Property developer with residential complexes in Tema. New builds with covered parking and 24-hour security.",
    specialties: ["Apartments", "Self Contain"],
    location: "Tema Community 25",
    phone: "+233 24 000 0005",
    email: "kwame@rentfinder.gh",
    joined: "February 2023",
    responseTime: "Within 3 hours",
    verified: true,
  },
  {
    id: "l6",
    name: "Ama Agyei",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300",
    properties: 4,
    rating: 4.1,
    reviews: 7,
    bio: "Friendly landlord with affordable chamber & hall and single room units in Achimota. Safe environment, close to transport.",
    specialties: ["Chamber & Hall", "Single Room"],
    location: "Achimota, Accra",
    phone: "+233 24 000 0006",
    email: "ama@rentfinder.gh",
    joined: "May 2023",
    responseTime: "Same day",
    verified: true,
  },
];

const reviews = [
  { name: "Kwame Asante", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80", rating: 5, text: "Very responsive and professional. The property was exactly as described. Would definitely rent again.", date: "Dec 2024" },
  { name: "Abena Owusu", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80", rating: 4, text: "Good landlord, quick to fix issues. Property well maintained.", date: "Nov 2024" },
  { name: "Kofi Boateng", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80", rating: 5, text: "Honest and fair. No hidden charges. Highly recommend.", date: "Oct 2024" },
];

export default async function LandlordProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const landlord = landlords.find((l) => l.id === id);
  if (!landlord) notFound();

  const landlordProperties = MOCK_PROPERTIES.filter((p) => p.landlord._id === landlord.id);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Back */}
        <Link href="/landlords" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to Landlords
        </Link>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sm:p-8 mb-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <div className="relative flex-shrink-0">
              <img src={landlord.avatar} alt={landlord.name} className="w-24 h-24 rounded-2xl object-cover" />
              {landlord.verified && (
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-green-600 rounded-full flex items-center justify-center border-2 border-white">
                  <BadgeCheck className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{landlord.name}</h1>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin className="w-4 h-4 text-green-500" />
                    <span className="text-gray-500 text-sm">{landlord.location}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating rating={landlord.rating} size="sm" />
                    <span className="text-sm font-medium text-gray-700">{landlord.rating}</span>
                    <span className="text-sm text-gray-400">({landlord.reviews} reviews)</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <a href={`tel:${landlord.phone}`}>
                    <Button size="sm" className="gap-2">
                      <Phone className="w-4 h-4" /> Call
                    </Button>
                  </a>
                  <a href={`mailto:${landlord.email}`}>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Mail className="w-4 h-4" /> Email
                    </Button>
                  </a>
                </div>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mt-4">{landlord.bio}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {landlord.specialties.map((s) => (
                  <span key={s} className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-100">{s}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-100">
            {[
              { icon: Building2, label: "Properties", value: landlord.properties },
              { icon: Star, label: "Rating", value: landlord.rating },
              { icon: MessageSquare, label: "Reviews", value: landlord.reviews },
              { icon: Calendar, label: "Response", value: landlord.responseTime },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="text-center">
                <Icon className="w-5 h-5 text-green-600 mx-auto mb-1" />
                <p className="font-bold text-gray-900 text-sm">{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Properties */}
        {landlordProperties.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
            <h2 className="font-bold text-gray-900 text-lg mb-4">Listed Properties</h2>
            <div className="space-y-4">
              {landlordProperties.map((p) => (
                <Link key={p._id} href={`/properties/${p._id}`}>
                  <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors border border-gray-100">
                    <img src={p.images[0]} alt={p.title} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm truncate">{p.title}</p>
                      <p className="text-xs text-gray-500">{p.location.neighborhood}, {p.location.city}</p>
                      <p className="text-sm font-bold text-green-600 mt-0.5">{formatPrice(p.price)}<span className="text-xs text-gray-400 font-normal">/mo</span></p>
                    </div>
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${p.status === "available" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {p.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Reviews */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">Tenant Reviews</h2>
          <div className="space-y-4">
            {reviews.map(({ name, avatar, rating, text, date }) => (
              <div key={name} className="flex gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900 text-sm">{name}</p>
                    <span className="text-xs text-gray-400">{date}</span>
                  </div>
                  <StarRating rating={rating} size="sm" />
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
