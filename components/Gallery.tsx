"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";

// لیست عکس‌های گالری (دمو)
const GALLERY_IMAGES = [
  "https://images.pexels.com/photos/3993444/pexels-photo-3993444.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/3993313/pexels-photo-3993313.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/3992875/pexels-photo-3992875.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600",
  "https://images.pexels.com/photos/457701/pexels-photo-457701.jpeg?auto=compress&cs=tinysrgb&w=600",
];

export default function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // حرکت نرم برای پارالاکس
  const springConfig = { stiffness: 100, damping: 30, mass: 0.5 };
  
  // ردیف اول به چپ میره، ردیف دوم به راست
  const x1 = useSpring(useTransform(scrollYProgress, [0, 1], [0, -150]), springConfig);
  const x2 = useSpring(useTransform(scrollYProgress, [0, 1], [-150, 0]), springConfig);

  return (
    <section ref={containerRef} className="py-24 md:py-40 bg-brand-bg overflow-hidden">
      
      {/* تیتر گالری */}
      <div className="max-w-7xl mx-auto px-6 mb-16 md:mb-24 text-center">
        <span className="text-brand-gold text-xs tracking-[0.4em] uppercase block mb-4">
          Visual Diary
        </span>
        <h2 className="text-3xl md:text-6xl font-serif text-white">
          روایتِ تصویری <span className="italic text-gray-500 font-light">آیـنـه</span>
        </h2>
      </div>

      {/* کانتینر عکس‌ها */}
      <div className="flex flex-col gap-8 md:gap-12 rotate-[-2deg] scale-110 md:scale-100 origin-center">
        
        {/* ردیف اول */}
        <motion.div style={{ x: x1 }} className="flex gap-6 md:gap-8 w-[120%] -translate-x-[10%]">
          {GALLERY_IMAGES.slice(0, 4).map((src, idx) => (
            <GalleryItem key={`r1-${idx}`} src={src} />
          ))}
        </motion.div>

        {/* ردیف دوم */}
        <motion.div style={{ x: x2 }} className="flex gap-6 md:gap-8 w-[120%] -translate-x-[20%]">
          {GALLERY_IMAGES.slice(2, 6).map((src, idx) => (
            <GalleryItem key={`r2-${idx}`} src={src} />
          ))}
        </motion.div>

      </div>
    </section>
  );
}

// کامپوننت کوچک برای هر آیتم عکس
function GalleryItem({ src }: { src: string }) {
  return (
    <div className="relative shrink-0 w-[200px] h-[280px] md:w-[350px] md:h-[450px] rounded-2xl md:rounded-[2rem] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 cursor-pointer group">
      <Image 
        src={src} 
        alt="Gallery" 
        fill 
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 768px) 200px, 350px"
      />
      {/* لایه رنگی روی عکس */}
      <div className="absolute inset-0 bg-brand-dark/20 group-hover:bg-transparent transition-colors duration-500" />
    </div>
  );
}