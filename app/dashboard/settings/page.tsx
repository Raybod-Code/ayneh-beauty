"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import { User, MapPin, Save, Camera, ArrowLeft, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function UserSettings() {
  const [avatar, setAvatar] = useState("/images/service-haircut.png");

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-brand-gold selection:text-black">
      <CustomCursor />
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        
        {/* هدر صفحه */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-black font-serif mb-2">تنظیمات حساب</h1>
            <p className="text-gray-400 text-sm font-sans">مدیریت اطلاعات شخصی و آدرس‌ها</p>
          </div>
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm border border-white/10 px-4 py-2 rounded-full">
             <ArrowLeft size={16} /> بازگشت به داشبورد
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* --- ستون راست: عکس پروفایل --- */}
          <div className="md:col-span-1">
            <div className="bg-[#111] border border-white/10 rounded-[2rem] p-6 text-center sticky top-32">
               <div className="relative w-32 h-32 mx-auto mb-6">
                 <div className="w-full h-full rounded-full overflow-hidden border-2 border-brand-gold p-1">
                   <div className="w-full h-full rounded-full overflow-hidden relative">
                     <Image src={avatar} alt="Avatar" fill className="object-cover" />
                   </div>
                 </div>
                 {/* دکمه آپلود */}
                 <button className="absolute bottom-0 right-0 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-brand-gold transition-colors shadow-lg">
                   <Camera size={18} />
                 </button>
               </div>
               
               <h3 className="font-bold text-lg mb-1">شهرزاد عزیز</h3>
               <span className="text-xs text-brand-gold uppercase tracking-widest bg-brand-gold/10 px-3 py-1 rounded-full">Gold Member</span>
            </div>
          </div>

          {/* --- ستون چپ: فرم‌ها --- */}
          <div className="md:col-span-2 space-y-8">
            
            {/* 1. اطلاعات پایه */}
            <div className="bg-[#111] border border-white/10 rounded-[2rem] p-8">
               <h3 className="font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                 <User size={20} className="text-brand-gold" /> اطلاعات هویتی
               </h3>
               <div className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs text-gray-500">نام</label>
                       <input type="text" defaultValue="شهرزاد" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-brand-gold outline-none transition-colors" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs text-gray-500">نام خانوادگی</label>
                       <input type="text" defaultValue="محمدی" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-brand-gold outline-none transition-colors" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-xs text-gray-500">شماره موبایل</label>
                    <input type="tel" defaultValue="09123456789" disabled className="w-full bg-white/5 border border-transparent rounded-xl p-3 text-gray-400 cursor-not-allowed text-left font-mono" />
                    <p className="text-[10px] text-gray-600 text-right">شماره موبایل قابل تغییر نیست.</p>
                 </div>
               </div>
            </div>

            {/* 2. مدیریت آدرس (برای فروشگاه) */}
            <div className="bg-[#111] border border-white/10 rounded-[2rem] p-8">
               <h3 className="font-bold text-white mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
                 <MapPin size={20} className="text-brand-gold" /> آدرس ارسال سفارشات
               </h3>
               
               <div className="space-y-4">
                 <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-xs text-gray-500">استان</label>
                       <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-gray-300 outline-none">
                         <option>فارس</option>
                         <option>تهران</option>
                         <option>اصفهان</option>
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs text-gray-500">شهر</label>
                       <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-gray-300 outline-none">
                         <option>شیراز</option>
                         <option>صدرا</option>
                       </select>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs text-gray-500">آدرس دقیق پستی</label>
                    <textarea rows={3} className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-brand-gold outline-none transition-colors resize-none" placeholder="خیابان، کوچه، پلاک، واحد..."></textarea>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs text-gray-500">کد پستی (اختیاری)</label>
                    <input type="number" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-brand-gold outline-none text-left font-mono" />
                 </div>
               </div>
            </div>

            {/* دکمه ذخیره */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-brand-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(198,168,124,0.3)]"
            >
              <Save size={20} />
              ذخیره تغییرات
            </motion.button>

          </div>

        </div>
      </div>
      <Footer />
    </main>
  );
}