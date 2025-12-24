// app/platform/page.tsx
import PlatformHero from "@/components/platform/PlatformHero";
import PlatformStats from "@/components/platform/PlatformStats";
import PlatformFeatures from "@/components/platform/PlatformFeatures";
import PlatformPricing from "@/components/platform/PlatformPricing";
import PlatformTestimonials from "@/components/platform/PlatformTestimonials";
import PlatformCTA from "@/components/platform/PlatformCTA";

export const metadata = {
  title: "پلتفرم آینه | سالن خود را دیجیتال کنید",
  description: "بهترین سیستم مدیریت سالن‌های زیبایی در ایران و خاورمیانه",
};

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-black">
      <PlatformHero />
      <PlatformStats />
      <PlatformFeatures />
      <PlatformPricing />
      <PlatformTestimonials />
      <PlatformCTA />
    </div>
  );
}
