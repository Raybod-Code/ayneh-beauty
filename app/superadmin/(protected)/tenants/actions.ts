"use server";

import { revalidatePath } from "next/cache";
import { requireSuperAdmin } from "@/lib/auth/super-admin";
import { createClient } from "@/lib/supabase/server";

export async function toggleTenantStatus(tenantId: string, currentStatus: string) {
  await requireSuperAdmin();
  const supabase = await createClient();

  const newStatus = currentStatus === "active" ? "suspended" : "active";

  const { error } = await supabase
    .from("tenants")
    .update({ 
      status: newStatus,
      updated_at: new Date().toISOString()
    })
    .eq("id", tenantId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/superadmin/tenants");
  return { success: true, newStatus };
}

export async function deleteTenant(tenantId: string) {
  await requireSuperAdmin();
  const supabase = await createClient();

  // حذف cascade (اول members، بعد tenant)
  const { error: membersError } = await supabase
    .from("tenant_memberships")
    .delete()
    .eq("tenant_id", tenantId);

  if (membersError) {
    return { success: false, error: membersError.message };
  }

  const { error } = await supabase
    .from("tenants")
    .delete()
    .eq("id", tenantId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/superadmin/tenants");
  return { success: true };
}

export async function updateTenantPlan(tenantId: string, newPlan: string) {
  await requireSuperAdmin();
  const supabase = await createClient();

  const { error } = await supabase
    .from("tenants")
    .update({ plan: newPlan })
    .eq("id", tenantId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/superadmin/tenants");
  return { success: true };
}
