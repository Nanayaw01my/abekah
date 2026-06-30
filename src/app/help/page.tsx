"use client";

import { useState } from "react";
import { Search, ChevronDown, ChevronUp, MessageCircle, Phone, Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        q: "How do I create an account?",
        a: "Click the 'Sign Up' button in the top right corner. You can register with your email, Google, or Facebook account. Choose whether you're a tenant or landlord and complete your profile.",
      },
      {
        q: "Is RentFinder free to use?",
        a: "Yes! Searching and browsing properties is completely free for tenants. Landlords can list up to 3 properties on our free plan. Premium plans offer additional features for both tenants and landlords.",
      },
    ],
  },
  {
    category: "For Tenants",
    questions: [
      {
        q: "How do I know if a listing is legitimate?",
        a: "All properties on RentFinder are manually verified by our team. Look for the green 'Verified' badge on listings. We check photos, pricing, and landlord credentials before any listing goes live.",
      },
      {
        q: "How do I schedule a property viewing?",
        a: "On any property page, click 'Schedule Viewing'. Choose your preferred date and time, select in-person or virtual viewing, and your request is sent directly to the landlord. You'll receive confirmation within 24 hours.",
      },
      {
        q: "Can I save properties to compare later?",
        a: "Yes! Click the heart icon on any property card to save it to your favorites. Access your saved properties from your tenant dashboard. You can save unlimited properties on the Premium plan.",
      },
    ],
  },
  {
    category: "For Landlords",
    questions: [
      {
        q: "How do I list my property?",
        a: "Create a landlord account, go to your dashboard, and click 'Add Property'. Fill in property details, upload photos, set your price, and submit for verification. Most listings are approved within 24 hours.",
      },
      {
        q: "How does landlord verification work?",
        a: "We verify your identity, property ownership, and contact information. The process typically takes 24-48 hours. Verified landlords get a badge on their profile and listings, increasing tenant trust.",
      },
      {
        q: "How much does it cost to list?",
        a: "The basic plan allows up to 3 listings for $29/month. Our Pro plan at $79/month supports unlimited listings with premium placement and advanced analytics.",
      },
    ],
  },
  {
    category: "Payments & Safety",
    questions: [
      {
        q: "Does RentFinder handle rent payments?",
        a: "Currently, RentFinder connects tenants with landlords for direct communication. Payments are arranged directly between parties. We're building an integrated payment feature — stay tuned!",
      },
      {
        q: "How do I report a suspicious listing?",
        a: "Click the 'Report' button on any listing page. Our team reviews all reports within 24 hours and takes immediate action on confirmed fraudulent listings.",
      },
    ],
  },
];

export default function HelpPage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = faqs.map((cat) => ({
    ...cat,
    questions: cat.questions.filter(
      (q) =>
        !search ||
        q.q.toLowerCase().includes(search.toLowerCase()) ||
        q.a.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.questions.length > 0);

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      {/* Hero */}
      <div className="bg-gradient-to-br from-green-600 to-emerald-700 py-16">
        <div className="max-w-[1280px] mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">How can we help?</h1>
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for answers..."
              className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-300 shadow-lg text-base"
            />
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQs */}
          <div className="lg:col-span-2 space-y-8">
            {filtered.map((cat) => (
              <div key={cat.category}>
                <h2 className="text-xl font-bold text-gray-900 mb-4">{cat.category}</h2>
                <div className="space-y-3">
                  {cat.questions.map(({ q, a }) => (
                    <div key={q} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                      <button
                        onClick={() => setOpen(open === q ? null : q)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-semibold text-gray-900 pr-4">{q}</span>
                        {open === q ? (
                          <ChevronUp className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </button>
                      {open === q && (
                        <div className="px-5 pb-5">
                          <div className="h-px bg-gray-100 mb-4" />
                          <p className="text-gray-600 leading-relaxed">{a}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No results found for "{search}"</p>
                <Button variant="outline" className="mt-4" onClick={() => setSearch("")}>
                  Clear search
                </Button>
              </div>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900">Still need help?</h2>
            {[
              { icon: MessageCircle, title: "Live Chat", desc: "Chat with our team in real-time", action: "Start Chat", href: "#" },
              { icon: Mail, title: "Email Us", desc: "hello@rentfinder.com", action: "Send Email", href: "mailto:hello@rentfinder.com" },
              { icon: Phone, title: "Call Us", desc: "+1 (800) 555-RENT", action: "Call Now", href: "tel:+18005557368" },
            ].map(({ icon: Icon, title, desc, action, href }) => (
              <div key={title} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-0.5">{title}</p>
                    <p className="text-sm text-gray-500 mb-3">{desc}</p>
                    <a href={href}>
                      <Button variant="outline" size="sm">{action}</Button>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
