import AdminApplicationsView from "@/components/Admin/Applications/AdminApplicationsView";

export const metadata = {
  title: "Applications | Admin – Obliq",
  description: "View and manage all job applications submitted through Obliq.",
};

export default function AdminApplicationsPage() {
  return <AdminApplicationsView />;
}
