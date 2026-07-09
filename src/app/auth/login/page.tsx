"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, User, Phone } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "", email: "", phone: "", password: "", role: "tenant" as "tenant" | "landlord",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(loginForm.email, loginForm.password);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    const stored = localStorage.getItem("rf_user");
    if (stored) {
      const u = JSON.parse(stored);
      router.push(u.role === "admin" ? "/dashboard/admin" : u.role === "landlord" ? "/dashboard/landlord" : "/dashboard/tenant");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await register(registerForm);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    router.push(registerForm.role === "landlord" ? "/dashboard/landlord" : "/dashboard/tenant");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left — Form */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-10">
        <div className="w-full max-w-md">
          <Link href="/" className="flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-200">
              <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
            <span className="font-bold text-gray-900">Rental Property Finder</span>
          </Link>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
            {error && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Login Form */}
            {tab === "login" && (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome Back 👋</h1>
                <p className="text-gray-500 text-sm mb-6">Login to continue</p>
                <form onSubmit={handleLogin} className="space-y-4">
                  <Input
                    label="Email Address"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    placeholder="you@example.com"
                    icon={<Mail className="w-4 h-4" />}
                    required
                  />
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Your password"
                      icon={<Lock className="w-4 h-4" />}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <Link href="/auth/forgot-password" className="text-green-600 hover:text-green-700 text-sm font-medium">Forgot Password?</Link>
                  </div>
                  <Button type="submit" className="w-full" size="lg" loading={loading}>Login</Button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-5">
                  No account?{" "}
                  <button onClick={() => setTab("register")} className="text-green-600 font-semibold hover:text-green-700">Create one</button>
                </p>
              </>
            )}

            {/* Register Form */}
            {tab === "register" && (
              <>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Create Account</h1>
                <p className="text-gray-500 text-sm mb-4">Join as a tenant or landlord</p>

                {/* Role selector */}
                <div className="flex gap-3 mb-5">
                  {(["tenant", "landlord"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRegisterForm({ ...registerForm, role: r })}
                      className={`flex-1 py-2.5 rounded-xl border text-sm font-semibold capitalize transition-colors ${
                        registerForm.role === r
                          ? "bg-green-600 text-white border-green-600"
                          : "border-gray-200 text-gray-500 hover:border-green-300"
                      }`}
                    >
                      {r === "tenant" ? "🏠 I'm a Tenant" : "🏢 I'm a Landlord"}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <Input
                    label="Full Name"
                    type="text"
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    placeholder="Kwame Mensah"
                    icon={<User className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    placeholder="you@example.com"
                    icon={<Mail className="w-4 h-4" />}
                    required
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    value={registerForm.phone}
                    onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                    placeholder="+233 24 000 0000"
                    icon={<Phone className="w-4 h-4" />}
                  />
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? "text" : "password"}
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      placeholder="At least 6 characters"
                      icon={<Lock className="w-4 h-4" />}
                      required
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 bottom-3 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button type="submit" className="w-full" size="lg" loading={loading}>
                    Create {registerForm.role === "landlord" ? "Landlord" : "Tenant"} Account
                  </Button>
                </form>
                <p className="text-center text-sm text-gray-500 mt-5">
                  Already have an account?{" "}
                  <button onClick={() => setTab("login")} className="text-green-600 font-semibold hover:text-green-700">Login</button>
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right — Visual */}
      <div className="hidden lg:flex lg:w-[42%] relative overflow-hidden bg-green-600">
        <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200" alt="Home" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="relative z-10 flex flex-col justify-center items-center p-10 text-white text-center w-full">
          <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center mb-6 border border-white/30">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-white fill-current">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold mb-3">Rental Property Finder</h2>
          <p className="text-green-100 text-lg mb-8">Find verified rental homes across Ghana.</p>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            {[{ v: "5K+", l: "Properties" }, { v: "Free", l: "To Join" }, { v: "2K+", l: "Landlords" }, { v: "Safe", l: "& Verified" }].map(({ v, l }) => (
              <div key={l} className="bg-white/10 rounded-2xl p-4 border border-white/20 text-center">
                <p className="text-xl font-bold">{v}</p>
                <p className="text-green-200 text-xs">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
