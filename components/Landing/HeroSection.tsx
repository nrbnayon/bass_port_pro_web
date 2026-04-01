import Link from "next/link";
import { Compass, ImageIcon } from "lucide-react";
import { heroStats } from "@/data/landingData";

export default function HeroSection() {
  return (
    <section id="home" className="relative isolate overflow-hidden bg-[#102A51] pt-28 text-white sm:pt-32">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#355D9A_0%,_#102A51_45%,_#091A35_100%)]" />
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:36px_36px]" />
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
      <div className="absolute right-[-80px] top-16 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

      <div className="container-1620 relative pb-10 sm:pb-16">
        <div className="mx-auto max-w-4xl text-center">
          <p className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
            BassPort Pro Intelligence
          </p>
          <h1 className="mt-6 text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">
            Your Bass Fishing <span className="text-primary">Intelligence Hub</span>
          </h1>
          <p className="mx-auto mt-5 max-w-3xl text-sm text-white/80 sm:text-base">
            Discover top bass lakes in America, monitor local conditions, and share your trophy catches with a thriving angler community.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#lakes"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary/90"
            >
              <Compass className="h-4 w-4" /> Explore Lakes
            </Link>
            <Link
              href="#catches"
              className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              <ImageIcon className="h-4 w-4" /> BassPort Gallery
            </Link>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 rounded-2xl border border-white/15 bg-white/10 p-3 backdrop-blur md:grid-cols-4">
          {heroStats.map((stat) => (
            <div key={stat.id} className="rounded-xl border border-white/10 bg-[#0C2242]/70 px-3 py-4 text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="mt-1 text-xs text-white/75 sm:text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
