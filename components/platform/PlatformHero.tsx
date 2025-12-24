// components/platform/PlatformHero.tsx
"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { Sparkles, ArrowLeft, Play, CheckCircle2, Zap, Shield, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function PlatformHero() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 200]), {
    stiffness: 100,
    damping: 30,
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#050505]"
    >
        
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

      {/* Animated Gradient Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-gold/10 blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-brand-gold/40 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <motion.div 
        className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-32 text-center"
        style={{ y, opacity }}
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-8 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <Sparkles className="w-4 h-4 text-brand-gold" />
          <span className="text-sm font-semibold text-white tracking-wide">
            برگزیده بهترین پلتفرم زیبایی ۱۴۰۳
          </span>
          <Star className="w-4 h-4 text-brand-gold fill-brand-gold" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="font-serif text-5xl sm:text-6xl lg:text-8xl font-bold mb-8 leading-[1.05] tracking-tight"
        >
          <span className="block mb-3 text-white">
            سالن زیبایی را به سطحی
          </span>
          <span className="block bg-gradient-to-l from-brand-gold via-luxury-gold-light to-brand-gold bg-clip-text text-transparent">
            جدید ببرید
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-lg sm:text-xl lg:text-2xl text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed font-light"
        >
          پلتفرم هوشمند مدیریت با{" "}
          <span className="text-white font-medium">هوش مصنوعی</span>،{" "}
          <span className="text-white font-medium">رزرو آنلاین</span>،{" "}
          <span className="text-white font-medium">CRM پیشرفته</span>
          {" "}و تجربه‌ای لوکس برای مشتریان
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16"
        >
          <Link href="/platform/signup">
            <motion.button
              className="group relative w-full sm:w-auto overflow-hidden px-10 py-5 bg-gradient-to-r from-brand-gold via-luxury-gold to-brand-gold bg-[length:200%_auto] text-black rounded-full font-semibold text-lg shadow-2xl shadow-brand-gold/30"
              whileHover={{ 
                scale: 1.05,
                backgroundPosition: 'right center',
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 flex items-center justify-center gap-3">
                <span>شروع رایگان ۳۰ روزه</span>
                <ArrowLeft className="w-5 h-5" />
              </span>
            </motion.button>
          </Link>

          <Link href="/">
            <motion.button
              className="group w-full sm:w-auto px-10 py-5 border-2 border-white/20 text-white rounded-full font-semibold text-lg backdrop-blur-sm hover:bg-white/10 hover:border-brand-gold transition-all duration-300 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 text-brand-gold" />
              </div>
              <span>مشاهده نمونه کار زنده</span>
            </motion.button>
          </Link>
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-8 lg:gap-12"
        >
          {[
            { icon: CheckCircle2, text: "بدون نیاز به کارت اعتباری", color: "text-luxury-emerald-500" },
            { icon: Zap, text: "راه‌اندازی در ۵ دقیقه", color: "text-luxury-amber-500" },
            { icon: Shield, text: "امنیت بانکی", color: "text-luxury-sky-500" },
            { icon: TrendingUp, text: "افزایش ۳۰٪ درآمد", color: "text-brand-gold" },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-3 group"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 flex items-center justify-center group-hover:border-brand-gold/40 transition-all">
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">
                {item.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Social Proof */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mt-20 inline-flex items-center gap-6 px-8 py-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <div className="flex -space-x-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-gold to-luxury-gold-light border-2 border-[#050505] flex items-center justify-center text-white font-bold"
              >
                {i}
              </div>
            ))}
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 mb-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-brand-gold fill-brand-gold" />
              ))}
            </div>
            <p className="text-sm text-gray-400">
              <span className="font-bold text-white">۲,۵۰۰+</span> سالن به ما اعتماد کرده‌اند
            </p>
          </div>
        </motion.div>

      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="w-7 h-12 border-2 border-white/20 rounded-full flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-3 bg-brand-gold rounded-full"
            animate={{ y: [0, 16, 0] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </motion.div>

    </section>
  );
}
