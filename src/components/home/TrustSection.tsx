"use client";

import { motion } from "framer-motion";
import { BadgeCheck, MessageCircle, DollarSign, Zap } from "lucide-react";

const trustItems = [
  {
    icon: BadgeCheck,
    title: "Verified Listings",
    description:
      "Every property is manually verified by our team to ensure accuracy and legitimacy before it goes live.",
    color: "bg-green-100 text-green-600",
    border: "border-green-100",
  },
  {
    icon: MessageCircle,
    title: "Direct Contact",
    description:
      "Message landlords directly through our secure platform. No middlemen, no commission fees.",
    color: "bg-blue-100 text-blue-600",
    border: "border-blue-100",
  },
  {
    icon: DollarSign,
    title: "No Hidden Fees",
    description:
      "What you see is what you pay. Complete pricing transparency with no surprise charges.",
    color: "bg-amber-100 text-amber-600",
    border: "border-amber-100",
  },
  {
    icon: Zap,
    title: "Move In Faster",
    description:
      "Book viewings online, complete applications digitally, and move in up to 3x faster than traditional methods.",
    color: "bg-purple-100 text-purple-600",
    border: "border-purple-100",
  },
];

export function TrustSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4"
          >
            Why Choose RentFinder
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4"
          >
            The smarter way to find your home
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 max-w-xl mx-auto text-lg"
          >
            We've built a platform that puts tenants first, making the rental process transparent,
            fast, and stress-free.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustItems.map(({ icon: Icon, title, description, color, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`bg-white rounded-2xl p-6 border ${border} shadow-sm hover:shadow-md transition-shadow`}
            >
              <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-4`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
