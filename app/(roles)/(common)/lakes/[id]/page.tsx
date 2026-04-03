import { lakes } from "@/data/landingData";
import { notFound } from "next/navigation";
import LakeDetailsHero from "@/components/Common/Lakes/LakeDetailsHero";
import LakeDetailsWrapper from "@/components/Common/Lakes/LakeDetailsWrapper";
import CTASection from "@/components/Landing/CTASection";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lake = lakes.find((l) => l.id === id);
  if (!lake) return { title: "Lake Not Found" };

  return {
    title: `${lake.name} - BASSPORT Pro`,
    description: `Details about ${lake.name} fishing, current conditions, patterns and community reviews.`,
  };
}

export default async function LakeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lake = lakes.find((l) => l.id === id);

  if (!lake) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-0 min-h-screen bg-white">
      <LakeDetailsHero lake={lake} />
      <div className="py-5">
         <LakeDetailsWrapper lake={lake} />
      </div>
      <CTASection />
    </div>
  );
}

export function generateStaticParams() {
  return lakes.map((lake) => ({
    id: lake.id,
  }));
}
