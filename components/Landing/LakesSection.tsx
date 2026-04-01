import Image from "next/image";
import { Search, SlidersHorizontal, Star, Waves, Wind } from "lucide-react";
import { lakes } from "@/data/landingData";
import SectionHeading from "./SectionHeading";

export default function LakesSection() {
  return (
    <section id="lakes" className="bg-white py-16 sm:py-20">
      <div className="container-1620">
        <SectionHeading
          badge="Lake Intelligence Database"
          title="Top Bass Fishing Lakes"
          subtitle="Explore curated lake intelligence powered by real-time conditions, local feedback, and community-proven spots."
        />

        <div className="mt-8 flex flex-col gap-3 rounded-2xl border border-[#E3EAF4] bg-[#F8FAFC] p-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2 rounded-xl border border-[#D6DFEA] bg-white px-3 py-2 text-sm text-[#4B5563] md:min-w-[340px]">
            <Search className="h-4 w-4 text-[#7B8CA5]" />
            Search by lake name, state, species, or techniques...
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-[#D6DFEA] bg-white px-3 py-2 text-xs font-semibold text-[#1A365D] sm:text-sm">
              Sort by Rating
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-[#D6DFEA] bg-white px-3 py-2 text-xs font-semibold text-[#1A365D] sm:text-sm">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {lakes.map((lake) => (
            <article key={lake.id} className="overflow-hidden rounded-2xl border border-[#DDE5F0] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-44">
                <Image src={lake.image} alt={lake.name} fill className="object-cover" sizes="(max-width: 1280px) 50vw, 33vw" />
                <div className={`absolute inset-0 bg-gradient-to-t ${lake.color}`} />
                <div className="absolute left-3 top-3 rounded-full bg-emerald-500 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white">
                  Excellent
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/90">
                  <Waves className="h-3.5 w-3.5" /> {lake.state}
                </div>
                <div className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/35 px-2 py-1 text-xs font-semibold text-[#FFD24A]">
                  <Star className="h-3.5 w-3.5 fill-[#FFD24A] text-[#FFD24A]" /> {lake.rating}
                </div>
              </div>

              <div className="space-y-3 p-4">
                <div>
                  <h3 className="text-lg font-semibold text-[#1A365D]">{lake.name}</h3>
                  <p className="mt-1 text-sm text-[#5A6B84]">Ideal conditions and structure for multiple bass techniques.</p>
                </div>

                <div className="grid grid-cols-3 gap-2 rounded-xl bg-[#F6F9FD] p-2">
                  <div className="rounded-lg bg-white p-2 text-center">
                    <p className="text-xs text-[#7A8CA5]">Temp</p>
                    <p className="text-sm font-semibold text-[#1A365D]">{lake.temp}</p>
                  </div>
                  <div className="rounded-lg bg-white p-2 text-center">
                    <p className="text-xs text-[#7A8CA5]">Sky</p>
                    <p className="text-sm font-semibold text-[#1A365D]">{lake.weather}</p>
                  </div>
                  <div className="rounded-lg bg-white p-2 text-center">
                    <p className="text-xs text-[#7A8CA5]">Wind</p>
                    <p className="inline-flex items-center gap-1 text-sm font-semibold text-[#1A365D]"><Wind className="h-3.5 w-3.5" />{lake.wind}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {lake.species.map((tag) => (
                    <span key={tag} className="rounded-full bg-[#EEF4FF] px-2.5 py-1 text-xs font-medium text-[#315CA8]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
