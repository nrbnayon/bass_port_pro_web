"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X, Search, Fish, MapPin, Heart, FileText } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { HugeiconsIcon } from "@hugeicons/react";
import { Mail02Icon } from "@hugeicons/core-free-icons";

type NavLink = {
  label: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ElementType | any;
};

const navLinks: NavLink[] = [
  { label: "Home", href: "#home", icon: Fish },
  { label: "Lakes", href: "#lakes", icon: MapPin },
  { label: "BassPorn", href: "#catches", icon: Heart },
  { label: "Reports", href: "#reports", icon: FileText },
  { label: "Contact", href: "#footer", icon: Mail02Icon },
];

const NavIcon = ({
  icon,
  className,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  className?: string;
}) => {
  if (
    typeof icon === "function" ||
    (icon && typeof icon === "object" && "render" in icon)
  ) {
    const Icon = icon as React.ElementType;
    return <Icon className={className} />;
  }
  return <HugeiconsIcon icon={icon} className={className} />;
};


export default function LandingNavbar() {
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  const handleSearchChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    
    router.replace(`?${params.toString()}`, { scroll: false });

    if (value && window.scrollY < 200) {
      const lakesSection = document.getElementById("lakes");
      if (lakesSection) {
        lakesSection.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      // If at the very top, always show "home" as active
      if (window.scrollY < 100) {
        setActiveSection("home");
        return;
      }

      // Check if scrolled to the bottom
      const isBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 50;
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

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

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
            className="w-32 md:w-40 h-auto"
            priority
          />
        </Link>

        <div className="hidden lg:flex flex-1 items-center justify-center gap-6">
          <nav className="flex items-center gap-2">
            {navLinks.map((item) => {
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
                  <NavIcon icon={item.icon} className="h-4 w-4" />
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
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
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
              const isActive = activeSection === item.href.replace("#", "");

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-primary text-white"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <NavIcon icon={item.icon} className="h-4 w-4" />
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
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
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
