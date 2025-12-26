// lib/tenant/get-tenant.ts (به‌روزرسانی)
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  status: string;
  subscription_plan?: string;
  locale: string;
  is_active?: boolean;
  custom_domain?: string | null;
  settings?: any;
  created_at: string;
  updated_at?: string;
  owner_name?: string;
  email?: string;
  phone?: string;
  city?: string;
  logo?: string;
  address?: string;
  subscription_expires_at?: string;
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
    
    if (data.is_active === false || data.status !== 'active') {
      console.log('🚫 Tenant is suspended');
      return null;
    }
    
    console.log('✅ Tenant found:', data.name);
    return data as Tenant;
    
  } catch (error) {
    console.error('❌ Exception:', error);
    return null;
  }
}

// تابع کمکی برای گرفتن tenant_slug فقط
export async function getTenantSlug(): Promise<string | null> {
  const h = await headers();
  return h.get("x-ayneh-tenant");
}

// تابع الزامی - اگر tenant نبود، error میده
export async function requireTenant(): Promise<Tenant> {
  const tenant = await getTenantFromRequest();
  
  if (!tenant) {
    throw new Error('Tenant not found or inactive');
  }
  
  return tenant;
}

// چک کردن subscription
export function isTenantSubscriptionActive(tenant: Tenant): boolean {
  if (!tenant.subscription_expires_at) {
    return false;
  }
  
  const expiresAt = new Date(tenant.subscription_expires_at);
  const now = new Date();
  
  return expiresAt > now;
}

// گرفتن plan name
export function getTenantPlanName(tenant: Tenant): string {
  return tenant.subscription_plan || 'free';
}
