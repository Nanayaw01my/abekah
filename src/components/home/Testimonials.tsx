"use client";

import { motion } from "framer-motion";
import { Quote, Shield } from "lucide-react";
import Link from "next/link";
import { StarRating } from "@/components/ui/StarRating";

const testimonials = [
  {
    name: "Abena Owusu",
    role: "University Student",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    rating: 5,
    text: "This platform helped me find a great apartment in just 2 days. No agent stress, no scams!",
    location: "East Legon, Accra",
  },
  {
    name: "Kwame Asante",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    rating: 5,
    text: "I found a verified 2-bedroom in Madina within days. Direct contact with the landlord made everything smooth.",
    location: "Madina, Accra",
  },
  {
    name: "Akosua Mensah",
    role: "Nurse",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    rating: 4,
    text: "No hidden fees, no agent commission. I paid exactly what I saw on the listing. Highly recommend!",
    location: "West Legon, Accra",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* What Users Say */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3">
                What Users Say
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Real stories from real tenants</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
              {testimonials.slice(0, 2).map(({ name, role, avatar, rating, text, location }, i) => (
                <motion.div
                  key={name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative"
                >
                  <Quote className="absolute top-4 right-4 w-6 h-6 text-green-100" />
                  <div className="flex items-center gap-3 mb-3">
                    <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">{name}</p>
                      <p className="text-xs text-gray-500">{role} · {location}</p>
                    </div>
                  </div>
                  <StarRating rating={rating} size="sm" />
                  <p className="mt-2 text-gray-600 text-sm leading-relaxed">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Report & Stay Safe */}
          <div className="flex flex-col gap-4">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative"
            >
              <Quote className="absolute top-4 right-4 w-6 h-6 text-green-100" />
              <div className="flex items-center gap-3 mb-3">
                <img src={testimonials[2].avatar} alt={testimonials[2].name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{testimonials[2].name}</p>
                  <p className="text-xs text-gray-500">{testimonials[2].role} · {testimonials[2].location}</p>
                </div>
              </div>
              <StarRating rating={testimonials[2].rating} size="sm" />
              <p className="mt-2 text-gray-600 text-sm leading-relaxed">{testimonials[2].text}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="bg-green-50 border border-green-100 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">Report &amp; Stay Safe</p>
                  <p className="text-xs text-gray-500">Help us keep the platform safe</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 mb-3">Found a suspicious listing? Help us keep the platform safe for everyone.</p>
              <Link href="/contact">
                <button className="w-full flex items-center justify-center gap-2 bg-white border border-green-200 text-green-700 text-sm font-semibold py-2.5 rounded-xl hover:bg-green-600 hover:text-white hover:border-green-600 transition-colors">
                  <Shield className="w-4 h-4" />
                  Report Listing
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
