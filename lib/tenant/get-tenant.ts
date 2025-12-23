// lib/tenant/get-tenant.ts
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  status: string;
  plan: string;
  locale: string;
  is_active?: boolean;
  custom_domain?: string | null;
  settings?: any;
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
    // جستجو در دیتابیس
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
    
    // بررسی is_active
    if (data.is_active === false) {
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
