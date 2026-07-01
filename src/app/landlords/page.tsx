import { BadgeCheck, Star, Building2, ArrowRight, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { StarRating } from "@/components/ui/StarRating";

const landlords = [
  { id: "l1", name: "Kofi Mensah", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200", properties: 8, rating: 4.9, reviews: 47, bio: "Professional property manager with 10+ years of experience in residential rentals across Accra.", specialties: ["Apartments", "Self Contain"], location: "West Legon, Accra", phone: "+233 24 000 0001" },
  { id: "l2", name: "Akosua Asante", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200", properties: 5, rating: 4.7, reviews: 32, bio: "Real estate investor with residential properties across Greater Accra. All units well maintained.", specialties: ["Apartments", "Chamber & Hall"], location: "East Legon, Accra", phone: "+233 24 000 0002" },
  { id: "l3", name: "Yaw Darko", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200", properties: 12, rating: 4.2, reviews: 11, bio: "Landlord with affordable single room and self-contain units in Madina. Ideal for students.", specialties: ["Single Room", "Self Contain"], location: "Madina, Accra", phone: "+233 24 000 0003" },
  { id: "l4", name: "Abena Osei", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200", properties: 6, rating: 4.9, reviews: 32, bio: "Executive property specialist in Airport Residential. All utilities included.", specialties: ["Executive Studios", "Apartments"], location: "Airport Residential, Accra", phone: "+233 24 000 0004" },
  { id: "l5", name: "Kwame Boateng", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200", properties: 9, rating: 4.3, reviews: 8, bio: "Property developer with residential complexes in Tema. New builds with parking and security.", specialties: ["Apartments", "Self Contain"], location: "Tema Community 25", phone: "+233 24 000 0005" },
  { id: "l6", name: "Ama Agyei", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200", properties: 4, rating: 4.1, reviews: 7, bio: "Friendly landlord with affordable chamber & hall and single rooms in Achimota.", specialties: ["Chamber & Hall", "Single Room"], location: "Achimota, Accra", phone: "+233 24 000 0006" },
];

export default function LandlordsPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Verified Landlords
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Meet our trusted landlords
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            All landlords on RentFinder are identity-verified and professionally vetted.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {landlords.map((landlord) => (
            <div
              key={landlord.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="relative">
                  <img
                    src={landlord.avatar}
                    alt={landlord.name}
                    className="w-16 h-16 rounded-2xl object-cover"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                    <BadgeCheck className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{landlord.name}</h3>
                  <p className="text-xs text-gray-500 mb-1">{landlord.location}</p>
                  <div className="flex items-center gap-1.5">
                    <StarRating rating={landlord.rating} size="sm" />
                    <span className="text-xs text-gray-600 font-medium">{landlord.rating}</span>
                    <span className="text-xs text-gray-400">({landlord.reviews})</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">{landlord.bio}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-green-500" />
                  {landlord.properties} properties
                </span>
                <div className="flex gap-1.5">
                  {landlord.specialties.map((s) => (
                    <span key={s} className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Link href={`/landlords/${landlord.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    View Profile <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <a href={`tel:${landlord.phone}`}>
                  <Button variant="ghost" size="icon" className="border border-gray-200 hover:bg-gray-50">
                    <Phone className="w-4 h-4 text-gray-600" />
                  </Button>
                </a>
                <a href={`mailto:${landlord.id}@rentfinder.com`}>
                  <Button variant="ghost" size="icon" className="border border-gray-200 hover:bg-gray-50">
                    <Mail className="w-4 h-4 text-gray-600" />
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Become a landlord CTA */}
        <div className="mt-16 bg-gradient-to-br from-green-600 to-emerald-700 rounded-3xl p-10 text-center text-white">
          <Building2 className="w-12 h-12 text-green-200 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">Are you a landlord?</h2>
          <p className="text-green-100 max-w-lg mx-auto mb-6">
            Join 2,000+ verified landlords who trust Rental Property Finder to fill their properties with quality tenants. List your first property for free.
          </p>
          <Link href="/auth/register?role=landlord">
            <Button variant="secondary" size="xl" className="bg-white text-green-700 hover:bg-green-50 border-0">
              List Your Property <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
