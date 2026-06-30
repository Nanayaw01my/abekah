"use client";

import { motion } from "framer-motion";
import { SearchBar } from "@/components/property/SearchBar";
import { BadgeCheck, Star, TrendingUp } from "lucide-react";

const floatingCards = [
  {
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=300",
    title: "Modern Apartment",
    price: "$2,800/mo",
    location: "New York, NY",
    rating: 4.9,
  },
  {
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=300",
    title: "Luxury Villa",
    price: "$8,500/mo",
    location: "Miami, FL",
    rating: 5.0,
  },
  {
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=300",
    title: "Family Home",
    price: "$4,500/mo",
    location: "San Francisco, CA",
    rating: 4.8,
  },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80"
          alt="Modern luxury apartment"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-green-900/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 py-32">
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white text-sm px-4 py-2 rounded-full mb-6"
          >
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span>Over 50,000 verified listings nationwide</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
          >
            Find Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              Perfect
            </span>{" "}
            Rental Home
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-gray-200 leading-relaxed mb-10 max-w-2xl"
          >
            Browse verified rental properties from trusted landlords. No hidden fees. Direct
            communication. Move in with confidence.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <SearchBar />
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap gap-6 mt-10"
          >
            {[
              { value: "50K+", label: "Properties" },
              { value: "120K+", label: "Happy Tenants" },
              { value: "15K+", label: "Verified Landlords" },
              { value: "98%", label: "Satisfaction Rate" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-white">{value}</div>
                <div className="text-sm text-gray-300">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Floating Property Cards */}
        <div className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2 space-y-4">
          {floatingCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 + i * 0.15 }}
              className="bg-white/95 backdrop-blur-md rounded-2xl p-3 flex gap-3 items-center shadow-2xl w-72 border border-white/50"
            >
              <img
                src={card.image}
                alt={card.title}
                className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-0.5">
                  <BadgeCheck className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
                  <span className="text-xs font-medium text-green-600">Verified</span>
                </div>
                <p className="font-semibold text-gray-900 text-sm truncate">{card.title}</p>
                <p className="text-xs text-gray-500 truncate">{card.location}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-green-600 text-sm">{card.price}</span>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-gray-600">{card.rating}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60 text-xs">
        <span>Scroll to explore</span>
        <div className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1 h-1.5 rounded-full bg-white/60"
          />
        </div>
      </div>
    </section>
  );
}
