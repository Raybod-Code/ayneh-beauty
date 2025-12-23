// lib/tenant/context.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';

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
  theme?: {
    primary?: string;
  };
  public_config?: {
    rtl?: boolean;
  };
  created_at: string;
}

interface TenantContextType {
  tenant: Tenant | null;
}

const TenantContext = createContext<TenantContextType>({
  tenant: null,
});

export function TenantProvider({
  children,
  tenant,
}: {
  children: ReactNode;
  tenant: Tenant | null;
}) {
  return (
    <TenantContext.Provider value={{ tenant }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}
