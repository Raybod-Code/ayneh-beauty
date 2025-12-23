"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function VisualStory() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // اسکرول نرم برای کل سکشن
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // --- تنظیمات پارالاکس دقیق ---
  
  // سکانس ۱: استایل (حرکت متن از راست به چپ، براش از پایین به بالا)
  const styleX = useTransform(scrollYProgress, [0.1, 0.4], ["30%", "0%"]);
  const styleOpacity = useTransform(scrollYProgress, [0.1, 0.3], [0, 0.5]);
  const brushY = useTransform(scrollYProgress, [0.1, 0.5], ["20%", "-10%"]);
  const brushRotate = useTransform(scrollYProgress, [0.1, 0.5], [-10, 10]);

  // سکانس ۲: خلوص (بزرگ شدن متن، چرخش عطر)
  const pureScale = useTransform(scrollYProgress, [0.3, 0.6], [0.8, 1]);
  const pureOpacity = useTransform(scrollYProgress, [0.3, 0.5], [0, 0.4]);
  const perfumeY = useTransform(scrollYProgress, [0.3, 0.7], ["10%", "-10%"]);
  const perfumeRotate = useTransform(scrollYProgress, [0.3, 0.8], [-15, 15]);

  // سکانس ۳: هنر (ظاهر شدن از پایین)
  const artY = useTransform(scrollYProgress, [0.6, 0.9], ["50%", "0%"]);
  const artOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);

  return (
    <section ref={containerRef} className="relative bg-[#050505] overflow-hidden py-24 md:py-48">
      
      {/* === سکانس ۱: STYLE === */}
      <div className="relative min-h-[80vh] md:min-h-screen w-full flex flex-col md:flex-row items-center justify-center mb-20 md:mb-0">
        
        {/* متن پس‌زمینه (متحرک) */}
        <motion.div 
          style={{ x: styleX, opacity: styleOpacity }} 
          className="absolute right-[-5%] top-20 md:top-auto w-[120vw] md:w-[80vw] h-[30vh] md:h-[50vh] z-0 pointer-events-none"
        >
          <Image src="/images/text-style.png" alt="STYLE" fill className="object-contain" />
        </motion.div>

        {/* محتوا (متن‌ها) */}
        <div className="relative z-10 max-w-2xl px-6 text-center mt-40 md:mt-0">
          <span className="text-brand-gold text-xs md:text-sm tracking-[0.4em] uppercase mb-6 block font-sans font-bold">
            The Art of Hair
          </span>
          {/* 👇 اصلاح فونت: استفاده از font-sans (دوران) */}
          <h2 className="text-5xl md:text-8xl font-sans font-black text-white mb-8 leading-tight">
            معماریِ <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-white">استایل</span>
          </h2>
          <p className="text-gray-400 text-base md:text-xl leading-loose max-w-lg mx-auto font-sans font-light">
            در آینه، قیچی ابزار نیست؛ امتدادِ ذهنِ هنرمند است. <br className="hidden md:block"/>
            ما شخصیت شما را بازآفرینی می‌کنیم.
          </p>
        </div>

        {/* المان شناور (براش) */}
        <motion.div 
          style={{ y: brushY, rotate: brushRotate }} 
          className="absolute left-[-10%] bottom-0 md:left-[5%] md:bottom-20 w-[60vw] h-[60vw] md:w-[25vw] md:h-[25vw] z-20 opacity-80 pointer-events-none"
        >
           <Image src="/images/floating-brush.png" alt="Brush" fill className="object-contain drop-shadow-2xl" />
        </motion.div>
      </div>


      {/* === سکانس ۲: PURE === */}
      <div className="relative min-h-[80vh] md:min-h-screen w-full flex items-center justify-center mt-20 md:mt-0">
        
        {/* متن پس‌زمینه (PURE) */}
        <motion.div 
          style={{ scale: pureScale, opacity: pureOpacity }} 
          className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none"
        >
          <div className="relative w-[100vw] md:w-[80vw] h-[40vh] md:h-[60vh]">
             <Image src="/images/text-pure.png" alt="PURE" fill className="object-contain" />
          </div>
        </motion.div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center max-w-7xl px-6 w-full">
           
           {/* المان شناور (عطر) */}
           <motion.div 
             style={{ y: perfumeY, rotate: perfumeRotate }} 
             className="relative w-full h-[300px] md:h-[500px] order-2 md:order-1"
           >
              <Image src="/images/floating-perfume.png" alt="Pure Essence" fill className="object-contain drop-shadow-[0_0_50px_rgba(198,168,124,0.1)]" />
           </motion.div>

           {/* متن‌ها */}
           <div className="text-center md:text-right order-1 md:order-2 pt-10 md:pt-0">
              <span className="text-brand-gold text-xs md:text-sm tracking-[0.4em] uppercase mb-6 block font-sans font-bold">
                Skin & Soul
              </span>
              {/* 👇 اصلاح فونت */}
              <h2 className="text-5xl md:text-7xl font-sans font-black text-white mb-8">
                خلوصِ <span className="italic font-serif font-light text-brand-gold">مطلق</span>
              </h2>
              <p className="text-gray-400 text-base md:text-xl leading-loose font-sans font-light pl-0 md:pl-20">
                بازگشت به ریشه‌ها با متریال‌های ارگانیک. <br/>
                پوستی که نفس می‌کشد، روحی که آرام می‌گیرد.
              </p>
           </div>
        </div>
      </div>

      {/* === سکانس ۳: ART === */}
      <div className="relative h-[50vh] w-full flex items-center justify-center py-20">
         <motion.div 
           style={{ y: artY, opacity: artOpacity }}
           className="text-center z-10 px-4"
         >
            <div className="relative w-[70vw] md:w-[50vw] h-[15vh] md:h-[25vh] mx-auto mb-10 opacity-90">
               <Image src="/images/text-art.png" alt="ART" fill className="object-contain invert brightness-0 filter" />
            </div>
            {/* 👇 اصلاح فونت: استفاده از font-sans برای فارسی */}
            <p className="text-xl md:text-4xl text-white/90 font-sans font-light italic tracking-wide">
              &quot;زیبایی یعنی حذفِ هر چیزی که اضافیست.&quot;
            </p>
         </motion.div>
      </div>

    </section>
  );
}