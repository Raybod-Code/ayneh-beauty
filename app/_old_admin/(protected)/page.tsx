"use client";

import { motion } from "framer-motion";
import { Users, ShoppingBag, CalendarCheck, DollarSign, Bell } from "lucide-react";
import AdminChart from "@/components/AdminChart"; // 👈 ایمپورت نمودار جدید
// import type { Metadata } from "next";
// export const metadata: Metadata = {
//   title: "پنل مدیریت",
//   robots: {
//     index: false, // این باعث میشه گوگل این صفحه رو نشون نده (محرمانه بمونه)
//     follow: false,
//   },
// };
const STATS = [
  { title: "درآمد امروز", value: "۱۲.۵۰۰.۰۰۰", unit: "تومان", icon: DollarSign, color: "text-green-400", bg: "bg-green-400/10" },
  { title: "نوبت‌های امروز", value: "۸", unit: "نفر", icon: CalendarCheck, color: "text-blue-400", bg: "bg-blue-400/10" },
  { title: "سفارشات جدید", value: "۳", unit: "بسته", icon: ShoppingBag, color: "text-purple-400", bg: "bg-purple-400/10" },
  { title: "مشتریان جدید", value: "۵", unit: "نفر", icon: Users, color: "text-brand-gold", bg: "bg-brand-gold/10" },
];

const ACTIVITIES = [
  { text: "رزرو جدید از سارا برای رنگ مو", time: "۵ دقیقه پیش", type: "booking" },
  { text: "سفارش محصول (شامپو خاویار)", time: "۲۰ دقیقه پیش", type: "order" },
  { text: "کاربر جدید عضو شد: مینا", time: "۱ ساعت پیش", type: "user" },
  { text: "لغو نوبت توسط زهرا", time: "۲ ساعت پیش", type: "alert" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      
      {/* هدر */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">روز بخیر، خانم مدیر 👋</h1>
          <p className="text-gray-400">گزارش لحظه‌ای عملکرد سالن آینه.</p>
        </div>
        <div className="text-right hidden md:block">
           <span className="text-brand-gold font-mono text-xl font-bold">14:02</span>
           <span className="text-gray-500 text-sm block">چهارشنبه، ۲۸ آذر</span>
        </div>
      </div>

      {/* کارت‌های آمار */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-[#111] border border-white/5 p-6 rounded-[2rem] flex items-center justify-between group hover:border-brand-gold/30 transition-all hover:bg-white/[0.02]"
          >
            <div>
              <p className="text-gray-500 text-xs mb-2 font-bold uppercase tracking-wider">{stat.title}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white font-mono">{stat.value}</span>
                <span className="text-xs text-gray-400">{stat.unit}</span>
              </div>
            </div>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
              <stat.icon size={24} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* بخش میانی: نمودار و فعالیت‌ها */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* نمودار (۲ ستون) */}
        <div className="lg:col-span-2">
           <AdminChart />
        </div>

        {/* فعالیت‌های اخیر (۱ ستون) */}
        <div className="lg:col-span-1 bg-[#111] border border-white/5 rounded-[2rem] p-6 relative overflow-hidden">
           <div className="flex items-center gap-2 mb-6">
              <Bell size={18} className="text-brand-gold" />
              <h3 className="font-bold text-white">فعالیت‌های اخیر</h3>
           </div>
           
           <div className="space-y-6 relative z-10">
             {ACTIVITIES.map((act, i) => (
               <div key={i} className="flex gap-4 items-start">
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-3 h-3 rounded-full ${act.type === 'alert' ? 'bg-red-500' : 'bg-brand-gold'}`} />
                    {i !== ACTIVITIES.length - 1 && <div className="w-[1px] h-full bg-white/10 min-h-[30px]" />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-300 leading-snug">{act.text}</p>
                    <span className="text-[10px] text-gray-600 font-mono">{act.time}</span>
                  </div>
               </div>
             ))}
           </div>

           {/* افکت نویز پس‌زمینه */}
           <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/noise.png')] pointer-events-none" />
        </div>

      </div>
    </div>
  );
}