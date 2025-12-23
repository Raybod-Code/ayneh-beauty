"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { MOODS } from "@/app/constants";

export default function MoodSelector() {
  const [activeMood, setActiveMood] = useState(MOODS[0]);

  return (
    <section className="relative py-24 md:py-40 px-6 bg-brand-bg overflow-hidden">
      
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-16 lg:gap-24">
        
        {/* ستون چپ: لیست انتخابگر (Tab List) */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center z-10 order-2 lg:order-1">
          <div className="mb-12">
            <span className="text-brand-gold text-xs tracking-[0.4em] uppercase mb-4 block">
              Curated Experience
            </span>
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
              امروز چه <span className="italic text-brand-gold">حسی</span> دارید؟
            </h2>
            <p className="text-brand-gray font-light text-sm md:text-base leading-relaxed max-w-md">
              خدمات ما بر اساس حال و هوای شما شخصی‌سازی می‌شوند. مود خود را انتخاب کنید.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            {MOODS.map((mood) => (
              <div 
                key={mood.id}
                onClick={() => setActiveMood(mood)}
                className={`
                  group cursor-pointer relative p-6 md:p-8 rounded-3xl transition-all duration-500 border border-transparent
                  ${activeMood.id === mood.id ? "bg-white/5 border-white/10" : "hover:bg-white/[0.02]"}
                `}
              >
                {/* هدر آیتم */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <span className={`text-sm font-mono transition-colors ${activeMood.id === mood.id ? "text-brand-gold" : "text-gray-600"}`}>
                      0{MOODS.indexOf(mood) + 1}
                    </span>
                    <h3 className={`text-2xl md:text-4xl font-serif transition-colors ${activeMood.id === mood.id ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}>
                      {mood.title}
                    </h3>
                  </div>
                  
                  {/* فلش که فقط وقتی فعاله میاد */}
                  <ArrowLeft 
                    className={`
                      text-brand-gold transition-all duration-300 
                      ${activeMood.id === mood.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}
                    `} 
                  />
                </div>

                {/* توضیحات (آکاردئونی باز میشه) */}
                <div 
                  className={`
                    overflow-hidden transition-all duration-500 ease-in-out
                    ${activeMood.id === mood.id ? "max-h-24 opacity-100 mt-4" : "max-h-0 opacity-0 mt-0"}
                  `}
                >
                  <p className="text-brand-gray font-sans text-sm font-light pr-12 leading-relaxed">
                    {mood.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ستون راست: نمایشگر تصویر (Visual Display) */}
        <div className="w-full lg:w-1/2 h-[400px] lg:h-[700px] relative order-1 lg:order-2">
          {/* کانتینر چسبنده برای دسکتاپ */}
          <div className="sticky top-24 w-full h-full">
            
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMood.id}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                transition={{ duration: 0.7, ease: "circOut" }}
                className="relative w-full h-full rounded-[3rem] overflow-hidden"
              >
                <Image 
                  src={activeMood.image} 
                  alt={activeMood.title} 
                  fill 
                  className="object-cover"
                  priority
                />
                
                {/* گرادینت تیره روی عکس */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                
                {/* متن انگلیسی بزرگ روی عکس */}
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 z-20">
                  <motion.h3 
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.8 }}
                    className="text-6xl md:text-9xl font-black text-white/10 font-sans tracking-tighter select-none"
                  >
                    {activeMood.enTitle}
                  </motion.h3>
                </div>

                {/* افکت نوری رنگی پشت عکس (Glow) */}
                <div 
                  className="absolute -inset-10 -z-10 opacity-30 blur-[100px] transition-colors duration-1000"
                  style={{ backgroundColor: activeMood.color }}
                />
              </motion.div>
            </AnimatePresence>

          </div>
        </div>

      </div>
    </section>
  );
}