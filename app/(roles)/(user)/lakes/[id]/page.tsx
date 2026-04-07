import LakeDetailsPageClient from "@/components/AuthProtected/User/Lakes/LakeDetailsPageClient";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return {
    title: `Lake Details - BASSPORT Pro`,
    description: `Details about lake fishing, current conditions, patterns and community reviews.`,
  };
}

export default async function LakeDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <LakeDetailsPageClient id={id} />;
}

export function generateStaticParams() {
  return [];
}
