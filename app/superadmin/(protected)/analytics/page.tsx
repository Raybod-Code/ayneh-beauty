import { requireSuperAdmin } from "@/lib/auth/super-admin";
import { createClient } from "@/lib/supabase/server";
import AnalyticsClient from "./AnalyticsClient";

export const metadata = {
  title: "آنالیتیکس پیشرفته | سوپرادمین",
  description: "تحلیل و گزارش‌گیری جامع از سیستم",
};

export default async function AnalyticsPage() {
  await requireSuperAdmin();
  const supabase = await createClient();

  // Fetch data for last 12 months
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  // 1. Tenants data
  const { data: tenants } = await supabase
    .from("tenants")
    .select("id, name, plan, status, created_at")
    .gte("created_at", twelveMonthsAgo.toISOString())
    .order("created_at", { ascending: true });

  // 2. Users data
  const { data: users } = await supabase
    .from("profiles")
    .select("user_id, created_at")
    .gte("created_at", twelveMonthsAgo.toISOString())
    .order("created_at", { ascending: true });

  // 3. Current stats
  const { count: totalTenants } = await supabase
    .from("tenants")
    .select("*", { count: "exact", head: true });

  const { count: activeTenants } = await supabase
    .from("tenants")
    .select("*", { count: "exact", head: true })
    .eq("status", "active");

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  // 4. Plan distribution
  const { data: planDistribution } = await supabase
    .from("tenants")
    .select("plan")
    .eq("status", "active");

  // Process data
  const monthlyTenants = processMonthlyData(tenants || [], 12);
  const monthlyUsers = processMonthlyData(users || [], 12);
  const planStats = processPlanDistribution(planDistribution || []);

  // Calculate growth rates
  const tenantGrowth = calculateGrowthRate(monthlyTenants);
  const userGrowth = calculateGrowthRate(monthlyUsers);

  const analyticsData = {
    stats: {
      totalTenants: totalTenants || 0,
      activeTenants: activeTenants || 0,
      totalUsers: totalUsers || 0,
      tenantGrowth,
      userGrowth,
    },
    monthlyTenants,
    monthlyUsers,
    planStats,
    recentActivity: tenants?.slice(-10).reverse() || [],
  };

  return <AnalyticsClient data={analyticsData} />;
}

function processMonthlyData(data: any[], months: number) {
  const result = [];
  const now = new Date();

  for (let i = months - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString("fa-IR", { month: "short" });
    
    const count = data.filter((item) => {
      const itemDate = new Date(item.created_at);
      return (
        itemDate.getMonth() === date.getMonth() &&
        itemDate.getFullYear() === date.getFullYear()
      );
    }).length;

    // Cumulative count
    const cumulativeCount = data.filter((item) => {
      const itemDate = new Date(item.created_at);
      return itemDate <= date;
    }).length;

    result.push({ month: monthName, count, cumulative: cumulativeCount });
  }

  return result;
}

function processPlanDistribution(data: any[]) {
  const plans = data.reduce((acc: any, item) => {
    const plan = item.plan || "basic";
    acc[plan] = (acc[plan] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(plans).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    percentage: Math.round((value as number / data.length) * 100),
  }));
}

function calculateGrowthRate(data: any[]) {
  if (data.length < 2) return 0;
  const current = data[data.length - 1]?.count || 0;
  const previous = data[data.length - 2]?.count || 0;
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 100);
}
