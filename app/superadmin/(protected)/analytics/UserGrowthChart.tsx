"use client";

import { motion } from "framer-motion";
import { Users, TrendingUp } from "lucide-react";

interface UserGrowthChartProps {
  data: { month: string; cumulative: number }[];
}

export default function UserGrowthChart({ data }: UserGrowthChartProps) {
  const maxValue = Math.max(...data.map((d) => d.cumulative), 1);
  const totalUsers = data[data.length - 1]?.cumulative || 0;
  const growth = data.length > 1 
    ? Math.round(((data[data.length - 1]?.cumulative - data[data.length - 2]?.cumulative) / data[data.length - 2]?.cumulative) * 100)
    : 0;

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-700" />

      <div className="relative bg-[#111] border border-white/5 rounded-2xl p-6 overflow-hidden hover:border-brand-gold/20 transition-all">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
        }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-400/10 border border-blue-400/20 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">رشد کاربران</h3>
                <p className="text-xs text-brand-gray">تجمیعی 12 ماهه</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-blue-400 font-mono">
                {totalUsers.toLocaleString("fa-IR")}
              </div>
              <div className="flex items-center gap-1 text-xs text-blue-400">
                <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
                <span>+{growth}%</span>
              </div>
            </div>
          </div>

          {/* Area Chart */}
          <div className="relative h-48 mb-4">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-px bg-white/5" />
              ))}
            </div>

            {/* SVG Area Chart */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="userGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgb(96, 165, 250)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="rgb(96, 165, 250)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area Fill with Animation */}
              <motion.path
                initial={{ opacity: 0, scaleY: 0 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                style={{ originY: 1 }}
                d={`
                  M 0 ${192}
                  ${data.map((item, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 192 - (item.cumulative / maxValue) * 192;
                    return `L ${x}% ${y}`;
                  }).join(" ")}
                  L 100% ${192}
                  Z
                `}
                fill="url(#userGradient)"
              />

              {/* Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                d={`
                  M 0 ${192 - (data[0]?.cumulative / maxValue) * 192}
                  ${data.slice(1).map((item, i) => {
                    const x = ((i + 1) / (data.length - 1)) * 100;
                    const y = 192 - (item.cumulative / maxValue) * 192;
                    return `L ${x}% ${y}`;
                  }).join(" ")}
                `}
                fill="none"
                stroke="rgb(96, 165, 250)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {data.map((item, i) => {
                const x = (i / (data.length - 1)) * 100;
                const y = 192 - (item.cumulative / maxValue) * 192;
                
                return (
                  <motion.circle
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.05, type: "spring" }}
                    cx={`${x}%`}
                    cy={y}
                    r="4"
                    fill="rgb(96, 165, 250)"
                    className="cursor-pointer"
                  >
                    <title>{item.month}: {item.cumulative} کاربر</title>
                  </motion.circle>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs">
            {data.map((item, i) => (
              <span key={i} className="text-brand-gray font-mono">
                {item.month}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
