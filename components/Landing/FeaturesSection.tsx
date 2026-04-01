import {
  Camera,
  CalendarRange,
  ChartColumnIncreasing,
  Map,
  MessageCircleMore,
  Target,
} from "lucide-react";
import { features } from "@/data/landingData";
import SectionHeading from "./SectionHeading";

const iconMap = {
  map: Map,
  chart: ChartColumnIncreasing,
  camera: Camera,
  message: MessageCircleMore,
  calendar: CalendarRange,
  target: Target,
};

export default function FeaturesSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-1620">
        <SectionHeading
          badge="Platform Benefits"
          title="Why Choose BASSPORT?"
          subtitle="Everything needed to fish smarter, catch bigger, and connect with a nationwide bass community."
        />

        <div className="mt-9 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => {
            const Icon = iconMap[feature.icon];
            return (
              <article key={feature.id} className="rounded-2xl border border-[#DDE7F3] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#EEF4FF] text-[#315CA8]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-[#1A365D]">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#5A6B84]">{feature.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
