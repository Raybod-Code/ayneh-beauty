// components/platform/PlatformFeatures.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { 
  Calendar, 
  Users, 
  Brain, 
  BarChart3, 
  Smartphone, 
  Shield,
  Zap,
  Globe,
  Sparkles
} from "lucide-react";
import { useRef } from "react";

const features = [
  {
    icon: Calendar,
    title: "رزرو آنلاین هوشمند",
    description: "سیستم رزرو ۲۴/۷ با تقویم هوشمند، یادآوری خودکار و پرداخت آنلاین امن",
    gradient: "from-luxury-sky-500 to-luxury-sky-600",
    glowColor: "luxury-sky-500/20"
  },
  {
    icon: Brain,
    title: "تحلیل چهره با AI",
    description: "پیشنهاد خدمات شخصی‌سازی شده بر اساس تحلیل هوش مصنوعی پوست و مو",
    gradient: "from-luxury-rose-500 to-luxury-rose-600",
    glowColor: "luxury-rose-500/20"
  },
  {
    icon: Users,
    title: "CRM پیشرفته",
    description: "مدیریت کامل مشتریان، تاریخچه خدمات، برنامه‌های وفاداری و بازاریابی خودکار",
    gradient: "from-luxury-emerald-500 to-luxury-emerald-600",
    glowColor: "luxury-emerald-500/20"
  },
  {
    icon: BarChart3,
    title: "گزارش‌گیری حرفه‌ای",
    description: "داشبورد آنالیتیکس پیشرفته با نمودارهای تعاملی و گزارش‌های دوره‌ای",
    gradient: "from-luxury-amber-500 to-luxury-amber-600",
    glowColor: "luxury-amber-500/20"
  },
  {
    icon: Smartphone,
    title: "اپلیکیشن موبایل",
    description: "اپ اختصاصی برای مشتریان و پرسنل با رابط کاربری زیبا و کاربردی",
    gradient: "from-luxury-violet-500 to-luxury-violet-600",
    glowColor: "luxury-violet-500/20"
  },
  {
    icon: Globe,
    title: "دامنه اختصاصی",
    description: "آدرس اینترنتی منحصربفرد برای سالن شما با طراحی لوکس و حرفه‌ای",
    gradient: "from-luxury-indigo-500 to-luxury-indigo-600",
    glowColor: "luxury-indigo-500/20"
  },
  {
    icon: Shield,
    title: "امنیت بانکی",
    description: "رمزنگاری پیشرفته، بکاپ خودکار و تأیید دو مرحله‌ای",
    gradient: "from-luxury-slate-500 to-luxury-slate-600",
    glowColor: "luxury-slate-500/20"
  },
  {
    icon: Zap,
    title: "عملکرد سریع",
    description: "بارگذاری فوری صفحات و پردازش سریع اطلاعات با سرورهای قدرتمند",
    gradient: "from-brand-gold to-luxury-gold-light",
    glowColor: "brand-gold/20"
  },
];

export default function PlatformFeatures() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="relative py-32 bg-gradient-to-b from-[#050505] via-brand-dark to-[#050505] overflow-hidden">
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-gold/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-semibold text-white">امکانات پیشرفته</span>
          </div>
          
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            همه آنچه که{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-l from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
              نیاز دارید
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            ابزارهای قدرتمند برای دیجیتالی کردن کامل سالن زیبایی شما
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -8 }}
                className="group relative"
              >
                {/* Glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`} />
                
                <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 transition-all duration-500 group-hover:bg-white/[0.06] group-hover:border-white/20 overflow-hidden">
                  
                  {/* Noise */}
                  <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

                  {/* Icon */}
                  <div className={`relative inline-flex items-center justify-center w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-2xl`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="relative font-semibold text-xl text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="relative text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Bottom accent */}
                  <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
