"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign } from "lucide-react";

interface RevenueChartProps {
  data: { month: string; count: number }[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const maxValue = Math.max(...data.map((d) => d.count), 1);
  
  // Simulate revenue (you can replace with real data)
  const revenueData = data.map((item) => ({
    ...item,
    revenue: item.count * 49 * 30, // Assuming $49/month per tenant
  }));

  const totalRevenue = revenueData.reduce((sum, item) => sum + item.revenue, 0);
  const maxRevenue = Math.max(...revenueData.map((d) => d.revenue), 1);

  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/10 via-brand-gold/10 to-green-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-700" />

      <div className="relative bg-[#111] border border-white/5 rounded-2xl p-6 overflow-hidden hover:border-brand-gold/20 transition-all">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
        }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-400/10 border border-green-400/20 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">درآمد تجمیعی</h3>
                <p className="text-xs text-brand-gray">پیش‌بینی 12 ماهه</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-green-400 font-mono">
                ${(totalRevenue / 1000).toFixed(1)}K
              </div>
              <div className="flex items-center gap-1 text-xs text-green-400">
                <TrendingUp className="w-3 h-3" strokeWidth={2.5} />
                <span>+18%</span>
              </div>
            </div>
          </div>

          {/* Line Chart */}
          <div className="relative h-48 mb-4">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-px bg-white/5" />
              ))}
            </div>

            {/* SVG Line Chart */}
            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
              <defs>
                <linearGradient id="revenueGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="rgb(74, 222, 128)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="rgb(74, 222, 128)" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area Fill */}
              <motion.path
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.2 }}
                d={`
                  M 0 ${192}
                  ${revenueData.map((item, i) => {
                    const x = (i / (revenueData.length - 1)) * 100;
                    const y = 192 - (item.revenue / maxRevenue) * 192;
                    return `L ${x}% ${y}`;
                  }).join(" ")}
                  L 100% ${192}
                  Z
                `}
                fill="url(#revenueGradient)"
              />

              {/* Line */}
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                d={`
                  M 0 ${192 - (revenueData[0]?.revenue / maxRevenue) * 192}
                  ${revenueData.slice(1).map((item, i) => {
                    const x = ((i + 1) / (revenueData.length - 1)) * 100;
                    const y = 192 - (item.revenue / maxRevenue) * 192;
                    return `L ${x}% ${y}`;
                  }).join(" ")}
                `}
                fill="none"
                stroke="rgb(74, 222, 128)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {revenueData.map((item, i) => {
                const x = (i / (revenueData.length - 1)) * 100;
                const y = 192 - (item.revenue / maxRevenue) * 192;
                
                return (
                  <g key={i}>
                    <motion.circle
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 + i * 0.05, type: "spring" }}
                      cx={`${x}%`}
                      cy={y}
                      r="4"
                      fill="rgb(74, 222, 128)"
                      className="cursor-pointer"
                    >
                      <title>{item.month}: ${item.revenue.toLocaleString()}</title>
                    </motion.circle>
                    <circle
                      cx={`${x}%`}
                      cy={y}
                      r="8"
                      fill="rgb(74, 222, 128)"
                      opacity="0.2"
                      className="cursor-pointer"
                    />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs">
            {revenueData.map((item, i) => (
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
