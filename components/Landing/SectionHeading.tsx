type SectionHeadingProps = {
  badge: string;
  title: string;
  subtitle: string;
  align?: "left" | "center";
};

export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = "center",
}: SectionHeadingProps) {
  return (
    <div className={align === "center" ? "text-center" : "text-left"}>
      <span className="inline-flex rounded-full bg-primary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
        {badge}
      </span>
      <h2 className="mt-4 text-3xl font-bold tracking-tight text-[#1A365D] md:text-4xl">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-[#4B5563] md:text-base">{subtitle}</p>
    </div>
  );
}
