"use client";

import { motion } from "framer-motion";
import { TrendingUp, BarChart3 } from "lucide-react";

interface GrowthChartProps {
  data: { month: string; count: number }[];
}

export default function GrowthChart({ data }: GrowthChartProps) {
  const maxValue = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="group relative">
      {/* Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold/10 via-blue-500/10 to-purple-500/10 rounded-[2rem] opacity-0 group-hover:opacity-100 blur transition-opacity duration-700" />

      {/* Card */}
      <div className="relative bg-[#111] border border-white/5 rounded-[2rem] p-6 overflow-hidden hover:border-brand-gold/20 transition-all">
        {/* Noise */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
        }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-400/10 border border-blue-400/20 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">رشد سالن‌ها</h3>
                <p className="text-xs text-brand-gray">6 ماه اخیر</p>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-2 bg-green-400/10 border border-green-400/20 rounded-xl">
              <TrendingUp className="w-4 h-4 text-green-400" strokeWidth={2.5} />
              <span className="text-sm font-bold text-green-400">+{data[data.length - 1]?.count || 0}</span>
            </div>
          </div>

          {/* Chart */}
          <div className="relative h-64">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="h-px bg-white/5" />
              ))}
            </div>

            {/* Bars */}
            <div className="relative h-full flex items-end justify-between gap-4 px-2">
              {data.map((item, index) => {
                const height = maxValue > 0 ? (item.count / maxValue) * 100 : 0;
                
                return (
                  <motion.div
                    key={index}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.6,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative flex-1 group/bar cursor-pointer"
                    style={{ originY: 1 }}
                  >
                    {/* Tooltip */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: -10 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-brand-dark border border-white/10 rounded-xl backdrop-blur-xl opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-50"
                    >
                      <div className="text-xs font-bold text-white">{item.count} سالن</div>
                      <div className="text-[10px] text-brand-gray">{item.month}</div>
                    </motion.div>

                    {/* Bar */}
                    <motion.div
                      whileHover={{ scaleY: 1.05, opacity: 1 }}
                      className="relative h-full flex flex-col justify-end"
                      style={{ originY: 1 }}
                    >
                      <div
                        className="relative rounded-t-xl overflow-hidden transition-all duration-300"
                        style={{ height: `${height}%`, minHeight: height > 0 ? '20px' : '0' }}
                      >
                        {/* Gradient Bar */}
                        <div className="absolute inset-0 bg-gradient-to-t from-brand-gold via-brand-gold/80 to-brand-gold/60 opacity-80 group-hover/bar:opacity-100 transition-opacity" />
                        
                        {/* Shine Effect */}
                        <motion.div
                          animate={{
                            y: ["-200%", "200%"],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                            delay: index * 0.2,
                          }}
                          className="absolute inset-x-0 h-full bg-gradient-to-b from-transparent via-white/30 to-transparent"
                        />

                        {/* Glow */}
                        <div className="absolute inset-0 bg-brand-gold/40 blur-lg opacity-0 group-hover/bar:opacity-100 transition-opacity" />

                        {/* Count Badge - Show on hover or if count > 0 */}
                        {item.count > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.8 + index * 0.1 }}
                            className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-brand-gold text-black rounded-lg text-xs font-black whitespace-nowrap"
                          >
                            {item.count}
                          </motion.div>
                        )}
                      </div>
                    </motion.div>

                    {/* Month Label */}
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-bold text-brand-gray whitespace-nowrap group-hover/bar:text-brand-gold transition-colors">
                      {item.month}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Legend - extra padding for month labels */}
          <div className="mt-12 pt-6 border-t border-white/5">
            <div className="flex items-center justify-center gap-6 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gradient-to-br from-brand-gold to-brand-gold/60" />
                <span className="text-brand-gray">تعداد سالن‌های جدید</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-green-400/50" />
                <span className="text-brand-gray">رشد ماهانه</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
