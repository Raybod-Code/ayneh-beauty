"use client";

import { motion } from "framer-motion";
import { TrendingUp, DollarSign, Calendar } from "lucide-react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useState } from "react";

const revenueData = [
  { date: "1 آذر", revenue: 8500000, bookings: 15, target: 10000000 },
  { date: "2 آذر", revenue: 9200000, bookings: 18, target: 10000000 },
  { date: "3 آذر", revenue: 11000000, bookings: 22, target: 10000000 },
  { date: "4 آذر", revenue: 10500000, bookings: 20, target: 10000000 },
  { date: "5 آذر", revenue: 12000000, bookings: 24, target: 10000000 },
  { date: "6 آذر", revenue: 13500000, bookings: 28, target: 10000000 },
  { date: "7 آذر", revenue: 15000000, bookings: 30, target: 10000000 },
];

const weeklyData = [
  { week: "هفته 1", revenue: 45000000, growth: 12 },
  { week: "هفته 2", revenue: 52000000, growth: 15.5 },
  { week: "هفته 3", revenue: 48000000, growth: -7.7 },
  { week: "هفته 4", revenue: 61000000, growth: 27.1 },
];

type ChartType = "daily" | "weekly" | "monthly";

export default function RevenueChart() {
  const [chartType, setChartType] = useState<ChartType>("daily");
  const [selectedMetric, setSelectedMetric] = useState<"revenue" | "bookings">("revenue");

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[#111] border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-xl"
        >
          <p className="text-white font-bold mb-2">{payload[0].payload.date || payload[0].payload.week}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-4 mb-1">
              <span className="text-brand-gray text-sm">{entry.name}:</span>
              <span className="font-bold text-white">
                {entry.name === "درآمد" || entry.name === "هدف"
                  ? `${(entry.value / 1000000).toFixed(1)}M`
                  : entry.value}
              </span>
            </div>
          ))}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9 }}
      className="relative group"
    >
      {/* Glow Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, 0] }}
              className="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30"
            >
              <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
            </motion.div>
            <div>
              <h2 className="text-2xl font-black text-white">تحلیل درآمد</h2>
              <p className="text-sm text-brand-gray">روند رشد و عملکرد مالی</p>
            </div>
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center gap-2">
            {(["daily", "weekly", "monthly"] as ChartType[]).map((type) => (
              <motion.button
                key={type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setChartType(type)}
                className={`
                  px-4 py-2 rounded-xl font-bold text-sm transition-all
                  ${
                    chartType === type
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-white/[0.02] text-brand-gray border border-white/10 hover:bg-white/[0.04]"
                  }
                `}
              >
                {type === "daily" ? "روزانه" : type === "weekly" ? "هفتگی" : "ماهانه"}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/[0.02] border border-white/10 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-4 h-4 text-green-400" strokeWidth={2.5} />
              <span className="text-xs text-brand-gray">کل درآمد</span>
            </div>
            <div className="text-2xl font-black text-white mb-1">82M</div>
            <div className="flex items-center gap-1 text-xs text-green-400">
              <TrendingUp className="w-3 h-3" strokeWidth={3} />
              +23.5%
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/[0.02] border border-white/10 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-400" strokeWidth={2.5} />
              <span className="text-xs text-brand-gray">میانگین روزانه</span>
            </div>
            <div className="text-2xl font-black text-white mb-1">11.7M</div>
            <div className="flex items-center gap-1 text-xs text-blue-400">
              <TrendingUp className="w-3 h-3" strokeWidth={3} />
              +15.2%
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white/[0.02] border border-white/10 rounded-2xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-purple-400" strokeWidth={2.5} />
              <span className="text-xs text-brand-gray">پیش‌بینی</span>
            </div>
            <div className="text-2xl font-black text-white mb-1">95M</div>
            <div className="flex items-center gap-1 text-xs text-purple-400">
              <TrendingUp className="w-3 h-3" strokeWidth={3} />
              +18.5%
            </div>
          </motion.div>
        </div>

        {/* Chart */}
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "daily" ? (
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="date"
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                  name="درآمد"
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#6366f1"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="url(#colorTarget)"
                  name="هدف"
                />
              </AreaChart>
            ) : (
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis
                  dataKey="week"
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 12 }}
                  tickLine={false}
                />
                <YAxis
                  stroke="#666"
                  tick={{ fill: "#999", fontSize: 12 }}
                  tickLine={false}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} name="درآمد" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span className="text-sm text-brand-gray">درآمد واقعی</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-dashed border-purple-500" />
            <span className="text-sm text-brand-gray">هدف</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
