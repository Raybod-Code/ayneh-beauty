"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  phone?: string;
  email?: string;
  settings?: any;
}

interface TenantContextType {
  tenant: Tenant | null;
  loading: boolean;
  refreshTenant: () => Promise<void>;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
  loading: true,
  refreshTenant: async () => {},
});

export function TenantProvider({ children }: { children: ReactNode }) {
  const [tenant, setTenant] = useState<Tenant | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTenant = async () => {
    try {
      const supabase = createClient();
      
      // فعلاً tenant ثابت رو می‌گیریم (بعداً از user_profiles می‌گیریم)
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11")
        .single();

      if (error) {
        console.error("Error fetching tenant:", error);
      } else {
        setTenant(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ tenant, loading, refreshTenant: fetchTenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export const useTenant = () => useContext(TenantContext);
