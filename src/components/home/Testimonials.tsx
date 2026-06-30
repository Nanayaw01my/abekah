"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { StarRating } from "@/components/ui/StarRating";

const testimonials = [
  {
    name: "Emily Chen",
    role: "Software Engineer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
    rating: 5,
    text: "RentFinder made my apartment hunt so much easier. I found a verified, beautiful place in just 3 days and moved in within 2 weeks. The direct communication with landlords is a game changer.",
    location: "New York, NY",
  },
  {
    name: "Marcus Thompson",
    role: "Marketing Manager",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    rating: 5,
    text: "I was skeptical at first but the verified listings feature gave me so much confidence. No scams, no bait-and-switch. What I saw was exactly what I got. Highly recommended!",
    location: "Los Angeles, CA",
  },
  {
    name: "Priya Sharma",
    role: "Graduate Student",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    rating: 4,
    text: "As a student on a budget, the transparent pricing was so important to me. No surprise fees! I found a great studio apartment and the landlord was super responsive through the chat feature.",
    location: "Austin, TX",
  },
  {
    name: "James Wilson",
    role: "Remote Worker",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    rating: 5,
    text: "The map feature is brilliant. I was relocating from another city and could explore neighborhoods virtually before I even arrived. Found the perfect place near great amenities.",
    location: "Seattle, WA",
  },
  {
    name: "Aisha Okonkwo",
    role: "Nurse",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
    rating: 5,
    text: "The virtual viewing scheduling feature saved me so much time. I could book inspections directly from the app and the landlord was notified instantly. Absolutely seamless experience.",
    location: "Miami, FL",
  },
  {
    name: "Daniel Park",
    role: "Entrepreneur",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    rating: 4,
    text: "I've used many rental platforms and RentFinder is by far the best. The UI is clean, properties are real, and the team actually verifies everything. Worth every penny of the premium plan.",
    location: "San Francisco, CA",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-3"
          >
            Testimonials
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3"
          >
            What our tenants say
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-lg"
          >
            Real stories from real people who found their perfect home.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(({ name, role, avatar, rating, text, location }, i) => (
            <motion.div
              key={name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative"
            >
              <Quote className="absolute top-5 right-5 w-8 h-8 text-green-100" />
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={avatar}
                  alt={name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-green-100"
                />
                <div>
                  <p className="font-semibold text-gray-900">{name}</p>
                  <p className="text-xs text-gray-500">{role} · {location}</p>
                </div>
              </div>
              <StarRating rating={rating} size="sm" />
              <p className="mt-3 text-gray-600 text-sm leading-relaxed">{text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
