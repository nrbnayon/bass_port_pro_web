"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  Search,
  Home,
  MapPin,
  Heart,
  FileText,
  MessageSquare,
} from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "#home", icon: Home },
  { label: "Lakes", href: "#lakes", icon: MapPin },
  { label: "BassPorn", href: "#catches", icon: Heart },
  { label: "Reports", href: "#reports", icon: FileText },
  { label: "Contact", href: "#footer", icon: MessageSquare },
];

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      // If at the very top, always show "home" as active
      if (window.scrollY < 100) {
        setActiveSection("home");
        return;
      }

      // Check if scrolled to the bottom
      const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 50;
      if (isBottom) {
        setActiveSection("footer");
        return;
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -40% 0px", // Improved sensitivity
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    window.addEventListener("scroll", handleScroll);

    navLinks.forEach((link) => {
      const element = document.querySelector(link.href);
      if (element) observer.observe(element);
    });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[100] bg-[#1C365D]/80 py-4 text-white backdrop-blur-md transition-all duration-300">
      <div className="container-1620 flex items-center justify-between gap-4">
        <Link href="#home" className="flex items-center gap-2">
          <Image
            src="/icons/logo.png"
            alt="BassPort"
            width={160}
            height={48}
            style={{ height: "auto" }}
            className="w-32 md:w-40"
            priority
          />
        </Link>

        <div className="hidden lg:flex flex-1 items-center justify-center gap-6">
          <nav className="flex items-center gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.href.replace("#", "");
              
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setActiveSection(item.href.replace("#", ""))}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    isActive 
                      ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" 
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="relative ml-4 w-full max-w-[280px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
            <input
              type="text"
              placeholder="Search lakes, species..."
              className="w-full rounded-lg border border-white/10 bg-white/10 py-2 pl-10 pr-4 text-sm text-white placeholder:text-white/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/50"
            />
          </div>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <Link
            href="/signin"
            className="text-sm font-semibold text-white/80 transition hover:text-white"
          >
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            Join Free
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 text-white lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="mt-4 border-t border-white/10 bg-[#112640]/95 px-6 py-5 backdrop-blur-lg lg:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.href.replace("#", "");
              
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition ${
                    isActive ? "bg-primary text-white" : "text-white/90 hover:bg-white/10"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}

            <div className="mt-4 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/50" />
                <input
                  type="text"
                  placeholder="Search lakes..."
                  className="w-full rounded-lg border border-white/10 bg-white/10 py-2 pl-10 pr-4 text-sm text-white focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/signin"
                  className="flex-1 rounded-lg border border-white/25 px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-semibold text-white"
                >
                  Join Free
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
