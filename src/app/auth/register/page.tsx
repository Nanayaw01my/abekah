"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, User, Phone, Building2, ArrowRight, Home, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const defaultRole = (searchParams.get("role") as "tenant" | "landlord") || "tenant";
  const [role, setRole] = useState<"tenant" | "landlord">(defaultRole);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (step === 1) {
      setStep(2);
      return;
    }
    setLoading(true);
    const result = await register({ ...form, role });
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    if (role === "landlord") router.push("/dashboard/landlord");
    else router.push("/dashboard/tenant");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Form side */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10 lg:py-12">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-200">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl text-gray-900">RentFinder</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {/* Steps */}
            <div className="flex items-center gap-3 mb-6">
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0", step >= 1 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500")}>1</div>
              <div className={cn("flex-1 h-1 rounded-full transition-colors", step >= 2 ? "bg-green-600" : "bg-gray-200")} />
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0", step >= 2 ? "bg-green-600 text-white" : "bg-gray-200 text-gray-500")}>2</div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm mb-6">
              {step === 1 ? "Choose your account type to get started" : "Fill in your personal details"}
            </p>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setRole("tenant")}
                      className={cn("p-4 rounded-2xl border-2 text-left transition-all", role === "tenant" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300")}
                    >
                      <Home className={cn("w-6 h-6 mb-2", role === "tenant" ? "text-green-600" : "text-gray-400")} />
                      <p className="font-semibold text-gray-900 text-sm">Tenant</p>
                      <p className="text-xs text-gray-500 mt-0.5">I'm looking for a rental</p>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole("landlord")}
                      className={cn("p-4 rounded-2xl border-2 text-left transition-all", role === "landlord" ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300")}
                    >
                      <Building2 className={cn("w-6 h-6 mb-2", role === "landlord" ? "text-green-600" : "text-gray-400")} />
                      <p className="font-semibold text-gray-900 text-sm">Landlord</p>
                      <p className="text-xs text-gray-500 mt-0.5">I'm listing a property</p>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                      <svg viewBox="0 0 24 24" className="w-4 h-4">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Google
                    </button>
                    <button type="button" className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700">
                      <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#1877F2]">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      Facebook
                    </button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-white px-3 text-gray-500">or register with email</span>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <Input
                    label="Full Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Smith"
                    icon={<User className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    icon={<Mail className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="Phone Number (optional)"
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 555 000 0000"
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <Input
                    label="Password"
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="At least 6 characters"
                    icon={<Lock className="w-4 h-4" />}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    By registering, you agree to our{" "}
                    <Link href="/terms" className="text-green-600">Terms</Link> and{" "}
                    <Link href="/privacy" className="text-green-600">Privacy Policy</Link>.
                  </p>
                </>
              )}

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                {step === 1 ? "Continue" : "Create Account"} <ArrowRight className="w-4 h-4" />
              </Button>

              {step === 2 && (
                <button type="button" onClick={() => setStep(1)} className="w-full text-sm text-gray-500 hover:text-gray-700 text-center py-1">
                  ← Go back
                </button>
              )}
            </form>

            <p className="text-center text-sm text-gray-500 mt-5">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-green-600 font-semibold hover:text-green-700">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Visual side — hidden on small screens */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200" alt="Property" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 to-green-600/40" />
        <div className="relative z-10 flex flex-col justify-end p-10 text-white">
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[{ v: "50K+", l: "Properties" }, { v: "Free", l: "To Join" }, { v: "15K+", l: "Landlords" }, { v: "98%", l: "Satisfaction" }].map(({ v, l }) => (
              <div key={l} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <p className="text-2xl font-bold">{v}</p>
                <p className="text-green-200 text-sm">{l}</p>
              </div>
            ))}
          </div>
          <h2 className="text-2xl font-bold">Join thousands finding their perfect home</h2>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
