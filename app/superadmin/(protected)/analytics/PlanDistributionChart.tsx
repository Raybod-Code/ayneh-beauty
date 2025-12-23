"use client";

import { motion } from "framer-motion";
import { PieChart, Crown, Zap, Shield } from "lucide-react";

interface PlanDistributionProps {
  data: { name: string; value: number; percentage: number }[];
}

export default function PlanDistributionChart({ data }: PlanDistributionProps) {
  const colors = {
    Basic: { color: "rgb(96, 165, 250)", bg: "bg-blue-400", icon: Shield },
    Pro: { color: "rgb(198, 168, 124)", bg: "bg-brand-gold", icon: Zap },
    Enterprise: { color: "rgb(168, 85, 247)", bg: "bg-purple-400", icon: Crown },
  };

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 via-brand-gold/10 to-blue-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-700" />

      <div className="relative bg-[#111] border border-white/5 rounded-2xl p-6 overflow-hidden hover:border-brand-gold/20 transition-all">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
        }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-400/10 border border-purple-400/20 rounded-xl flex items-center justify-center">
              <PieChart className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="text-lg font-black text-white">توزیع پلن‌ها</h3>
              <p className="text-xs text-brand-gray">سالن‌های فعال</p>
            </div>
          </div>

          {/* Donut Chart */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full -rotate-90">
              {data.map((item, index) => {
                const radius = 70;
                const circumference = 2 * Math.PI * radius;
                const startAngle = data.slice(0, index).reduce((sum, d) => sum + (d.percentage / 100), 0) * 360;
                const itemColor = colors[item.name as keyof typeof colors]?.color || "rgb(156, 163, 175)";

                return (
                  <motion.circle
                    key={item.name}
                    initial={{ strokeDasharray: `0 ${circumference}` }}
                    animate={{ 
                      strokeDasharray: `${(item.percentage / 100) * circumference} ${circumference}`,
                      rotate: startAngle
                    }}
                    transition={{ duration: 1, delay: index * 0.2, ease: [0.16, 1, 0.3, 1] }}
                    cx="96"
                    cy="96"
                    r={radius}
                    fill="none"
                    stroke={itemColor}
                    strokeWidth="24"
                    strokeLinecap="round"
                    className="origin-center cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ transformOrigin: "96px 96px" }}
                  >
                    <title>{item.name}: {item.value} سالن ({item.percentage}%)</title>
                  </motion.circle>
                );
              })}
            </svg>

            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="text-center"
              >
                <div className="text-3xl font-black text-white font-mono">{total}</div>
                <div className="text-xs text-brand-gray">کل سالن‌ها</div>
              </motion.div>
            </div>
          </div>

          {/* Legend */}
          <div className="space-y-3">
            {data.map((item, index) => {
              const planColor = colors[item.name as keyof typeof colors];
              const Icon = planColor?.icon || Shield;

              return (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${planColor?.bg}/10 border border-${planColor?.bg.replace('bg-', '')}/20 rounded-lg flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 text-${planColor?.bg.replace('bg-', '')}`} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm font-bold text-white">{item.name}</span>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-white">{item.value}</div>
                    <div className="text-xs text-brand-gray">{item.percentage}%</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
