"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tenant CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 p-10 text-white"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Find Your Perfect Home</h3>
              <p className="text-green-100 leading-relaxed mb-6">
                Join over 120,000 tenants who found their dream rental through RentFinder.
                Start your search today — it&apos;s completely free.
              </p>
              <Link href="/properties">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-white text-green-700 hover:bg-green-50 border-0"
                >
                  Start Searching <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Landlord CTA */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 to-gray-800 p-10 text-white"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                <Building2 className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">List Your Property</h3>
              <p className="text-gray-300 leading-relaxed mb-6">
                Reach thousands of qualified tenants. List your property in minutes, get
                verified, and fill vacancies faster than ever before.
              </p>
              <Link href="/auth/register?role=landlord">
                <Button
                  variant="secondary"
                  size="lg"
                  className="bg-green-600 text-white hover:bg-green-700 border-0 shadow-lg shadow-green-900/30"
                >
                  List Your Property <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
