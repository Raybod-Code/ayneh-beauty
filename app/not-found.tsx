"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Home } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div className="h-screen w-full bg-[#050505] text-white flex flex-col items-center justify-center relative overflow-hidden font-sans">
      
      {/* پس‌زمینه نویزدار */}
      <div className="absolute inset-0 opacity-[0.05] bg-[url('/images/noise.png')] pointer-events-none" />

      {/* المان‌های معلق در پس‌زمینه */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 -right-20 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"
      />
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-1/4 -left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"
      />

      <div className="relative z-10 text-center px-6">
        
        {/* عدد 404 بزرگ */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[10rem] md:text-[15rem] font-black text-white/5 leading-none select-none font-serif"
        >
          404
        </motion.h1>

        {/* تصویر آینه (به عنوان نماد جستجو) */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 md:w-60 md:h-60 opacity-50 grayscale hover:grayscale-0 transition-all duration-700"
        >
           <Image src="/images/floating-mirror.png" alt="Lost" fill className="object-contain drop-shadow-2xl" />
        </motion.div>

        {/* متن پیام */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-10 md:mt-20 space-y-6"
        >
          <h2 className="text-2xl md:text-4xl font-bold text-white">
            انعکاس این صفحه پیدا نشد...
          </h2>
          <p className="text-gray-400 max-w-md mx-auto leading-relaxed">
            به نظر می‌رسد مسیری که در جستجوی آن بودید، وجود ندارد یا جابجا شده است. <br/>
            اما زیبایی همیشه در خانه منتظر شماست.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/" 
              className="px-8 py-3 bg-brand-gold text-black rounded-full font-bold hover:bg-white transition-colors flex items-center gap-2 group"
            >
              <Home size={18} />
              بازگشت به خانه
            </Link>
            <Link 
              href="/shop" 
              className="px-8 py-3 border border-white/10 rounded-full font-bold hover:bg-white/5 transition-colors flex items-center gap-2 text-gray-300"
            >
              سری به بوتیک بزنید
              <ArrowRight size={18} />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}