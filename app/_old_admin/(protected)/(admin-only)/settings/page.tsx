"use client";

import { useState } from "react";
import { Save, Bell, Lock, Moon, Globe } from "lucide-react";

export default function SettingsPage() {
  const [notif, setNotif] = useState(true);
  const [booking, setBooking] = useState(true);

  return (
    <div className="max-w-3xl mx-auto space-y-10">
      <h1 className="text-3xl font-black text-white">تنظیمات سیستم</h1>
      
      <div className="bg-[#111] border border-white/5 rounded-3xl p-8 space-y-8">
         
         {/* بخش عمومی */}
         <div>
            <h3 className="text-brand-gold font-bold mb-4 flex items-center gap-2"><Globe size={18}/> تنظیمات عمومی</h3>
            <div className="flex items-center justify-between py-4 border-b border-white/5">
               <span>فعال بودن سیستم رزرو آنلاین</span>
               <button onClick={() => setBooking(!booking)} className={`w-12 h-6 rounded-full p-1 transition-colors ${booking ? 'bg-green-500' : 'bg-gray-600'}`}>
                 <div className={`w-4 h-4 bg-white rounded-full transition-transform ${booking ? 'translate-x-0' : '-translate-x-6'}`} />
               </button>
            </div>
            <div className="flex items-center justify-between py-4">
               <span>حالت تعمیر و نگهداری (Maintenance)</span>
               <div className="w-12 h-6 bg-gray-600 rounded-full p-1"><div className="w-4 h-4 bg-white rounded-full -translate-x-6" /></div>
            </div>
         </div>

         {/* بخش اعلان‌ها */}
         <div>
            <h3 className="text-brand-gold font-bold mb-4 flex items-center gap-2"><Bell size={18}/> اعلان‌ها</h3>
            <div className="flex items-center justify-between py-4 border-b border-white/5">
               <span>ارسال پیامک تایید نوبت</span>
               <button onClick={() => setNotif(!notif)} className={`w-12 h-6 rounded-full p-1 transition-colors ${notif ? 'bg-green-500' : 'bg-gray-600'}`}>
                 <div className={`w-4 h-4 bg-white rounded-full transition-transform ${notif ? 'translate-x-0' : '-translate-x-6'}`} />
               </button>
            </div>
         </div>

         <button className="w-full bg-white text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-gold transition-colors">
            <Save size={18} /> ذخیره تغییرات
         </button>

      </div>
    </div>
  );
}