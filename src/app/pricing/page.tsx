import { BadgeCheck, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for tenants searching for their next home",
    features: [
      "Browse unlimited properties",
      "Save up to 5 favorites",
      "Basic search filters",
      "Contact landlords via platform",
      "Mobile app access",
    ],
    cta: "Get Started Free",
    href: "/auth/register",
    highlighted: false,
  },
  {
    name: "Premium",
    price: 19,
    description: "For serious tenants who want priority access",
    features: [
      "Everything in Free",
      "Unlimited saved properties",
      "Advanced filters",
      "Priority listing alerts",
      "AI recommendations",
      "Chat priority response",
      "Background check badge",
      "Early access to new listings",
    ],
    cta: "Start Premium",
    href: "/auth/register?plan=premium",
    highlighted: true,
  },
  {
    name: "Landlord Basic",
    price: 29,
    description: "For landlords with one or two properties",
    features: [
      "List up to 3 properties",
      "Verified landlord badge",
      "Tenant inquiries management",
      "Basic analytics",
      "Email notifications",
    ],
    cta: "List Properties",
    href: "/auth/register?role=landlord",
    highlighted: false,
  },
  {
    name: "Landlord Pro",
    price: 79,
    description: "For professional property managers",
    features: [
      "Unlimited property listings",
      "Premium placement in search",
      "Full analytics dashboard",
      "Availability calendar",
      "Bulk import/export",
      "Dedicated account manager",
      "Priority support",
      "API access",
    ],
    cta: "Go Pro",
    href: "/auth/register?role=landlord&plan=pro",
    highlighted: false,
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
            Pricing
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-gray-500 max-w-xl mx-auto">
            Choose the plan that works for you. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map(({ name, price, description, features, cta, href, highlighted }) => (
            <div
              key={name}
              className={`rounded-3xl p-6 relative ${
                highlighted
                  ? "bg-green-600 text-white shadow-2xl shadow-green-200 scale-105"
                  : "bg-white border border-gray-100 shadow-sm"
              }`}
            >
              {highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-gray-900 text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className={`font-bold text-lg mb-1 ${highlighted ? "text-white" : "text-gray-900"}`}>
                {name}
              </h3>
              <p className={`text-sm mb-4 ${highlighted ? "text-green-100" : "text-gray-500"}`}>
                {description}
              </p>
              <div className="mb-6">
                <span className={`text-4xl font-bold ${highlighted ? "text-white" : "text-gray-900"}`}>
                  ${price}
                </span>
                <span className={`text-sm ${highlighted ? "text-green-200" : "text-gray-500"}`}>/month</span>
              </div>
              <ul className="space-y-2.5 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <BadgeCheck className={`w-4 h-4 flex-shrink-0 mt-0.5 ${highlighted ? "text-green-200" : "text-green-500"}`} />
                    <span className={highlighted ? "text-green-50" : "text-gray-600"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link href={href}>
                <Button
                  className="w-full"
                  variant={highlighted ? "secondary" : "primary"}
                  style={highlighted ? { background: "white", color: "#16A34A" } : undefined}
                >
                  {cta} <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-500">All plans come with a 14-day free trial. No credit card required.</p>
          <p className="text-gray-500 mt-1">
            Have questions?{" "}
            <Link href="/contact" className="text-green-600 font-medium hover:text-green-700">
              Contact our team
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
