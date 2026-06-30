"use client";

import { motion } from "framer-motion";
import { BadgeCheck, PhoneCall, Clock, Star } from "lucide-react";

const items = [
  {
    icon: BadgeCheck,
    title: "Verified Landlords",
    description: "We verify every landlord to keep you safe.",
    color: "bg-green-100 text-green-600",
  },
  {
    icon: PhoneCall,
    title: "No Commission",
    description: "Connect directly with landlords. No hidden fees.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Clock,
    title: "Save Time",
    description: "Find and compare many properties in one place.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Star,
    title: "Trusted Reviews",
    description: "Read reviews from real tenants before you decide.",
    color: "bg-purple-100 text-purple-600",
  },
];

export function TrustSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2"
          >
            Why Choose Us?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-500 max-w-md mx-auto"
          >
            We make renting in Ghana simple, safe and stress-free.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map(({ icon: Icon, title, description, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-100 shadow-sm text-center hover:shadow-md transition-shadow"
            >
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mx-auto mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base mb-1">{title}</h3>
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
