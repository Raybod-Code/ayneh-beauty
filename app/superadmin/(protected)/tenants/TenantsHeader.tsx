"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Building2, Plus, Search, Filter, TrendingUp, Activity, AlertCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function TenantsHeader({ stats }: { stats: { total: number; active: number; suspended: number } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [showFilters, setShowFilters] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-300, 300], [10, -10]);
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10]);

  const springConfig = { damping: 25, stiffness: 200 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    router.push(`?${params.toString()}`);
  };

  const handleFilterStatus = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", status);
    router.push(`?${params.toString()}`);
    setShowFilters(false);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => {
              mouseX.set(0);
              mouseY.set(0);
            }}
          >
            <motion.div
              style={{
                rotateX: rotateXSpring,
                rotateY: rotateYSpring,
                transformStyle: "preserve-3d",
              }}
              className="flex items-start gap-6"
            >
              {/* 3D Icon */}
              <div className="relative group" style={{ perspective: "1000px" }}>
                <motion.div
                  whileHover={{ scale: 1.1, rotateZ: 5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-brand-gold/40 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  
                  <div className="relative w-16 h-16 rounded-[22px] bg-gradient-to-br from-brand-gold via-brand-gold/90 to-brand-gold/70 flex items-center justify-center shadow-2xl shadow-brand-gold/30 border border-brand-gold/30">
                    <div className="absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/20 to-transparent opacity-50" />
                    <Building2 className="w-8 h-8 text-white relative z-10" strokeWidth={2.5} />
                  </div>
                </motion.div>
              </div>

              <div>
                {/* Title - کوچک‌تر */}
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight"
                  style={{
                    textShadow: "0 0 30px rgba(198, 168, 124, 0.2)",
                  }}
                >
                  مدیریت سالن‌ها
                </motion.h1>

                {/* Subtitle - کوچک‌تر */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-brand-gray text-sm mb-6 max-w-xl"
                >
                  کنترل هوشمند و مدیریت یکپارچه تمامی کسب‌وکارهای ثبت شده در پلتفرم
                </motion.p>

                {/* Stats Cards - حالت کارتی */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="grid grid-cols-3 gap-3 max-w-2xl"
                >
                  {/* Total Card */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group relative rounded-2xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 backdrop-blur-xl overflow-hidden p-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                        </div>
                      </div>
                      <div className="text-3xl font-black text-white mb-1">{stats.total}</div>
                      <div className="text-xs text-brand-gray font-bold">کل سالن‌ها</div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>

                  {/* Active Card */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group relative rounded-2xl bg-gradient-to-br from-green-500/[0.08] to-green-500/[0.02] border border-green-500/20 backdrop-blur-xl overflow-hidden p-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                          <Activity className="w-5 h-5 text-green-400" strokeWidth={2.5} />
                        </div>
                      </div>
                      <div className="text-3xl font-black text-green-400 mb-1">{stats.active}</div>
                      <div className="text-xs text-brand-gray font-bold">فعال</div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-green-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>

                  {/* Suspended Card */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -4 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="group relative rounded-2xl bg-gradient-to-br from-red-500/[0.08] to-red-500/[0.02] border border-red-500/20 backdrop-blur-xl overflow-hidden p-4"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                          <AlertCircle className="w-5 h-5 text-red-400" strokeWidth={2.5} />
                        </div>
                      </div>
                      <div className="text-3xl font-black text-red-400 mb-1">{stats.suspended}</div>
                      <div className="text-xs text-gray-500 font-bold">تعلیق شده</div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-red-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: "spring", stiffness: 200 }}
        >
          <Link href="/superadmin/tenants/new">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold via-brand-gold/80 to-brand-gold rounded-[24px] blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative flex items-center gap-3 px-8 py-5 bg-gradient-to-r from-brand-gold to-brand-gold/90 text-white rounded-[24px] font-black text-base shadow-2xl shadow-brand-gold/30 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Sparkles className="w-5 h-5 relative z-10 group-hover:rotate-12 transition-transform duration-300" strokeWidth={2.5} />
                <span className="relative z-10">افزودن سالن جدید</span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  className="relative z-10"
                >
                  <Plus className="w-5 h-5" strokeWidth={3} />
                </motion.div>
              </div>
            </motion.div>
          </Link>
        </motion.div>
      </div>

      {/* Search & Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.7 }}
        className="flex items-center gap-4"
      >
        <div className="flex-1 relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold/20 via-brand-gold/10 to-transparent rounded-[24px] opacity-0 group-focus-within:opacity-100 blur-lg transition-opacity duration-500" />
          <div className="relative">
            <Search className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray group-focus-within:text-brand-gold transition-colors duration-300" strokeWidth={2.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="جستجو بر اساس نام یا دامنه..."
              className="w-full bg-white/[0.02] border border-white/10 rounded-[24px] pr-16 pl-6 py-5 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all duration-300 backdrop-blur-xl"
            />
          </div>
        </div>

        <div className="relative">
          <motion.button
            onClick={() => setShowFilters(!showFilters)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group flex items-center gap-3 px-6 py-5 bg-white/[0.02] border border-white/10 rounded-[24px] hover:border-brand-gold/50 hover:bg-white/[0.04] transition-all backdrop-blur-xl"
          >
            <Filter className="w-5 h-5 text-brand-gray group-hover:text-brand-gold transition-colors" strokeWidth={2.5} />
            <span className="hidden lg:block font-bold text-white">فیلتر</span>
          </motion.button>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute left-0 top-full mt-3 w-56 bg-brand-dark/95 border border-white/10 rounded-[24px] p-3 shadow-2xl shadow-black/50 z-50 backdrop-blur-2xl"
            >
              {[
                { value: "all", label: "همه سالن‌ها", icon: Building2 },
                { value: "active", label: "فعال", icon: Activity },
                { value: "suspended", label: "تعلیق شده", icon: AlertCircle },
              ].map((filter) => (
                <motion.button
                  key={filter.value}
                  onClick={() => handleFilterStatus(filter.value)}
                  whileHover={{ x: 4 }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 text-sm font-bold text-white transition-all group"
                >
                  <filter.icon className="w-4 h-4 text-brand-gray group-hover:text-brand-gold transition-colors" strokeWidth={2.5} />
                  {filter.label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
