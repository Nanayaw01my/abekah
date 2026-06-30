"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, MessageCircle, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Contact Us
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">We'd love to hear from you</h1>
          <p className="text-xl text-gray-500 max-w-lg mx-auto">
            Have a question, feedback, or need support? Our team is here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-4">
            {[
              { icon: Mail, title: "Email Us", value: "hello@rentfinder.com", sub: "We reply within 24 hours" },
              { icon: Phone, title: "Call Us", value: "+1 (800) 555-RENT", sub: "Mon-Fri, 9am-6pm EST" },
              { icon: MapPin, title: "Visit Us", value: "123 Property Lane, NY", sub: "New York, NY 10001" },
              { icon: Clock, title: "Business Hours", value: "Mon-Fri: 9am - 6pm", sub: "Sat: 10am - 2pm" },
            ].map(({ icon: Icon, title, value, sub }) => (
              <div key={title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-4">
                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">{title}</p>
                  <p className="text-gray-700 text-sm">{value}</p>
                  <p className="text-gray-400 text-xs">{sub}</p>
                </div>
              </div>
            ))}

            <div className="bg-green-600 rounded-2xl p-5 text-white">
              <MessageCircle className="w-8 h-8 mb-3 text-green-200" />
              <h3 className="font-bold mb-1">Live Chat</h3>
              <p className="text-green-100 text-sm mb-3">Chat with our team in real-time for quick answers.</p>
              <Button variant="secondary" size="sm" className="bg-white text-green-700 hover:bg-green-50 border-0 w-full">
                Start Chat
              </Button>
            </div>

            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <HelpCircle className="w-8 h-8 text-gray-300 mb-3" />
              <h3 className="font-bold text-gray-900 mb-1">Help Center</h3>
              <p className="text-gray-500 text-sm mb-3">Browse our knowledge base for instant answers.</p>
              <a href="/help" className="text-green-600 text-sm font-medium hover:text-green-700">
                Visit Help Center →
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
              {sent ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Message sent!</h3>
                  <p className="text-gray-500">We'll get back to you within 24 hours.</p>
                  <Button onClick={() => setSent(false)} variant="outline" className="mt-6">
                    Send another message
                  </Button>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Input
                        label="Your Name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="John Smith"
                        required
                      />
                      <Input
                        label="Email Address"
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Subject</label>
                      <select
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 appearance-none"
                        required
                      >
                        <option value="">Select a topic</option>
                        <option>General Inquiry</option>
                        <option>Property Listing</option>
                        <option>Account Issue</option>
                        <option>Payment Question</option>
                        <option>Report a Problem</option>
                        <option>Partnership</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                      <textarea
                        rows={6}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Tell us how we can help..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                        required
                      />
                    </div>
                    <Button type="submit" size="lg" loading={loading} className="w-full sm:w-auto">
                      <Send className="w-4 h-4" /> Send Message
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
