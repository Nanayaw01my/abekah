"use client";

import { motion } from "framer-motion";
import { Users, BadgeCheck, Home, Star, Shield } from "lucide-react";

const stats = [
  { value: "10K+", label: "Happy Users", icon: Users, color: "bg-green-100 text-green-600" },
  { value: "2K+", label: "Verified Landlords", icon: BadgeCheck, color: "bg-blue-100 text-blue-600" },
  { value: "5K+", label: "Properties Listed", icon: Home, color: "bg-amber-100 text-amber-600" },
  { value: "4.8", label: "Average Rating", icon: Star, color: "bg-purple-100 text-purple-600" },
  { value: "100%", label: "Safe & Verified", icon: Shield, color: "bg-rose-100 text-rose-600" },
];

export function StatsSection() {
  return (
    <section className="py-14 bg-green-600">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-2xl sm:text-3xl font-bold text-white mb-2"
          >
            Trusted by Thousands
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-green-100"
          >
            Ghana&apos;s fastest growing rental platform
          </motion.p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map(({ value, label, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 text-center border border-white/20"
            >
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mx-auto mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-white">{value}</p>
              <p className="text-green-200 text-xs mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
