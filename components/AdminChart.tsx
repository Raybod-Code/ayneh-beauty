"use client";

import { motion } from "framer-motion";

export default function AdminChart() {
  // دیتای ساختگی (درآمد ۷ روز گذشته)
  const data = [40, 70, 50, 90, 60, 80, 100];
  
  // محاسبات SVG
  const max = Math.max(...data);
  const points = data.map((val, i) => `${i * 100},${100 - (val / max) * 100}`).join(" ");
  const fillPath = `M0,100 ${points} L${(data.length - 1) * 100},100 Z`;

  return (
    <div className="w-full bg-[#111] border border-white/5 rounded-[2rem] p-8 relative overflow-hidden">
      
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-white font-bold text-lg">نمودار درآمد</h3>
          <p className="text-gray-500 text-xs">عملکرد فروش در ۷ روز گذشته</p>
        </div>
        <div className="flex gap-2">
          <span className="w-3 h-3 rounded-full bg-brand-gold shadow-[0_0_10px_rgba(198,168,124,0.5)] animate-pulse" />
          <span className="text-brand-gold text-xs font-mono font-bold">Live</span>
        </div>
      </div>

      {/* ناحیه نمودار */}
      <div className="relative h-64 w-full flex items-end justify-between px-4">
        
        {/* خطوط راهنما (Grid) */}
        <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-700 pointer-events-none">
          <span>5M</span>
          <span>2.5M</span>
          <span>0</span>
        </div>

        {/* SVG Chart */}
        <svg className="absolute inset-0 h-full w-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 600 100">
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C6A87C" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#C6A87C" stopOpacity="0" />
            </linearGradient>
          </defs>
          
          {/* ناحیه رنگی زیر نمودار */}
          <motion.path
            d={`M0,100 L0,${100 - (data[0] / max) * 100} ${points} L600,100 Z`}
            fill="url(#gradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5 }}
          />

          {/* خط اصلی نمودار (Stroke) */}
          <motion.polyline
            fill="none"
            stroke="#C6A87C"
            strokeWidth="3"
            points={points}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />
        </svg>

        {/* نقاط روی نمودار (Tooltip triggers) */}
        {data.map((val, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1 + i * 0.1 }}
            className="relative z-10 w-4 h-4 bg-[#111] border-2 border-brand-gold rounded-full cursor-pointer group"
            style={{ bottom: `${(val / max) * 100}%`, left: `${(i / (data.length - 1)) * 100}%` }} // پوزیشن تقریبی برای دمو
          >
             <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
               {val}00,000 T
             </div>
          </motion.div>
        ))}

      </div>

      {/* روزهای هفته */}
      <div className="flex justify-between mt-4 text-xs text-gray-500 font-sans px-2">
         <span>شنبه</span>
         <span>۱-شنبه</span>
         <span>۲-شنبه</span>
         <span>۳-شنبه</span>
         <span>۴-شنبه</span>
         <span>۵-شنبه</span>
         <span>جمعه</span>
      </div>
    </div>
  );
}