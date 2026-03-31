import JobDetailView from "@/components/Landing/JobDetailView";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  // We can't easily fetch from the Express backend at build time in Next.js server
  // so we return a generic title and let the client render the real title
  return {
    title: `Job Details | QuickHire`,
    description: `View job details and apply on QuickHire. Job ID: ${id}`,
  };
}

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  return <JobDetailView id={id} />;
}
