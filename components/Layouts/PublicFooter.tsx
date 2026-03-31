import Link from "next/link";
import { Twitter, Instagram, Linkedin, Facebook } from "lucide-react";
import Image from "next/image";

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#25324B]">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-0 pt-16 pb-10">
        {/* Top Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                <Image src="/icons/header.png" alt="Logo" width={32} height={32} />
              </div>
              <span className="font-semibold text-[22px] text-white tracking-tight">Obliq</span>
            </Link>
            <p className="text-[15px] text-white/50 leading-relaxed">
              Great platform for the job seeker that searching for new career heights and passionate about startups.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Facebook, label: "Facebook" },
                { icon: Twitter, label: "Twitter" },
                { icon: Linkedin, label: "LinkedIn" },
                { icon: Instagram, label: "Instagram" },
              ].map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/50 hover:border-white hover:text-white transition-all duration-200"
                >
                  <Icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* About */}
          <div className="flex flex-col gap-5">
            <h3 className="font-semibold text-[17px] text-white">About</h3>
            <ul className="flex flex-col gap-3">
              {["Companies", "Pricing", "Terms", "Advice", "Privacy Policy"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[15px] text-white/50 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="flex flex-col gap-5">
            <h3 className="font-semibold text-[17px] text-white">Resources</h3>
            <ul className="flex flex-col gap-3">
              {["Help Docs", "Guide", "Updates", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[15px] text-white/50 hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="flex flex-col gap-5">
            <h3 className="font-semibold text-[17px] text-white">Get Job Notifications</h3>
            <p className="text-[13px] text-white/50 leading-relaxed">
              The latest job news, articles, sent to your inbox weekly.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Email Address"
                className="flex-1 min-w-0 px-4 py-3 bg-white/8 border border-white/15 text-white text-[14px] outline-none placeholder:text-white/40 focus:border-white/40 transition-colors font-[Epilogue,sans-serif]"
              />
              <button className="px-4 py-3 bg-primary text-white font-semibold text-[14px] hover:bg-primary/80 transition-colors whitespace-nowrap shrink-0 cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[14px] text-white/50">
            {currentYear} @ Obliq. All rights reserved.
          </p>
          <div className="flex items-center gap-6 flex-wrap justify-center">
            <Link href="#" className="text-[14px] text-white/50 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-[14px] text-white/50 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="text-[14px] text-white/50 hover:text-white transition-colors">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
