import { requireSuperAdmin } from "@/lib/auth/super-admin";
import CreateTenantForm from "./CreateTenantForm";

export const metadata = {
  title: "افزودن سالن جدید | سوپرادمین",
  description: "ثبت سالن زیبایی جدید در سیستم",
};

export default async function NewTenantPage() {
  await requireSuperAdmin();

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-gold/[0.02] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.015] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(198, 168, 124, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(198, 168, 124, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.7)_100%)]" />
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        <CreateTenantForm />
      </div>
    </div>
  );
}
