"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import Fuse from "fuse.js";

interface SearchItem {
  id: string;
  title: string;
  description?: string;
  type: "booking" | "customer" | "service" | "staff" | "transaction" | "inventory" | "page";
  icon?: string;
  url?: string;
  metadata?: any;
}

interface SearchContextType {
  query: string;
  setQuery: (query: string) => void;
  results: SearchItem[];
  loading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  allItems: SearchItem[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [allItems, setAllItems] = useState<SearchItem[]>([]);
  const supabase = createClient();

  // Helper function to get tenant
  const getTenantSlug = (): string => {
    if (typeof window === 'undefined') return '';
    const hostname = window.location.hostname;
    const parts = hostname.split('.');
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('localhost:')) {
      return 'localhost-fallback';
    }
    if (parts.length >= 2) return parts[0];
    return '';
  };

  // Fetch all searchable items
  const fetchAllItems = async () => {
    try {
      let slug = getTenantSlug();
      
      let tenantData: any = null;
      
      if (slug === 'localhost-fallback') {
        const response = await supabase.from("tenants").select("*").eq("status", "active").limit(1);
        tenantData = response.data;
        if (tenantData && tenantData.length > 0) slug = tenantData[0].slug;
      } else {
        const response = await supabase.from("tenants").select("*").eq("slug", slug).eq("status", "active").limit(1);
        tenantData = response.data;
      }

      if (!tenantData || tenantData.length === 0) return;

      const tenant = tenantData[0];

      // Fetch data in parallel
      const [bookings, customers, services, staff, inventory] = await Promise.all([
        supabase.from("bookings").select("*").eq("tenant_id", tenant.id).limit(50),
        supabase.from("customers").select("*").eq("tenant_id", tenant.id).limit(50),
        supabase.from("services").select("*").eq("tenant_id", tenant.id),
        supabase.from("staff").select("*").eq("tenant_id", tenant.id),
        supabase.from("inventory").select("*").eq("tenant_id", tenant.id).limit(50),
      ]);

      const items: SearchItem[] = [
        // Pages
        { id: "dashboard", title: "داشبورد", type: "page", url: "/salon/dashboard", icon: "LayoutDashboard" },
        { id: "bookings", title: "رزروها", type: "page", url: "/salon/bookings", icon: "Calendar" },
        { id: "services", title: "سرویس‌ها", type: "page", url: "/salon/services", icon: "Scissors" },
        { id: "staff", title: "کارمندان", type: "page", url: "/salon/staff", icon: "Users" },
        { id: "customers", title: "مشتریان", type: "page", url: "/salon/customers", icon: "UserCircle" },
        { id: "financial", title: "مالی", type: "page", url: "/salon/financial", icon: "Wallet" },
        { id: "inventory", title: "موجودی", type: "page", url: "/salon/inventory", icon: "Package" },
        { id: "marketing", title: "بازاریابی", type: "page", url: "/salon/marketing", icon: "Send" },
        { id: "analytics", title: "آمار و گزارش", type: "page", url: "/salon/analytics", icon: "BarChart3" },
        { id: "settings", title: "تنظیمات", type: "page", url: "/salon/settings", icon: "Settings" },
      ];

      // Add bookings
      bookings.data?.forEach((booking: any) => {
        items.push({
          id: booking.id,
          title: `رزرو ${booking.customer_name}`,
          description: `${booking.service_name} - ${booking.booking_date}`,
          type: "booking",
          url: `/salon/bookings?id=${booking.id}`,
          metadata: booking,
        });
      });

      // Add customers
      customers.data?.forEach((customer: any) => {
        items.push({
          id: customer.id,
          title: customer.name,
          description: `${customer.phone} - ${customer.customer_type}`,
          type: "customer",
          url: `/salon/customers?id=${customer.id}`,
          metadata: customer,
        });
      });

      // Add services
      services.data?.forEach((service: any) => {
        items.push({
          id: service.id,
          title: service.name,
          description: `${service.price.toLocaleString('fa-IR')} تومان - ${service.duration} دقیقه`,
          type: "service",
          url: `/salon/services?id=${service.id}`,
          metadata: service,
        });
      });

      // Add staff
      staff.data?.forEach((member: any) => {
        items.push({
          id: member.id,
          title: member.name,
          description: `${member.role} - ${member.specialties}`,
          type: "staff",
          url: `/salon/staff?id=${member.id}`,
          metadata: member,
        });
      });

      // Add inventory
      inventory.data?.forEach((item: any) => {
        items.push({
          id: item.id,
          title: item.name,
          description: `موجودی: ${item.quantity} - ${item.category}`,
          type: "inventory",
          url: `/salon/inventory?id=${item.id}`,
          metadata: item,
        });
      });

      setAllItems(items);
    } catch (error) {
      console.error("Error fetching search items:", error);
    }
  };

  // Search with Fuse.js
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);

    const fuse = new Fuse(allItems, {
      keys: ["title", "description", "type"],
      threshold: 0.3,
      includeScore: true,
    });

    const searchResults = fuse.search(query);
    setResults(searchResults.map(result => result.item).slice(0, 10));
    setLoading(false);
  }, [query, allItems]);

  // Initial fetch
  useEffect(() => {
    fetchAllItems();
  }, []);

  // Keyboard shortcut (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }

      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        query,
        setQuery,
        results,
        loading,
        isOpen,
        setIsOpen,
        allItems,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}
