// components/platform/PlatformStats.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Building2, Users, CalendarCheck, Star, TrendingUp, Sparkles } from "lucide-react";

interface StatProps {
  icon: React.ElementType;
  value: string;
  label: string;
  suffix?: string;
  gradient: string;
}

function AnimatedNumber({ 
  end, 
  duration = 2000, 
  suffix = "" 
}: { 
  end: number; 
  duration?: number; 
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setCount(Math.floor(easeOutQuart * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref} className="font-sans tabular-nums">
      {count.toLocaleString("fa-IR")}
      {suffix}
    </span>
  );
}

function StatCard({ icon: Icon, value, label, suffix, gradient }: StatProps) {
  const numericValue = parseInt(value.replace(/[^\d]/g, ""));

  return (
    <motion.div
      className="group relative"
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`} />
      
      <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-center transition-all duration-500 group-hover:bg-white/[0.06] group-hover:border-white/20 overflow-hidden">
        
        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

        {/* Icon */}
        <motion.div
          className={`relative inline-flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br ${gradient} shadow-2xl shadow-brand-gold/20`}
          whileHover={{ rotate: 360, scale: 1.1 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        {/* Number */}
        <div className="relative font-serif text-5xl font-bold text-white mb-3">
          <AnimatedNumber end={numericValue} suffix={suffix} duration={2500} />
        </div>

        {/* Label */}
        <div className="relative text-gray-400 font-medium">{label}</div>

        {/* Decorative gradient line */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      </div>
    </motion.div>
  );
}

export default function PlatformStats() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const stats: StatProps[] = [
    { 
      icon: Building2, 
      value: "2500", 
      label: "سالن فعال", 
      suffix: "+",
      gradient: "from-luxury-emerald-500 to-luxury-emerald-600"
    },
    { 
      icon: Users, 
      value: "150000", 
      label: "مشتری راضی", 
      suffix: "+",
      gradient: "from-luxury-sky-500 to-luxury-sky-600"
    },
    { 
      icon: CalendarCheck, 
      value: "500000", 
      label: "رزرو موفق", 
      suffix: "+",
      gradient: "from-luxury-amber-500 to-luxury-amber-600"
    },
    { 
      icon: Star, 
      value: "98", 
      label: "رضایت مشتریان", 
      suffix: "%",
      gradient: "from-brand-gold to-luxury-gold-light"
    },
  ];

  return (
    <section className="relative py-32 bg-[#050505] overflow-hidden">
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

      {/* Animated Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-luxury-sky-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl"
        animate={{
          x: [0, -50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div ref={ref} className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
            <TrendingUp className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-semibold text-white tracking-wide">آمار و ارقام</span>
          </div>
          
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            <span className="text-white">اعتماد </span>
            <span className="bg-gradient-to-l from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
              هزاران کسب‌وکار
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            جامعه‌ای از صاحبان سالن‌های زیبایی که با آینه به موفقیت رسیده‌اند
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ staggerChildren: 0.15, delayChildren: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Badge */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
            <Sparkles className="w-5 h-5 text-brand-gold" />
            <p className="text-sm text-gray-400">
              <span className="font-bold text-white">۹۸٪</span> از مشتریان ما را توصیه می‌کنند
            </p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
