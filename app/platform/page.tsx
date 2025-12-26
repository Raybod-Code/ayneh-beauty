// app/platform/page.tsx
import PlatformHero from "@/components/platform/PlatformHero";
import PlatformFeatures from "@/components/platform/PlatformFeatures";
import PlatformPricing from "@/components/platform/PlatformPricing";
import PlatformTestimonials from "@/components/platform/PlatformTestimonials";
import PlatformCTA from "@/components/platform/PlatformCTA";
import PlatformStats from "@/components/platform/PlatformStats";

export const metadata = {
  title: "پلتفرم آینه | سالن خود را دیجیتال کنید",
  description: "بهترین سیستم مدیریت سالن‌های زیبایی در ایران",
};

export default function PlatformPage() {
  return (
    <div className="min-h-screen bg-brand-bg">
      <PlatformHero />
      <PlatformStats />
      <PlatformFeatures />
      <PlatformPricing />
      <PlatformTestimonials />
      <PlatformCTA />
    </div>
  );
}
