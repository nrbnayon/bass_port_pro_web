import { LandingView } from "@/components/Landing/LandingView";
import PublicLayoutView from "@/components/Layouts/PublicLayoutView";

export default async function Page() {
  return (
    <PublicLayoutView>
      <LandingView />
    </PublicLayoutView>
  );
}
