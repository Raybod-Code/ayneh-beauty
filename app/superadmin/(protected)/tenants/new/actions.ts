"use server";

import { createClient } from "@/lib/supabase/server";
import { requireSuperAdmin } from "@/lib/auth/super-admin";
import { revalidatePath } from "next/cache";

interface CreateTenantData {
  name: string;
  slug: string;
  description: string;
  plan: string;
  language: string;
  timezone: string;
  currency: string;
  ownerEmail: string;
  ownerName: string;
}

export async function createTenant(data: CreateTenantData) {
  try {
    await requireSuperAdmin();
    const supabase = await createClient();

    // 1. Check if slug is unique
    const { data: existing } = await supabase
      .from("tenants")
      .select("id")
      .eq("slug", data.slug)
      .single();

    if (existing) {
      return { success: false, error: "این دامنه قبلاً استفاده شده است" };
    }

    // 2. Create tenant
    const { data: tenant, error: tenantError } = await supabase
      .from("tenants")
      .insert({
        name: data.name,
        slug: data.slug,
        description: data.description || null,
        status: "active",
        plan: data.plan,
        settings: {
          language: data.language,
          timezone: data.timezone,
          currency: data.currency,
        },
      })
      .select()
      .single();

    if (tenantError || !tenant) {
      console.error("Tenant creation error:", tenantError);
      return { success: false, error: tenantError?.message || "خطا در ثبت سالن" };
    }

    // 3. Check if owner user exists
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("user_id")
      .eq("email", data.ownerEmail)
      .single();

    let ownerId = existingUser?.user_id;

    // 4. If owner doesn't exist, create invitation
    if (!ownerId) {
      // Create a pending profile (will be completed when user signs up)
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          email: data.ownerEmail,
          full_name: data.ownerName,
          role: "user", // Will be updated to tenant_admin after signup
        })
        .select()
        .single();

      if (profileError) {
        console.error("Profile creation error:", profileError);
        // Continue anyway, owner can be added later
      } else {
        ownerId = profile.user_id;
      }
    }

    // 5. Create tenant membership for owner
    if (ownerId) {
      const { error: membershipError } = await supabase
        .from("tenant_memberships")
        .insert({
          tenant_id: tenant.id,
          user_id: ownerId,
          role: "owner",
        });

      if (membershipError) {
        console.error("Membership error:", membershipError);
        // Continue anyway
      }
    }

    // 6. Send invitation email (optional - you can implement this later)
    // await sendInvitationEmail(data.ownerEmail, data.ownerName, tenant.slug);

    revalidatePath("/superadmin/tenants");
    revalidatePath("/superadmin/dashboard");

    return {
      success: true,
      tenantId: tenant.id,
      message: "سالن با موفقیت ثبت شد",
    };
  } catch (error: any) {
    console.error("Create tenant error:", error);
    return { success: false, error: error.message || "خطای سرور" };
  }
}
