import Link from "next/link";

export default function CTASection() {
  return (
    <section className="bg-primary py-10">
      <div className="container-1620 flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
        <div>
          <h3 className="text-2xl font-bold text-white">Ready to Find Your Next Trophy Bass?</h3>
          <p className="mt-1 text-sm text-white/90">Join thousands of anglers using BASSPORT intelligence every week.</p>
        </div>
        <Link
          href="/lakes"
          className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-primary transition hover:bg-[#FFF1EB]"
        >
          Explore Lakes Now
        </Link>
      </div>
    </section>
  );
}
