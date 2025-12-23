import { requireSuperAdmin } from "@/lib/auth/super-admin";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function SuperAdminDashboard() {
  await requireSuperAdmin();
  const supabase = await createClient();

  // Fetch Stats
  const { count: tenantsCount } = await supabase
    .from("tenants")
    .select("*", { count: "exact", head: true });

  const { count: activeCount } = await supabase
    .from("tenants")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // Recent Tenants
  const { data: recentTenants } = await supabase
    .from("tenants")
    .select(`
      *,
      members:tenant_memberships(count)
    `)
    .order("created_at", { ascending: false })
    .limit(5);

  // Top Performers (most members)
  const { data: topPerformers } = await supabase
    .from("tenants")
    .select(`
      *,
      members:tenant_memberships(count)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(5);

  // Growth Data - tenants created per month (last 6 months)
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const { data: growthData } = await supabase
    .from("tenants")
    .select("created_at")
    .gte("created_at", sixMonthsAgo.toISOString())
    .order("created_at", { ascending: true });

  // Process growth data by month
  const monthlyGrowth = processMonthlyGrowth(growthData || []);

  const stats = {
    tenantsCount: tenantsCount || 0,
    activeCount: activeCount || 0,
    usersCount: usersCount || 0,
    suspendedCount: (tenantsCount || 0) - (activeCount || 0),
  };

  return (
    <DashboardClient
      stats={stats}
      recentTenants={recentTenants || []}
      topPerformers={topPerformers || []}
      growthData={monthlyGrowth}
    />
  );
}

function processMonthlyGrowth(data: any[]) {
  const months = [];
  const now = new Date();

  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString("fa-IR", { month: "short" });
    
    const count = data.filter((item) => {
      const itemDate = new Date(item.created_at);
      return (
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear()
      );
    }).length;

    months.push({ month: monthName, count });
  }

  return months;
}
