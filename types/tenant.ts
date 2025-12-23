// types/tenant.ts

export interface Tenant {
  id: string;
  name: string;
  slug: string;
  status?: string; // از دیتابیس موجود
  plan?: string;   // از دیتابیس موجود
  locale?: string; // از دیتابیس موجود
  custom_domain?: string | null;
  is_active?: boolean;
  subscription_ends_at?: string | null;
  settings?: TenantSettings;
  created_at: string;
  updated_at?: string;
}

export interface TenantSettings {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    logo: string | null;
  };
  locale: string;
  currency: string;
  timezone: string;
}

export interface UserProfile {
  user_id: string;
  full_name?: string;
  role: string;
  created_at: string;
}

export interface TenantMembership {
  tenant_id: string;
  user_id: string;
  role: string;
  created_at: string;
}
