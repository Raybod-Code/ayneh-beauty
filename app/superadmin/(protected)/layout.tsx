"use client";

import { useState } from "react";
import Sidebar from "./components/Sidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Main Content */}
      <div
        className={`
          flex-1 transition-all duration-300 ease-in-out
          ${collapsed ? "lg:mr-20" : "lg:mr-[280px]"}
        `}
      >
        <main className="w-full">{children}</main>
      </div>
    </div>
  );
}
