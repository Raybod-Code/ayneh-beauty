"use client";

import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

export default function HeroSection() {
  const { scrollY } = useScroll();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // فیزیک خیلی نرم برای حرکت موس
  const springConfig = { damping: 100, stiffness: 400, mass: 2 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (typeof window !== "undefined") {
      const { innerWidth, innerHeight } = window;
      mouseX.set(e.clientX / innerWidth - 0.5);
      mouseY.set(e.clientY / innerHeight - 0.5);
    }
  };

  // --- تنظیمات پارالاکس و انیمیشن ---
  const yMirror = useTransform(scrollY, [0, 800], [0, 250]); // آینه با سرعت متوسط میره پایین
  const yTextMain = useTransform(scrollY, [0, 500], [0, 150]); // متن پشت دیرتر میره
  const opacityText = useTransform(scrollY, [0, 300], [1, 0]); // متن فید میشه

  // چرخش آینه با موس (خیلی ظریف)
  const rotateX = useTransform(smoothMouseY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(smoothMouseX, [-0.5, 0.5], [-8, 8]);

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative h-[110dvh] w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505] perspective-1000"
    >
      {/* 1. اتمسفر پس‌زمینه (نور و ویدیو) */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-[#050505] z-10" />
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-20 grayscale scale-110 blur-[2px]"
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* 2. تایپوگرافی غول‌پیکر (پشت آینه) */}
      <motion.div
        style={{ y: yTextMain, opacity: opacityText }}
        className="absolute top-[12%] md:top-[15%] z-10 text-center w-full select-none mix-blend-overlay"
      >
        <h1 className="text-[18vw] md:text-[14vw] font-serif font-black text-white/10 leading-none tracking-tighter blur-[1px]">
          AYNEH
        </h1>
      </motion.div>

      {/* 3. المان اصلی: آینه معلق */}
      <motion.div
        style={{
          y: yMirror,
          rotateX,
          rotateY,
          scale: useTransform(scrollY, [0, 500], [1, 0.9]),
        }}
        className="relative z-20 w-[85vw] h-[85vw] md:w-[38vw] md:h-[38vw] mt-10 md:mt-0"
      >
        {/* سایه زیر آینه برای عمق */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[90%] bg-black/50 blur-[80px] -z-10" />

        <Image
          src="/images/floating-mirror.png"
          alt="Ayneh Mirror"
          fill
          className="object-contain drop-shadow-2xl"
          priority
        />

        {/* رفلکشن نور روی شیشه */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-transparent rounded-full pointer-events-none" />
      </motion.div>

      {/* 4. المان‌های شناور (Decorations) */}

      {/* قیچی - گوشه راست بالا */}
      <motion.div
        style={{
          x: useTransform(smoothMouseX, (v) => v * 40),
          y: useTransform(smoothMouseY, (v) => v * 40),
          rotate: 15,
        }}
        className="absolute top-[20%] right-[-5%] md:right-[15%] w-32 h-32 md:w-48 md:h-48 z-30 opacity-60 blur-[1px] pointer-events-none"
      >
        <Image
          src="/images/floating-scissors.png"
          alt="Scissors"
          fill
          className="object-contain"
        />
      </motion.div>

      {/* عطر - گوشه چپ پایین */}
      <motion.div
        style={{
          x: useTransform(smoothMouseX, (v) => v * -50),
          y: useTransform(smoothMouseY, (v) => v * -50),
          rotate: -10,
        }}
        className="absolute bottom-[20%] left-[-5%] md:left-[15%] w-24 h-24 md:w-40 md:h-40 z-30 opacity-50 blur-[2px] pointer-events-none"
      >
        <Image
          src="/images/floating-perfume.png"
          alt="Perfume"
          fill
          className="object-contain"
        />
      </motion.div>

      {/* 5. متن پایین (کپی‌رایتینگ) */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 1 }}
        className="absolute bottom-12 md:bottom-16 z-40 text-center px-6 max-w-2xl"
      >
        <h2 className="text-xl md:text-3xl font-sans font-bold text-white/90 mb-3 tracking-wide leading-relaxed">
          جایی که زیبایی، <br className="md:hidden" /> بازتابِ{" "}
          <span className="text-brand-gold italic">درون</span> توست
        </h2>
        <p className="text-[10px] md:text-xs text-gray-500 font-sans tracking-[0.3em] uppercase mb-6">
          Luxury Beauty Lounge • Est. 2025
        </p>

        {/* اسکرول ایندیکیتور */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-[9px] uppercase tracking-widest">Scroll</span>
          <div className="w-[1px] h-10 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
}
