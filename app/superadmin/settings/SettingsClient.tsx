"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Settings,
  Building2,
  CreditCard,
  Mail,
  Shield,
  Palette,
  Globe,
  Zap,
  Bell,
  Database,
} from "lucide-react";
import GeneralSettings from "./tabs/GeneralSettings";
import PlansSettings from "./tabs/PlansSettings";
import EmailSettings from "./tabs/EmailSettings";
import SecuritySettings from "./tabs/SecuritySettings";

type TabKey = "general" | "plans" | "email" | "security";

interface Tab {
  key: TabKey;
  label: string;
  icon: React.ElementType;
  description: string;
}

const tabs: Tab[] = [
  {
    key: "general",
    label: "عمومی",
    icon: Settings,
    description: "تنظیمات اصلی سیستم",
  },
  {
    key: "plans",
    label: "پلن‌ها و قیمت‌گذاری",
    icon: CreditCard,
    description: "مدیریت پلن‌های اشتراک",
  },
  {
    key: "email",
    label: "ایمیل و SMTP",
    icon: Mail,
    description: "پیکربندی سرویس ایمیل",
  },
  {
    key: "security",
    label: "امنیت",
    icon: Shield,
    description: "تنظیمات امنیتی سیستم",
  },
];

export default function SettingsClient() {
  const [activeTab, setActiveTab] = useState<TabKey>("general");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
              <Settings className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-white">
                تنظیمات سیستم
              </h1>
              <p className="text-brand-gray text-sm mt-1">
                مدیریت کامل تنظیمات و پیکربندی سیستم
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sidebar Tabs */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <div className="sticky top-6 bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-4 overflow-hidden">
              {/* Noise Texture */}
              <div 
                className="absolute inset-0 opacity-[0.02] pointer-events-none" 
                style={{
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
                }}
              />

              <div className="relative space-y-2">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.key;

                  return (
                    <motion.button
                      key={tab.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      onClick={() => setActiveTab(tab.key)}
                      className={`
                        relative w-full text-right px-4 py-3.5 rounded-2xl transition-all duration-300 group
                        ${isActive 
                          ? "bg-brand-gold/10 border border-brand-gold/30" 
                          : "hover:bg-white/[0.02] border border-transparent"
                        }
                      `}
                    >
                      {/* Active Glow */}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute -inset-0.5 bg-brand-gold/20 rounded-2xl blur-md -z-10"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}

                      <div className="flex items-center gap-3">
                        <div className={`
                          w-10 h-10 rounded-xl flex items-center justify-center transition-colors
                          ${isActive 
                            ? "bg-brand-gold/20 text-brand-gold" 
                            : "bg-white/5 text-brand-gray group-hover:text-white"
                          }
                        `}>
                          <Icon className="w-5 h-5" strokeWidth={2.5} />
                        </div>

                        <div className="flex-1 text-right">
                          <div className={`
                            text-sm font-bold transition-colors
                            ${isActive ? "text-white" : "text-brand-gray group-hover:text-white"}
                          `}>
                            {tab.label}
                          </div>
                          <div className="text-xs text-brand-gray/70 mt-0.5">
                            {tab.description}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-9"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "general" && <GeneralSettings />}
                {activeTab === "plans" && <PlansSettings />}
                {activeTab === "email" && <EmailSettings />}
                {activeTab === "security" && <SecuritySettings />}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
