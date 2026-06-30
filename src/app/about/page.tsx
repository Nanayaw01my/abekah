import { BadgeCheck, Users, Building2, Globe, Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const team = [
  {
    name: "James Osei",
    role: "CEO & Co-founder",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    bio: "Former real estate agent with 15 years of experience, passionate about making renting fair and transparent.",
  },
  {
    name: "Amara Mensah",
    role: "CTO",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    bio: "Software engineer with expertise in scalable platforms. Built tech at Airbnb and Zillow.",
  },
  {
    name: "David Park",
    role: "Head of Design",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200",
    bio: "UX designer focused on creating intuitive, beautiful experiences for complex real estate workflows.",
  },
  {
    name: "Priya Kumar",
    role: "Head of Operations",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200",
    bio: "Operations expert ensuring every listing is verified and every user gets an amazing experience.",
  },
];

const values = [
  { icon: BadgeCheck, title: "Transparency", desc: "No hidden fees. No surprises. What you see is what you get, every time." },
  { icon: Users, title: "Community", desc: "We believe in building trust between landlords and tenants through verified profiles." },
  { icon: Heart, title: "Accessibility", desc: "Finding a great home should be available to everyone, regardless of background." },
  { icon: Globe, title: "Innovation", desc: "We use technology to make the rental process faster, fairer, and more efficient." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 py-24">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-white mb-6">
            Making renting simple,<br />transparent, and fair
          </h1>
          <p className="text-xl text-green-100 max-w-2xl mx-auto mb-8">
            RentFinder was founded with a simple mission: connect tenants and landlords directly,
            remove middlemen, and make the rental process as straightforward as it should be.
          </p>
          <Link href="/properties">
            <Button variant="secondary" size="xl" className="bg-white text-green-700 hover:bg-green-50 border-0">
              Find Your Home Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Story */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
                Our Story
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Born from frustration, built with passion
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  In 2022, our founders were searching for apartments in New York and kept running
                  into the same problems: listings with fake photos, hidden fees, unresponsive
                  landlords, and agents taking huge commissions.
                </p>
                <p>
                  They decided there had to be a better way. RentFinder was born — a platform where
                  every listing is verified by a real human, landlords and tenants communicate
                  directly, and all costs are completely transparent.
                </p>
                <p>
                  Today, we serve over 120,000 tenants and 15,000 verified landlords across 42 major
                  cities. Our mission hasn't changed: make finding a home simple, safe, and fair for
                  everyone.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800"
                alt="Beautiful apartment"
                className="rounded-3xl w-full object-cover aspect-square shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-xl border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-2xl text-gray-900">50,000+</p>
                    <p className="text-gray-500 text-sm">Verified Listings</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Our values</h2>
            <p className="text-gray-500 text-lg">The principles that guide everything we do</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Meet the team</h2>
            <p className="text-gray-500 text-lg">The people behind RentFinder</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map(({ name, role, avatar, bio }) => (
              <div key={name} className="text-center">
                <img
                  src={avatar}
                  alt={name}
                  className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 ring-4 ring-green-50"
                />
                <h3 className="font-bold text-gray-900">{name}</h3>
                <p className="text-green-600 text-sm font-medium mb-2">{role}</p>
                <p className="text-gray-500 text-sm leading-relaxed">{bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
