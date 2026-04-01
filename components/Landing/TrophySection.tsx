import Image from "next/image";
import { catches } from "@/data/landingData";
import SectionHeading from "./SectionHeading";

export default function TrophySection() {
  return (
    <section id="catches" className="bg-white py-16">
      <div className="container-1620">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            badge="BassPort Highlights"
            title="Trophy Catches"
            subtitle="Big catches shared by passionate anglers from top-rated lakes across the country."
            align="left"
          />
          <button className="hidden text-sm font-semibold text-primary md:inline-flex">View All</button>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {catches.map((item) => (
            <article key={item.id} className="group relative overflow-hidden rounded-2xl border border-[#E2EAF5] bg-[#0A213F]">
              <div className="absolute left-3 top-3 z-10 rounded-full bg-primary px-2 py-1 text-[11px] font-semibold text-white">
                {item.weight}
              </div>
              <div className="relative h-56">
                <Image src={item.image} alt={item.angler} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 1024px) 50vw, 25vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#08172C] via-[#08172C]/30 to-transparent" />
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <h3 className="text-sm font-semibold">{item.angler}</h3>
                <p className="text-xs text-white/75">{item.lake}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
