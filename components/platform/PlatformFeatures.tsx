// components/platform/PlatformFeatures.tsx
"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  Calendar,
  Users,
  CreditCard,
  BarChart3,
  MessageSquare,
  Bell,
  Shield,
  Zap,
  Sparkles,
  TrendingUp,
  Clock,
  Globe,
} from "lucide-react";
import NoiseTexture from "@/components/ui/NoiseTexture";
import { useEffect, memo } from "react";

// Cursor glow (shared style)
const CustomCursorGlow = memo(() => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

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

const features = [
  {
    icon: Calendar,
    title: "رزرو آنلاین هوشمند",
    description: "سیستم رزروگیری ۲۴/۷ با تقویم زنده و یادآوری خودکار برای مشتریان",
    color: "hsl(43, 74%, 66%)",
    gradient: "from-brand-gold/20 to-transparent",
  },
  {
    icon: Users,
    title: "مدیریت مشتریان",
    description: "پروفایل کامل، تاریخچه خدمات و تحلیل رفتار مشتریان با هوش مصنوعی",
    color: "hsl(193, 82%, 66%)",
    gradient: "from-luxury-sky-500/20 to-transparent",
  },
  {
    icon: CreditCard,
    title: "پرداخت آنلاین",
    description: "درگاه پرداخت امن با پشتیبانی از تمام کارت‌های بانکی و کیف پول",
    color: "hsl(158, 64%, 52%)",
    gradient: "from-luxury-emerald-500/20 to-transparent",
  },
  {
    icon: BarChart3,
    title: "گزارش‌های تحلیلی",
    description: "داشبورد آماری real-time با چارت‌های تعاملی و پیش‌بینی درآمد",
    color: "hsl(280, 80%, 70%)",
    gradient: "from-purple-500/20 to-transparent",
  },
  {
    icon: MessageSquare,
    title: "پیام‌رسانی خودکار",
    description: "ارسال پیامک و ایمیل خودکار برای یادآوری، تبریک و پیگیری",
    color: "hsl(43, 74%, 66%)",
    gradient: "from-brand-gold/20 to-transparent",
  },
  {
    icon: Bell,
    title: "نوتیفیکیشن هوشمند",
    description: "اعلان‌های لحظه‌ای برای رزروها، لغوها و پیام‌های مشتریان",
    color: "hsl(350, 80%, 60%)",
    gradient: "from-rose-500/20 to-transparent",
  },
  {
    icon: Shield,
    title: "امنیت بانکی",
    description: "رمزنگاری end-to-end، بکاپ خودکار و مطابق با استانداردهای PCI-DSS",
    color: "hsl(158, 64%, 52%)",
    gradient: "from-luxury-emerald-500/20 to-transparent",
  },
  {
    icon: Zap,
    title: "عملکرد فوق‌سریع",
    description: "بارگذاری زیر ۱ ثانیه با CDN جهانی و کش هوشمند",
    color: "hsl(193, 82%, 66%)",
    gradient: "from-luxury-sky-500/20 to-transparent",
  },
  {
    icon: Globe,
    title: "دامنه اختصاصی",
    description: "سایت اختصاصی با دامنه خود یا استفاده از ساب‌دامین رایگان",
    color: "hsl(280, 80%, 70%)",
    gradient: "from-purple-500/20 to-transparent",
  },
  {
    icon: TrendingUp,
    title: "بهینه‌سازی درآمد",
    description: "پیشنهادات هوشمند برای افزایش نرخ تبدیل و میانگین سبد خرید",
    color: "hsl(43, 74%, 66%)",
    gradient: "from-brand-gold/20 to-transparent",
  },
  {
    icon: Clock,
    title: "برنامه‌ریزی نوبت",
    description: "تقویم هوشمند با شناسایی خودکار ساعات شلوغی و پیشنهاد زمان بهینه",
    color: "hsl(193, 82%, 66%)",
    gradient: "from-luxury-sky-500/20 to-transparent",
  },
  {
    icon: Sparkles,
    title: "تجربه لوکس",
    description: "رابط کاربری premium با انیمیشن‌های نرم و دیزاین مدرن",
    color: "hsl(350, 80%, 60%)",
    gradient: "from-rose-500/20 to-transparent",
  },
];

export default function PlatformFeatures() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] overflow-hidden">
      {/* Cursor glow */}
      <CustomCursorGlow />

      {/* Noise Texture */}
      <NoiseTexture />

      {/* Background Glow */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[80px]"
          style={{ willChange: "transform" }}
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
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-luxury-sky-500/10 rounded-full blur-[70px]"
          style={{ willChange: "transform" }}
          animate={{
            x: [0, -50, 0],
            y: [0, 50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
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
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-bold text-brand-gold">
              ویژگی‌های منحصر به فرد
            </span>
          </motion.div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            همه چیز که نیاز دارید،{" "}
            <span className="relative inline-block">
              <span className="absolute -inset-1 bg-gradient-to-r from-brand-gold to-luxury-gold-light blur-2xl opacity-30"></span>
              <span className="relative bg-gradient-to-r from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
                در یک جا
              </span>
            </span>
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx_auto">
            مجموعه کاملی از ابزارهای حرفه‌ای برای مدیریت هوشمند سالن زیبایی شما
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group cursor-pointer"
            >
              <div className="relative h-full p-8 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all overflow-hidden">
                <NoiseTexture />

                {/* Gradient overlay on hover */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                {/* Icon */}
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {/* Glow effect */}
                  <div
                    className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity"
                    style={{
                      background: feature.color,
                    }}
                  />
                  <feature.icon
                    className="w-7 h-7 relative z-10"
                    style={{ color: feature.color }}
                  />
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-bold text-white mb-3 group-hover:text-brand-gold transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Bottom gradient line */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${feature.color}, transparent)`,
                  }}
                />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-gray-400 mb-6">
            و بیش از <span className="text-brand-gold font-bold">50+ ویژگی دیگر</span> در حال توسعه...
          </p>

          <motion.a
            href="/platform/signup"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black font-bold shadow-2xl shadow-brand-gold/30 hover:shadow-brand-gold/50 transition-all group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>همین حالا شروع کنید</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5" />
            </motion.div>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
