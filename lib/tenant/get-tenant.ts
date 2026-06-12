// lib/tenant/get-tenant.ts
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export interface Tenant {
  id: string;
  slug: string;
  display_name: { fa?: string; en?: string } | string;
  is_active: boolean;
  is_verified: boolean;
  locale: string;
  currency: string;
  country: string;
  timezone: string;
  phone?: string | null;
  address?: string | null;
  branding?: Record<string, any>;
  settings?: Record<string, any>;
  plan_id?: string | null;
  trial_ends_at?: string | null;
  created_at: string;
  updated_at?: string;
}

export async function getTenantFromRequest(): Promise<Tenant | null> {
  const h = await headers();
  const tenantSlug = h.get("x-ayneh-tenant");

  if (!tenantSlug) {
    console.log('⚠️ No tenant slug in headers');
    return null;
  }

  console.log('🔍 Looking for tenant:', tenantSlug);

  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from('tenants')
      .select('*')
      .eq('slug', tenantSlug)
      .single();

    if (error) {
      console.error('❌ Error fetching tenant:', error.message);
      return null;
    }

    if (!data) {
      console.log('❌ Tenant not found');
      return null;
    }

    if (data.is_active === false) {
      console.log('🚫 Tenant is inactive');
      return null;
    }

    console.log('✅ Tenant found:', data.slug);
    return data as Tenant;

  } catch (err) {
    console.error('❌ Exception:', err);
    return null;
  }
}

export async function getTenantSlug(): Promise<string | null> {
  const h = await headers();
  return h.get("x-ayneh-tenant");
}

export async function requireTenant(): Promise<Tenant> {
  const tenant = await getTenantFromRequest();
  if (!tenant) {
    throw new Error('Tenant not found or inactive');
  }
  return tenant;
}

export function getTenantDisplayName(tenant: Tenant, locale: 'fa' | 'en' = 'fa'): string {
  if (typeof tenant.display_name === 'string') return tenant.display_name;
  return tenant.display_name?.[locale] ?? tenant.display_name?.en ?? 'سالن زیبایی';
}
