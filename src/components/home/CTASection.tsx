"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Smartphone } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tenant CTA */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-600 to-emerald-700 p-8 sm:p-10 text-white"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-5">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9,22 9,12 15,12 15,22" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-3">Find Your Perfect Home</h3>
              <p className="text-green-100 leading-relaxed mb-6 text-sm">
                Join thousands of tenants who found their rental through us. Start your search today — it&apos;s completely free.
              </p>
              <Link href="/properties">
                <button className="flex items-center gap-2 bg-white text-green-700 font-semibold px-6 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm">
                  Start Searching <ArrowRight className="w-4 h-4" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* App Download */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl bg-gray-900 p-8 sm:p-10 text-white"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/3 translate-x-1/3" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-5">
                <Smartphone className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Available On</h3>
              <p className="text-gray-300 leading-relaxed mb-6 text-sm">
                Download the Rental Property Finder app and search for properties on the go.
              </p>
              <div className="flex gap-3 flex-wrap">
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M3.18 23.76c.37.21.8.24 1.19.09l11.6-6.65-2.62-2.62-10.17 9.18zM20.55 9.93l-2.69-1.54L15.12 12l2.74 2.61 2.71-1.55c.77-.44.77-1.69-.02-2.13zM1.77.36C1.5.64 1.33 1.06 1.33 1.6v20.8c0 .54.17.96.44 1.24l.07.06 11.65-11.65v-.27L1.84.29l-.07.07zM14.97 8.61L3.37 1.96l-.07-.04 10.04 9.06 1.63-2.37z"/></svg>
                  Google Play
                </button>
                <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors text-sm">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.15-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.73M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  App Store
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
