"use client";

import { motion } from "framer-motion";
import { Search, MessageSquare, Calendar, Key } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: Search,
    title: "Search & Filter",
    description:
      "Use our powerful search to find properties matching your budget, location, and preferences.",
    color: "from-green-400 to-green-600",
  },
  {
    step: "02",
    icon: MessageSquare,
    title: "Contact Landlord",
    description:
      "Message landlords directly through our secure platform. Ask questions and get instant replies.",
    color: "from-blue-400 to-blue-600",
  },
  {
    step: "03",
    icon: Calendar,
    title: "Schedule Viewing",
    description:
      "Book property viewings at your convenience. Virtual tours available for remote applicants.",
    color: "from-purple-400 to-purple-600",
  },
  {
    step: "04",
    icon: Key,
    title: "Move In",
    description:
      "Complete your application, sign the lease digitally, and get your keys. It's that simple!",
    color: "from-amber-400 to-amber-600",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3"
          >
            How It Works
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
          >
            Find your home in 4 simple steps
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-green-300 via-blue-300 via-purple-300 to-amber-300" />

          {steps.map(({ step, icon: Icon, title, description, color }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex flex-col items-center text-center relative"
            >
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg mb-6 relative z-10`}>
                <Icon className="w-8 h-8 text-white" />
                <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center">
                  <span className="text-xs font-bold text-gray-600">{step}</span>
                </div>
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
