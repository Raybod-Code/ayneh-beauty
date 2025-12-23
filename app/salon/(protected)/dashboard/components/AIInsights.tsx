"use client";

import { motion } from "framer-motion";
import { Brain, Sparkles, AlertCircle, TrendingUp, ArrowUpRight } from "lucide-react";

const aiInsights = [
  {
    id: 1,
    type: "warning",
    title: "پیک ساعات",
    message: "امروز ساعت 14-16 شلوغ‌ترین زمان است. پیشنهاد: یک کارمند اضافه اختصاص دهید.",
    icon: AlertCircle,
    color: "orange",
    action: "مشاهده جزئیات",
    priority: "high",
  },
  {
    id: 2,
    type: "success",
    title: "رشد درآمد",
    message: "درآمد شما این هفته 23% افزایش داشته. روند عالی است!",
    icon: TrendingUp,
    color: "green",
    action: "گزارش کامل",
    priority: "medium",
  },
  {
    id: 3,
    type: "info",
    title: "پیشنهاد هوشمند",
    message: "سرویس رنگ مو محبوب‌ترین انتخاب این ماه است. پیشنهاد: پکیج ویژه بسازید.",
    icon: Brain,
    color: "blue",
    action: "ایجاد پکیج",
    priority: "low",
  },
];

export default function AIInsights() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-gradient-to-br from-purple-500/5 to-blue-500/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            animate={{
              rotate: [0, 10, -10, 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-lg shadow-purple-500/30"
          >
            <Brain className="w-6 h-6 text-white" strokeWidth={2.5} />
          </motion.div>
          <div>
            <h2 className="text-2xl font-black text-white flex items-center gap-2">
              تحلیل‌های هوشمند
              <Sparkles className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
            </h2>
            <p className="text-sm text-brand-gray">پیشنهادات و هشدارهای AI برای بهبود عملکرد</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {aiInsights.map((insight, index) => {
            const Icon = insight.icon;
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -4 }}
                className="relative group/card"
              >
                <div className={`absolute -inset-0.5 bg-${insight.color}-500/20 rounded-2xl blur opacity-0 group-hover/card:opacity-100 transition-opacity duration-300`} />

                <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                  {/* Priority Badge */}
                  <div className="absolute top-2 left-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        insight.priority === "high"
                          ? "bg-red-500"
                          : insight.priority === "medium"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      } animate-pulse`}
                    />
                  </div>

                  <div className="flex items-start gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-${insight.color}-500/10 flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 text-${insight.color}-400`} strokeWidth={2.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white mb-1">{insight.title}</h3>
                      <p className="text-sm text-brand-gray leading-relaxed">{insight.message}</p>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full mt-3 px-4 py-2 rounded-xl bg-${insight.color}-500/10 border border-${insight.color}-500/20 text-${insight.color}-400 font-bold text-sm hover:bg-${insight.color}-500/20 transition-all flex items-center justify-center gap-2`}
                  >
                    {insight.action}
                    <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
