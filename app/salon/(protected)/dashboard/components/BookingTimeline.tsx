"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, Users, Crown, ArrowUpRight } from "lucide-react";

const liveBookings = [
  {
    id: 1,
    time: "09:00",
    customer: "زهرا احمدی",
    avatar: "ZA",
    service: "کوتاهی مو",
    staff: "مریم کریمی",
    status: "in-progress",
    duration: 45,
    price: 350000,
    priority: "normal",
  },
  {
    id: 2,
    time: "10:30",
    customer: "سارا رضایی",
    avatar: "SR",
    service: "رنگ مو + هایلایت",
    staff: "فاطمه حسینی",
    status: "confirmed",
    duration: 120,
    price: 1200000,
    priority: "vip",
  },
  {
    id: 3,
    time: "12:00",
    customer: "نگار محمدی",
    avatar: "NM",
    service: "میکاپ عروس",
    staff: "مریم کریمی",
    status: "pending",
    duration: 90,
    price: 2500000,
    priority: "vip",
  },
  {
    id: 4,
    time: "14:00",
    customer: "الهام کریمی",
    avatar: "EK",
    service: "مانیکور + پدیکور",
    staff: "زهرا احمدی",
    status: "confirmed",
    duration: 60,
    price: 450000,
    priority: "normal",
  },
  {
    id: 5,
    time: "16:00",
    customer: "مریم رضایی",
    avatar: "MR",
    service: "کراتینه مو",
    staff: "فاطمه حسینی",
    status: "confirmed",
    duration: 150,
    price: 3500000,
    priority: "vip",
  },
];

export default function BookingTimeline() {
  const statusConfig = {
    "in-progress": { color: "blue", label: "در حال انجام", pulse: true },
    confirmed: { color: "green", label: "تایید شده", pulse: false },
    pending: { color: "orange", label: "در انتظار", pulse: false },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
      className="relative group"
    >
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">رزروهای زنده</h2>
              <p className="text-sm text-brand-gray">برنامه امروز شما</p>
            </div>
          </div>

          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-green-500/10 border border-green-500/20"
          >
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm font-bold text-green-400">زنده</span>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="space-y-3">
          {liveBookings.map((booking, index) => {
            const config = statusConfig[booking.status as keyof typeof statusConfig];

            return (
              <motion.div
                key={booking.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8 + index * 0.1 }}
                whileHover={{ scale: 1.01, x: 4 }}
                className="relative group/booking"
              >
                {/* VIP Badge */}
                {booking.priority === "vip" && (
                  <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold to-yellow-600 flex items-center justify-center shadow-lg shadow-brand-gold/30 z-10"
                  >
                    <Crown className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </motion.div>
                )}

                <div className="relative bg-white/[0.02] border border-white/10 rounded-2xl p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all">
                  <div className="flex items-center gap-4">
                    {/* Time */}
                    <div className="flex flex-col items-center gap-1 flex-shrink-0">
                      <div className={`w-10 h-10 rounded-xl bg-${config.color}-500/10 flex items-center justify-center relative`}>
                        <Clock className={`w-5 h-5 text-${config.color}-400`} strokeWidth={2.5} />
                        {config.pulse && (
                          <motion.div
                            className={`absolute inset-0 bg-${config.color}-500 rounded-xl`}
                            animate={{
                              scale: [1, 1.3, 1],
                              opacity: [0.3, 0, 0.3],
                            }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                        )}
                      </div>
                      <span className="text-xs font-bold text-white">{booking.time}</span>
                      <span className="text-[10px] text-brand-gray">{booking.duration}د</span>
                    </div>

                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-black shadow-lg">
                        {booking.avatar}
                      </div>
                      {booking.status === "in-progress" && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-[#0a0a0a] animate-pulse" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-bold text-white truncate">{booking.customer}</h4>
                        {booking.priority === "vip" && (
                          <span className="px-2 py-0.5 rounded-md bg-brand-gold/10 text-brand-gold text-[10px] font-black">
                            VIP
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-brand-gray truncate mb-1">{booking.service}</p>
                      <div className="flex items-center gap-2 text-xs text-brand-gray">
                        <Users className="w-3 h-3" strokeWidth={2.5} />
                        {booking.staff}
                      </div>
                    </div>

                    {/* Status & Price */}
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <div
                        className={`px-3 py-1 rounded-xl bg-${config.color}-500/10 border border-${config.color}-500/20 text-${config.color}-400 text-xs font-bold whitespace-nowrap`}
                      >
                        {config.label}
                      </div>
                      <div className="text-brand-gold font-black text-sm">
                        {booking.price.toLocaleString()}
                        <span className="text-[10px] mr-1">تومان</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/10 text-white font-bold hover:bg-white/[0.04] hover:border-white/20 transition-all flex items-center justify-center gap-2"
        >
          مشاهده همه رزروها
          <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
        </motion.button>
      </div>
    </motion.div>
  );
}
