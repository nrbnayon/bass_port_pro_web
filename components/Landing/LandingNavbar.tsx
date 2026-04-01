"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navLinks } from "@/data/landingData";

export default function LandingNavbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#1C365D] backdrop-blur-xl">
      <div className="container-1620 flex h-20 items-center justify-between gap-4">
        <Link href="#home" className="flex items-center gap-2">
          <Image src="/icons/logo.png" alt="BassPort" width={120} height={36} className="h-10 w-auto" priority />
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-[#0E2A52]/60 px-2 py-1 lg:flex">
          {navLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/signin" className="text-sm font-semibold text-white/80 transition hover:text-white">
            Sign In
          </Link>
          <Link
            href="/signup"
            className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white transition hover:bg-primary/90"
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
        <div className="border-t border-white/10 bg-[#14345F] px-6 py-5 lg:hidden">
          <nav className="flex flex-col gap-2">
            {navLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-white/90 hover:bg-white/10"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 flex items-center gap-3">
              <Link
                href="/signin"
                className="flex-1 rounded-full border border-white/25 px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="flex-1 rounded-full bg-primary px-4 py-2 text-center text-sm font-semibold text-white"
              >
                Join Free
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
