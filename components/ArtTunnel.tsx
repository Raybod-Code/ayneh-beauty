"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

export default function ArtTunnel() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // حرکت نرم (Spring)
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, mass: 0.5 });

  // --- تنظیمات حرکت (Velocity) ---
  // ردیف اول به چپ میره
  const x1 = useTransform(smoothProgress, [0, 1], ["20%", "-20%"]);
  // ردیف دوم به راست میره
  const x2 = useTransform(smoothProgress, [0, 1], ["-20%", "20%"]);
  // ردیف سوم دوباره به چپ (کندتر)
  const x3 = useTransform(smoothProgress, [0, 1], ["10%", "-10%"]);

  // چرخش المان‌ها
  const rotate = useTransform(smoothProgress, [0, 1], [-10, 10]);

  return (
    <section ref={containerRef} className="py-32 md:py-48 bg-[#F5F5F0] overflow-hidden relative">
      
      {/* پترن پس‌زمینه خیلی محو */}
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/noise.png')] pointer-events-none mix-blend-multiply" />

      <div className="flex flex-col gap-24 md:gap-40 relative z-10">

        {/* === ردیف ۱: STYLE === */}
        <div className="relative w-full h-[30vh] md:h-[40vh] flex items-center">
          {/* متن متحرک */}
          <motion.div style={{ x: x1 }} className="absolute w-[120vw] md:w-[100vw] h-full left-[-10%] opacity-10 select-none">
             <Image src="/images/text-style.png" alt="STYLE" fill className="object-contain" />
          </motion.div>
          
          {/* المان شناور روی متن */}
          <div className="container mx-auto px-6 relative flex justify-end items-center h-full">
             <motion.div style={{ rotate }} className="relative w-48 h-48 md:w-80 md:h-80 z-20">
                <Image src="/images/floating-brush.png" alt="Brush" fill className="object-contain drop-shadow-2xl" />
             </motion.div>
             <div className="absolute left-6 md:left-20 top-1/2 -translate-y-1/2 max-w-md">
                <h3 className="text-4xl md:text-6xl font-black font-sans text-brand-dark mb-4">معماریِ <span className="text-brand-gold font-serif italic">استایل</span></h3>
                <p className="text-gray-500 font-sans text-sm md:text-base leading-loose">
                  طراحی مو بر اساس هندسه صورت شما. <br/> ما فقط کوتاه نمی‌کنیم، ما خلق می‌کنیم.
                </p>
             </div>
          </div>
        </div>

        {/* === ردیف ۲: PURE === */}
        <div className="relative w-full h-[30vh] md:h-[40vh] flex items-center bg-white/50 backdrop-blur-sm py-10">
          <motion.div style={{ x: x2 }} className="absolute w-[120vw] md:w-[100vw] h-full right-[-10%] opacity-10 select-none">
             <Image src="/images/text-pure.png" alt="PURE" fill className="object-contain" />
          </motion.div>

          <div className="container mx-auto px-6 relative flex justify-start items-center h-full">
             <div className="absolute right-6 md:right-40 top-1/2 -translate-y-1/2 max-w-md text-right z-20">
                <h3 className="text-4xl md:text-6xl font-black font-sans text-brand-dark mb-4">خلوصِ <span className="text-brand-gold font-serif italic">مطلق</span></h3>
                <p className="text-gray-500 font-sans text-sm md:text-base leading-loose">
                  بازگشت به ریشه‌ها با متریال‌های ارگانیک. <br/> پوستی که نفس می‌کشد.
                </p>
             </div>
             <motion.div style={{ rotate: useTransform(rotate, r => r * -1) }} className="relative w-40 h-40 md:w-64 md:h-64 z-20">
                <Image src="/images/floating-perfume.png" alt="Perfume" fill className="object-contain drop-shadow-2xl" />
             </motion.div>
          </div>
        </div>

        {/* === ردیف ۳: ART === */}
        <div className="relative w-full h-[30vh] md:h-[40vh] flex items-center">
          <motion.div style={{ x: x3 }} className="absolute w-[120vw] md:w-[100vw] h-full left-[-10%] opacity-10 select-none brightness-0">
             <Image src="/images/text-art.png" alt="ART" fill className="object-contain" />
          </motion.div>

          <div className="container mx-auto px-6 flex flex-col items-center justify-center text-center z-20">
             <p className="text-2xl md:text-5xl font-light leading-relaxed font-serif italic text-brand-dark mb-8">
               "قیچیِ ما، قلم‌موی ماست."
             </p>
             <button className="px-10 py-4 rounded-full border border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-black transition-all duration-300 uppercase tracking-widest text-sm font-bold font-sans bg-white/80 backdrop-blur-md">
               شروع تغییر
             </button>
          </div>
        </div>

      </div>
    </section>
  );
}