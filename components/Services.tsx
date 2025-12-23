"use client";

import { useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { SERVICES } from "@/app/constants"; // ایمپورت دیتا از فایل ثابت

export default function Services() {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  
  // لاجیک حرکت عکس دنبال‌کننده ماوس
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    // تنظیم آفست برای قرارگیری عکس کنار نشانگر موس
    x.set(e.clientX + 20); 
    y.set(e.clientY + 20);
  };

  return (
    <section 
      className="relative bg-brand-dark py-20 md:py-32 px-6 overflow-hidden min-h-screen"
      onMouseMove={handleMouseMove}
    >
      
      {/* هدر بخش - کاملاً ریسپانسیو */}
      <div className="max-w-7xl mx-auto mb-16 md:mb-20 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-white/10 pb-8">
        <div>
          <h2 className="text-4xl md:text-7xl font-light mb-4 text-white font-sans font-black">
            خدمات ما
          </h2>
          <p className="text-brand-gray text-base md:text-lg font-sans max-w-sm md:max-w-none">
            تلفیقی از هنر، تکنیک و اصالت برای زیبایی شما
          </p>
        </div>
        <div className="hidden md:block text-right">
           <span className="text-xs tracking-[0.3em] uppercase opacity-50 text-white">Service Menu</span>
        </div>
      </div>

      {/* لیست خدمات */}
      <div className="max-w-7xl mx-auto flex flex-col">
        {SERVICES.map((service) => (
          <div 
            key={service.id}
            className="group relative flex flex-col md:flex-row md:items-center justify-between py-8 md:py-10 border-b border-white/10 hover:border-brand-gold/50 transition-colors duration-500 cursor-pointer"
            onMouseEnter={() => setActiveImage(service.image)}
            onMouseLeave={() => setActiveImage(null)}
          >
            {/* اطلاعات سمت راست */}
            <div className="flex flex-col md:flex-row md:items-baseline gap-2 md:gap-8 z-10">
              <span className="text-xs text-brand-gray/50 font-serif tracking-wider w-10">
                0{service.id}
              </span>
              <h3 className="text-2xl md:text-5xl font-light text-white group-hover:text-brand-gold group-hover:translate-x-[-10px] transition-all duration-500 font-sans">
                {service.title}
              </h3>
            </div>
            
            {/* قیمت و آیکون */}
            <div className="flex items-center justify-between md:justify-end gap-8 z-10 mt-4 md:mt-0 w-full md:w-auto">
              <span className="text-sm md:text-lg text-brand-gray group-hover:text-white transition-colors font-sans">
                {service.price}
              </span>
              <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 text-brand-gold opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" />
            </div>
            
            {/* لایه رنگی موقع هاور (فقط دسکتاپ) */}
            <div className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block rounded-lg" />
          </div>
        ))}
      </div>

      {/* عکس شناور (فقط دسکتاپ) */}
      <motion.div
        className="fixed top-0 left-0 w-[300px] h-[400px] xl:w-[400px] xl:h-[500px] rounded-2xl overflow-hidden pointer-events-none z-50 hidden md:block mix-blend-hard-light shadow-2xl border border-white/10"
        style={{ x: xSpring, y: ySpring }}
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{
          opacity: activeImage ? 1 : 0,
          scale: activeImage ? 1 : 0.5,
        }}
      >
        {activeImage && (
          <Image 
            src={activeImage} 
            alt="Service Preview" 
            fill 
            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
            sizes="(max-width: 768px) 0vw, 400px"
          />
        )}
      </motion.div>

    </section>
  );
}