// components/platform/PlatformTestimonials.tsx
"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect, memo } from "react";
import { Star, Quote } from "lucide-react";
import NoiseTexture from "@/components/ui/NoiseTexture";
// import Image from "next/image"; // اگر بعدها آواتار واقعی داشتی

// Cursor glow (shared)
const CustomCursorGlow = memo(() => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const cursorXSpring = useTransform(cursorX, (v) => v);
  const cursorYSpring = useTransform(cursorY, (v) => v);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 w-8 h-8 rounded-full z-40 mix-blend-screen"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, hsl(43, 74%, 66%) 0%, transparent 70%)",
        filter: "blur(8px)",
      }}
    />
  );
});
CustomCursorGlow.displayName = "CustomCursorGlow";

const testimonials = [
  {
    name: "سارا احمدی",
    role: "مدیر سالن رز",
    image: "/avatars/avatar1.jpg",
    content:
      "قبل از آینه، بیشتر زمانم پای هماهنگی تلفنی و جا‌به‌جایی نوبت‌ها می‌رفت. الان رزروها مرتب تو سیستم میاد، تداخل نداریم و من می‌تونم روی کیفیت خدمات تمرکز کنم.",
    rating: 5,
    location: "تهران",
  },
  {
    name: "مریم کریمی",
    role: "صاحب سالن یاس",
    image: "/avatars/avatar2.jpg",
    content:
      "گزارش‌های آینه کمک کرد بفهمم کدوم خدمات و روزها پرفروشن. بر اساس همون، شیفت‌ها و تخفیف‌ها رو تنظیم کردم و درآمد ماهانه‌ام به‌صورت محسوس بالا رفت.",
    rating: 5,
    location: "اصفهان",
  },
  {
    name: "نگار موسوی",
    role: "مدیر سالن نیلوفر",
    image: "/avatars/avatar3.jpg",
    content:
      "بزرگ‌ترین تفاوت برای من نظم کارهاست. تیم پذیرش کمتر اشتباه می‌کند، مشتری‌ها پیام یادآوری دریافت می‌کنند و ما خیلی کمتر نوبت از دست‌رفته داریم.",
    rating: 5,
    location: "شیراز",
  },
  {
    name: "لیلا رضایی",
    role: "صاحب سالن یاسمن",
    image: "/avatars/avatar4.jpg",
    content:
      "رابط کاربری ساده‌ست و پرسنل خیلی زود باهاش کنار آمدن. حتی همکارانی که با نرم‌افزار راحت نبودن، بعد از چند روز خودشان نوبت‌ها را مدیریت می‌کنند.",
    rating: 5,
    location: "مشهد",
  },
  {
    name: "فاطمه حسینی",
    role: "مدیر سالن لاله",
    image: "/avatars/avatar5.jpg",
    content:
      "پیامک و نوتیفیکیشن خودکار باعث شده مشتری‌ها کمتر نوبت را فراموش کنند. آمار no-show تقریباً به حداقل رسیده و برنامه‌ریزی روزانه قابل‌ پیش‌بینی‌تر شده.",
    rating: 5,
    location: "کرج",
  },
  {
    name: "زهرا امینی",
    role: "صاحب سه شعبه پونه",
    image: "/avatars/avatar6.jpg",
    content:
      "برای من مهم بود بتوانم هر سه شعبه را از یک جا ببینم. آینه این امکان را داده که آمار هر شعبه، عملکرد پرسنل و رزروها را یک‌جا چک کنم و تصمیم‌های سریع‌تر بگیرم.",
    rating: 5,
    location: "تبریز",
  },
];

const TestimonialCard = ({
  testimonial,
  index,
}: {
  testimonial: (typeof testimonials)[number];
  index: number;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="relative group cursor-pointer h-full"
    >
      <div className="relative p-8 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all overflow-hidden h-full flex flex-col">
        <NoiseTexture />

        {/* Gradient overlay on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        />

        {/* Quote Icon */}
        <div className="relative mb-6">
          <motion.div
            className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold/20 to-transparent flex items-center justify-center"
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6 }}
          >
            <Quote className="w-6 h-6 text-brand-gold" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="relative mb-6 flex-1">
          <p className="text-gray-300 leading-relaxed">
            {testimonial.content}
          </p>
        </div>

        {/* Rating */}
        <div className="relative flex items-center gap-1 mb-6">
          {Array.from({ length: testimonial.rating }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 + i * 0.08 }}
            >
              <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
            </motion.div>
          ))}
        </div>

        {/* Author */}
        <div className="relative flex items-center gap-4">
          {/* اگر خواستی آواتار واقعی استفاده کنی این بخش را جایگزین کن */}
          {/* <div className="relative w-12 h-12 rounded-full overflow-hidden">
            <Image
              src={testimonial.image}
              alt={testimonial.name}
              fill
              className="object-cover"
            />
          </div> */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold to-luxury-gold-light flex items-center justify-center text-black font-bold">
            {testimonial.name.charAt(0)}
          </div>
          <div>
            <h4 className="text-white font-semibold">{testimonial.name}</h4>
            <p className="text-sm text-gray-500">
              {testimonial.role} • {testimonial.location}
            </p>
          </div>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </motion.div>
  );
};

export default function PlatformTestimonials() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#0a0a0a] to-[#050505] overflow-hidden">
      <CustomCursorGlow />

      {/* Noise Texture */}
      <NoiseTexture />

      {/* Background Glow (کمی سبک‌تر) */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-luxury-sky-500/10 rounded-full blur-[80px]"
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-brand-gold/20 to-luxury-gold-light/20 backdrop-blur-xl border border-brand-gold/30"
            whileHover={{ scale: 1.05 }}
          >
            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
            <span className="text-sm font-bold text-brand-gold">
              نظرات مشتریان
            </span>
          </motion.div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            داستان موفقیت{" "}
            <span className="relative inline-block">
              <span className="absolute -inset-1 bg-gradient-to-r from-brand-gold to-luxury-gold-light blur-2xl opacity-30"></span>
              <span className="relative bg-gradient-to-r from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
                مشتریان ما
              </span>
            </span>
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            بیش از ۲,۵۰۰ سالن زیبایی در سراسر ایران، مدیریت روزانه خود را با آینه انجام می‌دهند.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard
              key={testimonial.name}
              testimonial={testimonial}
              index={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
