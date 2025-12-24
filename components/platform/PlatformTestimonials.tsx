// components/platform/PlatformTestimonials.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { Star, Quote, TrendingUp, Users, Award } from "lucide-react";
import { useRef } from "react";

const testimonials = [
  {
    id: 1,
    name: "سارا احمدی",
    role: "مدیر سالن رز طلایی",
    location: "تهران",
    avatar: "SA",
    content: "آینه واقعاً کسب‌وکار ما را متحول کرد. رزروهای آنلاین ۳۰۰٪ افزایش یافت و دیگر نیازی به دفتر کاغذی نداریم. سیستم AI برای تحلیل چهره مشتریان فوق‌العاده است!",
    stats: { revenue: "+۲۵۰%", customers: "+۱۲۰۰", rating: 4.9 },
    rating: 5,
    gradient: "from-luxury-rose-500 to-luxury-rose-600"
  },
  {
    id: 2,
    name: "مریم کریمی",
    role: "صاحب سالن اُرکیده",
    location: "شیراز",
    avatar: "MK",
    content: "قبل از آینه، مدیریت ۳ شعبه‌مان کابوس بود. حالا همه چیز از یک داشبورد قابل کنترل است. پشتیبانی ۲۴/۷ آن‌ها هم عالی است.",
    stats: { revenue: "+۱۸۰%", customers: "+۸۰۰", rating: 5.0 },
    rating: 5,
    gradient: "from-luxury-sky-500 to-luxury-sky-600"
  },
  {
    id: 3,
    name: "فاطمه رضایی",
    role: "بنیانگذار سالن لوتوس",
    location: "اصفهان",
    avatar: "FR",
    content: "از وقتی که از آینه استفاده می‌کنیم، مشتریان راضی‌تر هستند و پرسنل ما کمتر استرس دارند. گزارش‌های آنالیتیک به ما کمک کرد تصمیمات بهتری بگیریم.",
    stats: { revenue: "+۳۲۰%", customers: "+۱۵۰۰", rating: 4.8 },
    rating: 5,
    gradient: "from-luxury-emerald-500 to-luxury-emerald-600"
  },
  {
    id: 4,
    name: "زهرا محمدی",
    role: "مدیر زنجیره سالن‌های نگین",
    location: "مشهد",
    avatar: "ZM",
    content: "پلتفرم حرفه‌ای با طراحی لوکس. مشتریان ما از اپلیکیشن موبایل و قابلیت رزرو آنلاین بسیار راضی هستند. بهترین سرمایه‌گذاری ما در ۵ سال گذشته!",
    stats: { revenue: "+۴۵۰%", customers: "+۲۸۰۰", rating: 5.0 },
    rating: 5,
    gradient: "from-brand-gold to-luxury-gold-light"
  },
];

export default function PlatformTestimonials() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 bg-gradient-to-b from-[#050505] via-brand-dark to-[#050505] overflow-hidden">
      
      {/* Noise Texture */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-3xl"
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
            <Award className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-semibold text-white">موفقیت مشتریان</span>
          </div>
          
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            داستان‌های{" "}
            <span className="bg-gradient-to-l from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
              موفقیت
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            سالن‌هایی که با آینه رشد کرده‌اند
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -8 }}
              className="group relative"
            >
              {/* Glow */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${testimonial.gradient} rounded-3xl opacity-0 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />
              
              <div className="relative h-full bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-8 group-hover:border-white/20 group-hover:bg-white/[0.06] transition-all duration-500 overflow-hidden">
                
                {/* Noise */}
                <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

                {/* Quote Icon */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center opacity-50">
                  <Quote className="w-8 h-8 text-brand-gold" />
                </div>

                {/* Rating */}
                <div className="relative flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < testimonial.rating
                          ? 'text-brand-gold fill-brand-gold'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <p className="relative text-gray-300 leading-relaxed mb-8">
                  "{testimonial.content}"
                </p>

                {/* Stats */}
                <div className="relative grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-white/10">
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-luxury-emerald-400 font-bold text-lg mb-1">
                      <TrendingUp className="w-4 h-4" />
                      <span>{testimonial.stats.revenue}</span>
                    </div>
                    <p className="text-xs text-gray-500">درآمد</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-luxury-sky-400 font-bold text-lg mb-1">
                      <Users className="w-4 h-4" />
                      <span>{testimonial.stats.customers}</span>
                    </div>
                    <p className="text-xs text-gray-500">مشتری جدید</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-1 text-brand-gold font-bold text-lg mb-1">
                      <Star className="w-4 h-4" />
                      <span>{testimonial.stats.rating}</span>
                    </div>
                    <p className="text-xs text-gray-500">امتیاز</p>
                  </div>
                </div>

                {/* Author */}
                <div className="relative flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${testimonial.gradient} flex items-center justify-center text-white font-bold text-lg shadow-2xl`}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-1">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {testimonial.role} • {testimonial.location}
                    </p>
                  </div>
                </div>

              </div>
            </motion.div>
          ))}
        </div>

        {/* Overall Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto"
        >
          {[
            { value: '۲,۵۰۰+', label: 'سالن فعال', icon: Users },
            { value: '۹۸٪', label: 'رضایت مشتریان', icon: Star },
            { value: '۲۵۰٪', label: 'افزایش میانگین درآمد', icon: TrendingUp },
            { value: '۲۴/۷', label: 'پشتیبانی', icon: Award },
          ].map((stat, i) => (
            <motion.div
              key={i}
              className="relative text-center p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 group hover:border-white/20 hover:bg-white/[0.06] transition-all duration-500 overflow-hidden"
              whileHover={{ y: -4 }}
            >
              {/* Noise */}
              <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />
              
              <div className="relative inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/5 mb-4 group-hover:bg-white/10 transition-colors">
                <stat.icon className="w-6 h-6 text-brand-gold" />
              </div>
              <div className="relative font-serif text-3xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <p className="relative text-sm text-gray-400">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
