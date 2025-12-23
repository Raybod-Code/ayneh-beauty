"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";
import { TenantProvider } from "@/app/context/TenantContext";
import { NotificationProvider } from "@/lib/providers/NotificationProvider";
import { RealtimeProvider } from "@/lib/providers/RealtimeProvider";
import { SearchProvider } from "@/lib/providers/SearchProvider";
import InstallPrompt from "@/components/pwa/InstallPrompt";
import CommandPalette from "@/components/search/CommandPalette";

export default function SalonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <TenantProvider>
      <NotificationProvider>
        <RealtimeProvider>
          <SearchProvider>
            <div className="flex min-h-screen bg-[#0a0a0a] text-white">
              <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

              <div
                className={`
                  flex-1 transition-all duration-300 ease-in-out
                  ${collapsed ? "lg:mr-20" : "lg:mr-[280px]"}
                `}
              >
                <main className="w-full">{children}</main>
              </div>
            </div>

            {/* Command Palette (⌘K / Ctrl+K) */}
            <CommandPalette />

            {/* PWA Install Prompt */}
            <InstallPrompt />
          </SearchProvider>
        </RealtimeProvider>
      </NotificationProvider>
    </TenantProvider>
  );
}
