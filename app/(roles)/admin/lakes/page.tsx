import LakeManagementClient from "@/components/AuthProtected/Admin/LakeManagement/LakeManagementClient";

export const metadata = {
  title: "Lake Management | BassInsight",
  description: "Manage lakes, fishing spots, and water bodies",
};

export default function LakeManagementPage() {
  return (
    <>
      <LakeManagementClient />
    </>
  );
}
