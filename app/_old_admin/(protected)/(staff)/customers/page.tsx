"use client";

import { useState } from "react";
import { User, Search, MoreHorizontal, Star, X, Phone, Calendar, FileText, History } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

// دیتای ساختگی مشتریان
const CUSTOMERS = [
  { 
    id: 1, name: "شهرزاد", phone: "0912...", visits: 12, spent: "۱۵.۰۰۰.۰۰۰", tier: "Gold", img: "/images/service-haircut.png",
    notes: "حساسیت خفیف به اکسیدان ۹٪. عاشق قهوه تلخ.",
    history: [
      { date: "1402/09/10", service: "رنگ و لایت", stylist: "سارا", price: "4.500.000" },
      { date: "1402/08/05", service: "تراپی مو", stylist: "مینا", price: "2.000.000" },
    ]
  },
  { 
    id: 2, name: "مینا", phone: "0935...", visits: 4, spent: "۳.۲۰۰.۰۰۰", tier: "Silver", img: "/images/service-color.png",
    notes: "معمولاً ۱۰ دقیقه تاخیر دارد.",
    history: [
      { date: "1402/09/20", service: "هیرکات", stylist: "الناز", price: "800.000" },
    ]
  },
  { id: 3, name: "سارا", phone: "0919...", visits: 1, spent: "۸۰۰.۰۰۰", tier: "Bronze", img: "/images/service-spa.png", notes: "", history: [] },
  { id: 4, name: "الناز", phone: "0936...", visits: 20, spent: "۲۵.۰۰۰.۰۰۰", tier: "Gold", img: "/images/service-bridal.png", notes: "مشتری VIP. تخفیف تولد اعمال شود.", history: [] },
];

export default function CustomersPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
           <h1 className="text-3xl font-black text-white">باشگاه مشتریان</h1>
           <p className="text-gray-400 text-sm mt-1">مدیریت اعضا و سوابق</p>
        </div>
        <div className="relative w-full md:w-72">
           <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
           <input type="text" placeholder="جستجو نام، شماره..." className="w-full bg-[#111] border border-white/10 rounded-xl py-3 pr-10 pl-4 text-white focus:border-brand-gold outline-none transition-all" />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 gap-4">
         {CUSTOMERS.map((user) => (
           <motion.div 
             key={user.id} 
             layoutId={`customer-${user.id}`}
             onClick={() => setSelectedCustomer(user)}
             className="bg-[#111] border border-white/5 rounded-2xl p-4 flex items-center justify-between hover:border-brand-gold/20 hover:bg-white/[0.02] transition-all group cursor-pointer"
           >
              <div className="flex items-center gap-4">
                 <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-transparent group-hover:border-brand-gold transition-colors">
                    <Image src={user.img} alt={user.name} fill className="object-cover" />
                 </div>
                 <div>
                    <h3 className="font-bold text-white text-lg flex items-center gap-2">
                      {user.name}
                      {user.tier === "Gold" && <span className="bg-brand-gold/10 text-brand-gold text-[10px] px-2 py-0.5 rounded-full border border-brand-gold/20 flex items-center gap-1"><Star size={10} fill="currentColor"/> VIP</span>}
                    </h3>
                    <p className="text-gray-500 text-sm font-mono flex items-center gap-2 mt-1">
                       <Phone size={12} /> {user.phone}
                    </p>
                 </div>
              </div>
              
              <div className="hidden md:flex gap-12 text-center">
                 <div>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">مراجعه</span>
                    <span className="font-bold text-white text-lg">{user.visits}</span>
                 </div>
                 <div>
                    <span className="block text-[10px] text-gray-500 uppercase tracking-wider mb-1">مجموع خرید</span>
                    <span className="font-bold text-brand-gold font-mono">{user.spent}</span>
                 </div>
              </div>

              <div className="p-2 rounded-lg text-gray-500 group-hover:text-white transition-colors">
                 <MoreHorizontal size={20} />
              </div>
           </motion.div>
         ))}
      </div>

      {/* --- Customer Detail Modal (CRM View) --- */}
      <AnimatePresence>
        {selectedCustomer && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedCustomer(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              layoutId={`customer-${selectedCustomer.id}`}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden z-[70] shadow-2xl flex flex-col max-h-[90vh]"
            >
              
              {/* Modal Header */}
              <div className="relative h-32 bg-gradient-to-r from-brand-gold/20 to-[#111]">
                 <button onClick={() => setSelectedCustomer(null)} className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors z-10">
                    <X size={20} />
                 </button>
                 <div className="absolute -bottom-10 right-8 flex items-end gap-4">
                    <div className="relative w-24 h-24 rounded-full border-4 border-[#111] overflow-hidden bg-black">
                       <Image src={selectedCustomer.img} alt={selectedCustomer.name} fill className="object-cover" />
                    </div>
                    <div className="mb-3">
                       <h2 className="text-2xl font-black text-white">{selectedCustomer.name}</h2>
                       <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">{selectedCustomer.tier} MEMBER</span>
                    </div>
                 </div>
              </div>

              {/* Modal Body */}
              <div className="p-8 pt-12 overflow-y-auto">
                 
                 {/* Stats Row */}
                 <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                       <span className="text-gray-400 text-xs block mb-1">مجموع مراجعات</span>
                       <span className="text-xl font-bold text-white">{selectedCustomer.visits}</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl text-center border border-white/5">
                       <span className="text-gray-400 text-xs block mb-1">آخرین بازدید</span>
                       <span className="text-xl font-bold text-white">۲ روز پیش</span>
                    </div>
                    <div className="bg-brand-gold/10 p-4 rounded-xl text-center border border-brand-gold/20">
                       <span className="text-brand-gold/70 text-xs block mb-1">امتیاز وفاداری</span>
                       <span className="text-xl font-bold text-brand-gold">1,250</span>
                    </div>
                 </div>

                 {/* Notes Section */}
                 <div className="mb-8">
                    <h3 className="text-white font-bold mb-3 flex items-center gap-2 text-sm">
                       <FileText size={16} className="text-gray-400" /> یادداشت‌های آرایشگر (محرمانه)
                    </h3>
                    <div className="bg-yellow-500/5 border border-yellow-500/10 p-4 rounded-xl text-yellow-200/80 text-sm leading-relaxed">
                       {selectedCustomer.notes || "هیچ یادداشتی ثبت نشده است."}
                    </div>
                 </div>

                 {/* History Section */}
                 <div>
                    <h3 className="text-white font-bold mb-4 flex items-center gap-2 text-sm">
                       <History size={16} className="text-gray-400" /> تاریخچه خدمات
                    </h3>
                    <div className="space-y-3">
                       {selectedCustomer.history.length > 0 ? selectedCustomer.history.map((record: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                             <div className="flex items-center gap-3">
                                <div className="w-2 h-2 bg-green-400 rounded-full" />
                                <div>
                                   <p className="text-sm text-white font-bold">{record.service}</p>
                                   <p className="text-xs text-gray-500">با {record.stylist}</p>
                                </div>
                             </div>
                             <div className="text-right">
                                <p className="text-sm text-white font-mono">{record.price}</p>
                                <p className="text-xs text-gray-500">{record.date}</p>
                             </div>
                          </div>
                       )) : (
                          <p className="text-gray-500 text-sm text-center py-4">سابقه‌ای یافت نشد.</p>
                       )}
                    </div>
                 </div>

              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 bg-[#0a0a0a] flex gap-3">
                 <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-sm font-bold transition-colors">ارسال پیامک</button>
                 <button className="flex-[2] py-3 bg-brand-gold text-black rounded-xl text-sm font-bold hover:bg-white transition-colors">ثبت نوبت جدید</button>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}