"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight, Sparkles } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string;
  unit: string;
  change: number;
  trend: "up" | "down";
  icon: LucideIcon;
  color: string;
  target?: number;
  subtitle?: string;
  delay?: number;
  onClick?: () => void;
}

export default function StatsCard({
  label,
  value,
  unit,
  change,
  trend,
  icon: Icon,
  color,
  target,
  subtitle,
  delay = 0,
  onClick,
}: StatsCardProps) {
  const progress = target ? (parseFloat(value.replace(/,/g, "")) / target) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="relative group cursor-pointer"
    >
      {/* Glow Effect */}
      <motion.div
        className={`absolute -inset-0.5 bg-gradient-to-r from-${color}-500/30 to-${color}-500/10 rounded-3xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
      />

      {/* Card */}
      <motion.div
        whileHover={{ scale: 1.02, y: -4 }}
        whileTap={{ scale: 0.98 }}
        className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 transition-all duration-300"
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          {/* Icon */}
          <motion.div
            whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
            className={`w-14 h-14 rounded-2xl bg-gradient-to-br from-${color}-500/20 to-${color}-500/5 flex items-center justify-center relative overflow-hidden`}
          >
            {/* Animated Background */}
            <motion.div
              className={`absolute inset-0 bg-${color}-500`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <Icon className={`w-7 h-7 text-${color}-400 relative z-10`} strokeWidth={2.5} />
          </motion.div>

          {/* Change Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: delay + 0.2 }}
            className={`
              flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold
              ${trend === "up" ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}
            `}
          >
            {trend === "up" ? (
              <ArrowUpRight className="w-3.5 h-3.5" strokeWidth={3} />
            ) : (
              <ArrowDownRight className="w-3.5 h-3.5" strokeWidth={3} />
            )}
            {Math.abs(change)}%
          </motion.div>
        </div>

        {/* Value */}
        <div className="mb-3">
          <motion.div
            key={value}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: delay + 0.1 }}
            className="text-4xl font-black text-white mb-1 tracking-tight"
          >
            {value}
            <span className="text-lg text-brand-gray mr-1">{unit}</span>
          </motion.div>
          <div className="text-sm text-brand-gray">{label}</div>
        </div>

        {/* Progress Bar */}
        {target && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-brand-gray">{subtitle}</span>
              <span className="font-bold text-white">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: delay + 0.3 }}
                className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-400 rounded-full relative overflow-hidden`}
              >
                {/* Shine Effect */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  animate={{ x: ["-100%", "100%"] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                    ease: "easeInOut",
                  }}
                  style={{ opacity: 0.3 }}
                />
              </motion.div>
            </div>
          </div>
        )}

        {/* Sparkle Effect */}
        <motion.div
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <Sparkles className={`w-5 h-5 text-${color}-400`} strokeWidth={2} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
