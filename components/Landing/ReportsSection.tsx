import { Clock3, Fish, MapPin } from "lucide-react";
import { reports } from "@/data/landingData";
import SectionHeading from "./SectionHeading";

export default function ReportsSection() {
  return (
    <section id="reports" className="bg-white py-16 sm:py-20">
      <div className="container-1620">
        <div className="flex items-end justify-between gap-4">
          <SectionHeading
            badge="Latest Intel"
            title="Recent Fishing Reports"
            subtitle="Community-led observations from active anglers to help you plan your next cast with confidence."
            align="left"
          />
          <button className="hidden text-sm font-semibold text-primary md:inline-flex">All Reports</button>
        </div>

        <div className="mt-9 grid grid-cols-1 gap-4 lg:grid-cols-3">
          {reports.map((report) => (
            <article key={report.id} className="rounded-2xl border border-[#DEE7F3] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-white">
                    {report.angler.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-[#1A365D]">{report.angler}</p>
                    <p className="text-xs text-[#6F809A]">@ {report.lake}</p>
                  </div>
                </div>
                <div className="text-xs text-[#6F809A]">{report.date}</div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-medium text-[#506480]">
                <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> Score: {report.score}</span>
                <span className="inline-flex items-center gap-1"><Fish className="h-3.5 w-3.5" /> {report.catches}</span>
                <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" /> 3 hours</span>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-[#4E617C]">{report.text}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {report.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-[#EEF4FF] px-2.5 py-1 text-xs font-medium text-[#315CA8]">
                    {tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
