"use client";

import { useState } from "react";
import { 
  User, Clock, X, Save, 
  Coffee, Droplets, Wine, 
  MessageCircle, VolumeX, Zap, BatteryLow, 
  Wind, Waves, Feather, AlertCircle, 
  Activity, Snowflake, CheckCircle2,
  ThermometerSun
} from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";

// مشتریان امروز (Mock Data)
const TODAY_CLIENTS = [
  { id: 1, name: "سارا محمدی", time: "14:00", service: "رنگ و لایت", img: "/images/service-color.png" },
  { id: 2, name: "مینا راد", time: "16:30", service: "کوتاهی ژورنالی", img: "/images/service-haircut.png" },
];

// گزینه‌های هوشمند با آیکون‌های Lucide
const SMART_TAGS = {
  drinks: [
    { label: "قهوه تلخ", icon: Coffee },
    { label: "دمنوش/چای", icon:  Coffee }, // یا CupSoda اگر موجود باشه
    { label: "آب خنک", icon: Droplets },
    { label: "نوشیدنی طبیعی", icon: Wine }, // به عنوان نماد آبمیوه/اسموتی
  ],
  mood: [
    { label: "کم‌حرف / آرام", icon: VolumeX },
    { label: "پرحرف / اجتماعی", icon: MessageCircle },
    { label: "خسته / ریلکس", icon: BatteryLow },
    { label: "پرانرژی / شاد", icon: Zap },
  ],
  hair: [
    { label: "خشک / آسیب‌دیده", icon: Wind },
    { label: "چرب", icon: Droplets },
    { label: "نازک / کم‌حجم", icon: Feather },
    { label: "ضخیم / فر", icon: Waves },
  ],
  scalp: [
    { label: "حساس / ملتهب", icon: Activity },
    { label: "شوره دارد", icon: Snowflake },
    { label: "سالم", icon: CheckCircle2 },
    { label: "چرب", icon: ThermometerSun },
  ]
};

export default function StylistPanel() {
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [notes, setNotes] = useState<string[]>([]); // تگ‌های انتخاب شده

  const toggleTag = (tagLabel: string) => {
    if (notes.includes(tagLabel)) {
      setNotes(notes.filter(t => t !== tagLabel));
    } else {
      setNotes([...notes, tagLabel]);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans pb-20 selection:bg-brand-gold selection:text-black">
      <Navbar />
      
      <div className="pt-32 px-6 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
          میز کار استایلیست <span className="text-brand-gold text-4xl">.</span>
        </h1>
        <p className="text-gray-400 text-sm mb-8">لیست مشتریان امروز • {new Date().toLocaleDateString('fa-IR')}</p>

        {/* لیست مشتریان */}
        <div className="space-y-4">
          {TODAY_CLIENTS.map((client) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={client.id}
              onClick={() => { setSelectedClient(client); setNotes([]); }}
              className="bg-[#111] border border-white/10 rounded-2xl p-4 flex items-center gap-4 cursor-pointer hover:border-brand-gold transition-colors active:scale-95 group"
            >
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-brand-gold transition-colors">
                <Image src={client.img} alt={client.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-white group-hover:text-brand-gold transition-colors">{client.name}</h3>
                <p className="text-gray-500 text-sm">{client.service}</p>
              </div>
              <div className="text-right">
                <span className="flex items-center gap-2 text-xl font-black font-mono text-white">
                  <Clock size={18} className="text-brand-gold"/> {client.time}
                </span>
                <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-md mt-1 inline-block">
                  در انتظار
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* --- MODAL: یادداشت هوشمند --- */}
      <AnimatePresence>
        {selectedClient && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedClient(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 left-0 w-full bg-[#151515] border-t border-white/10 rounded-t-[2.5rem] z-[70] max-h-[85vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-6 md:p-8">
                {/* دستگیره بالای مودال */}
                <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mb-8" />
                
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-full overflow-hidden border border-white/20">
                       <Image src={selectedClient.img} alt={selectedClient.name} fill className="object-cover" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">ثبت جزئیات</h2>
                      <p className="text-brand-gold text-sm mt-0.5">{selectedClient.name}</p>
                    </div>
                  </div>
                  <button onClick={() => setSelectedClient(null)} className="bg-white/5 hover:bg-white/10 p-3 rounded-full text-white transition-colors">
                    <X size={20}/>
                  </button>
                </div>

                <div className="space-y-8">
                  
                  {/* بخش نوشیدنی */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       نوشیدنی مورد علاقه
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {SMART_TAGS.drinks.map((item, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => toggleTag(item.label)} 
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all border 
                            ${notes.includes(item.label) 
                              ? "bg-brand-gold text-black border-brand-gold font-bold shadow-[0_0_15px_rgba(198,168,124,0.3)]" 
                              : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                          <item.icon size={16} />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* بخش مود اخلاقی */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       مود و رفتار
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {SMART_TAGS.mood.map((item, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => toggleTag(item.label)} 
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all border 
                            ${notes.includes(item.label) 
                              ? "bg-blue-500 text-white border-blue-500 font-bold shadow-[0_0_15px_rgba(59,130,246,0.3)]" 
                              : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                          <item.icon size={16} />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* وضعیت مو */}
                  <div>
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                       آنالیز مو و پوست سر
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {/* ترکیب لیست مو و کف سر برای سادگی */}
                      {[...SMART_TAGS.hair, ...SMART_TAGS.scalp].map((item, idx) => (
                        <button 
                          key={idx} 
                          onClick={() => toggleTag(item.label)} 
                          className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm transition-all border 
                            ${notes.includes(item.label) 
                              ? "bg-purple-500 text-white border-purple-500 font-bold shadow-[0_0_15px_rgba(168,85,247,0.3)]" 
                              : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                            }`}
                        >
                          <item.icon size={16} />
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>

                <div className="mt-12 pt-6 border-t border-white/10">
                   <button 
                     onClick={() => setSelectedClient(null)}
                     className="w-full bg-brand-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors flex items-center justify-center gap-3 shadow-lg"
                   >
                     <Save size={20} /> 
                     ذخیره در پرونده مشتری
                   </button>
                </div>

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}