"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Map,
  Users,
  Info,
  DollarSign,
  HelpCircle,
  Phone,
  Menu,
  X,
  Bell,
  MessageSquare,
  ChevronDown,
  Building2,
  User,
  LogOut,
  LayoutDashboard,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/properties", label: "Browse", icon: Search },
  { href: "/map", label: "Map", icon: Map },
  { href: "/landlords", label: "Landlords", icon: Users },
  { href: "/about", label: "About", icon: Info },
  { href: "/pricing", label: "Pricing", icon: DollarSign },
  { href: "/help", label: "Help", icon: HelpCircle },
  { href: "/contact", label: "Contact", icon: Phone },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const { user, logout } = useAuth();
  const isLoggedIn = !!user;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled || !isHome
            ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
            : "bg-transparent"
        )}
      >
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
              <div className="w-9 h-9 rounded-xl bg-green-600 flex items-center justify-center shadow-lg shadow-green-200">
                <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div className="hidden sm:block">
                <span
                  className={cn(
                    "font-bold text-base leading-tight transition-colors",
                    scrolled || !isHome ? "text-gray-900" : "text-white"
                  )}
                >
                  Rental Property Finder
                </span>
                <span className="block text-xs text-green-500 font-medium -mt-0.5">
                  Find. Connect. Move In.
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    pathname === href
                      ? "bg-green-100 text-green-700"
                      : scrolled || !isHome
                      ? "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2">
              {isLoggedIn && user ? (
                <>
                  <button
                    className={cn(
                      "relative p-2 rounded-lg transition-colors",
                      scrolled || !isHome
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full" />
                  </button>
                  <button
                    className={cn(
                      "relative p-2 rounded-lg transition-colors",
                      scrolled || !isHome
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-white hover:bg-white/10"
                    )}
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                  <div className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center overflow-hidden">
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                          <User className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    </button>
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <Link
                          href={`/dashboard/${user?.role}`}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <LayoutDashboard className="w-4 h-4" /> Dashboard
                        </Link>
                        <Link
                          href="/favorites"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Heart className="w-4 h-4" /> Saved Properties
                        </Link>
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <User className="w-4 h-4" /> Profile
                        </Link>
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <button onClick={logout} className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 w-full">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button
                      variant={scrolled || !isHome ? "outline" : "ghost"}
                      size="sm"
                      className={
                        !scrolled && isHome
                          ? "text-white border-white/30 hover:bg-white/10 hover:text-white"
                          : ""
                      }
                    >
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">Sign Up</Button>
                  </Link>
                </>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className={cn(
                  "lg:hidden p-2 rounded-lg transition-colors",
                  scrolled || !isHome
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                )}
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-white shadow-2xl">
            <div className="p-6 pt-20">
              <div className="space-y-1">
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                      pathname === href
                        ? "bg-green-50 text-green-700"
                        : "text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </Link>
                ))}
              </div>
              {!isLoggedIn && (
                <div className="mt-6 space-y-3">
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full">
                      Login
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full">Sign Up Free</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
