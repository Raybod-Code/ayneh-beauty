import { Suspense } from "react";
import { requireSuperAdmin } from "@/lib/auth/super-admin";
import { createClient } from "@/lib/supabase/server";
import TenantsGrid from "./TenantsGrid";
import TenantsHeader from "./TenantsHeader";
import TenantsSkeleton from "./TenantsSkeleton";

export default async function TenantsPage({
  searchParams,
}: {
  searchParams: { search?: string; status?: string };
}) {
  await requireSuperAdmin();
  const supabase = await createClient();

  let query = supabase
    .from("tenants")
    .select(`
      *,
      members:tenant_memberships(count)
    `)
    .order("created_at", { ascending: false });

  if (searchParams.search) {
    query = query.or(`name.ilike.%${searchParams.search}%,slug.ilike.%${searchParams.search}%`);
  }

  if (searchParams.status && searchParams.status !== "all") {
    query = query.eq("status", searchParams.status);
  }

  const { data: tenants } = await query;

  const stats = {
    total: tenants?.length || 0,
    active: tenants?.filter((t) => t.status === "active").length || 0,
    suspended: tenants?.filter((t) => t.status === "suspended").length || 0,
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[20%] w-[800px] h-[800px] bg-brand-gold/[0.03] rounded-full blur-[160px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[15%] w-[700px] h-[700px] bg-purple-500/[0.025] rounded-full blur-[140px] animate-pulse" style={{ animationDelay: "2s" }} />
        <div className="absolute top-[40%] right-[30%] w-[600px] h-[600px] bg-blue-500/[0.02] rounded-full blur-[130px] animate-pulse" style={{ animationDelay: "4s" }} />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(198, 168, 124, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(198, 168, 124, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px'
          }}
        />

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.02] mix-blend-overlay" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
        }} />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.8)_100%)]" />
      </div>

      <div className="relative z-10 p-6 lg:p-12 space-y-12">
        <TenantsHeader stats={stats} />

        <Suspense fallback={<TenantsSkeleton />}>
          <TenantsGrid tenants={tenants || []} />
        </Suspense>
      </div>
    </div>
  );
}
