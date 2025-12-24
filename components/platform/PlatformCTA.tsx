// components/platform/PlatformCTA.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { ArrowLeft, Sparkles, CheckCircle2, Zap, Calendar } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function PlatformCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative py-32 overflow-hidden bg-[#050505]">
      
      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

      {/* Animated Background */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[800px] bg-gradient-to-r from-brand-gold/10 via-luxury-gold-light/10 to-brand-gold/10 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 90, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-brand-gold/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 3,
            }}
          />
        ))}
      </div>

      <div ref={ref} className="relative z-10 max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-white/[0.05] via-white/[0.02] to-white/[0.05] backdrop-blur-2xl border border-white/10 shadow-2xl"
        >
          
          {/* Inner Noise */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

          {/* Inner Glow */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-gold/10 via-transparent to-transparent" />
          
          {/* Content */}
          <div className="relative z-10 p-12 sm:p-16 lg:p-20 text-center">
            
            {/* Sparkle Icon */}
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 mb-8 rounded-3xl bg-gradient-to-br from-brand-gold to-luxury-gold-light shadow-2xl shadow-brand-gold/30"
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1],
              }}
              transition={{
                rotate: {
                  duration: 20,
                  repeat: Infinity,
                  ease: "linear",
                },
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>

            {/* Heading */}
            <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight text-white">
              آماده برای
              <br />
              <span className="bg-gradient-to-l from-brand-gold via-luxury-gold-light to-brand-gold bg-clip-text text-transparent">
                شروع سفر دیجیتال
              </span>
              <br />
              هستید؟
            </h2>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              به جمع ۲,۵۰۰ سالن موفق بپیوندید و تجربه‌ای متفاوت برای مشتریان خود بسازید
            </p>

            {/* Features Quick List */}
            <div className="grid sm:grid-cols-3 gap-4 mb-12 max-w-3xl mx-auto">
              {[
                { icon: CheckCircle2, text: '۳۰ روز رایگان' },
                { icon: Zap, text: 'راه‌اندازی سریع' },
                { icon: Calendar, text: 'لغو در هر زمان' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="relative flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />
                  <div className="relative w-8 h-8 rounded-xl bg-brand-gold/20 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-4 h-4 text-brand-gold" />
                  </div>
                  <span className="relative text-sm text-gray-300 font-medium">{item.text}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link href="/platform/signup">
                <motion.button
                  className="group relative w-full sm:w-auto overflow-hidden px-10 py-5 bg-gradient-to-r from-brand-gold via-luxury-gold to-brand-gold bg-[length:200%_auto] text-black rounded-full font-bold text-lg shadow-2xl shadow-brand-gold/40"
                  whileHover={{ 
                    scale: 1.05,
                    backgroundPosition: 'right center',
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <span>شروع رایگان کنید</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                      }}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </motion.div>
                  </span>
                  
                  {/* Shine Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    animate={{ x: '200%' }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                </motion.button>
              </Link>

              <Link href="/">
                <motion.button
                  className="w-full sm:w-auto px-10 py-5 border-2 border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  مشاهده نمونه کار
                </motion.button>
              </Link>
            </div>

            {/* Fine Print */}
            <p className="mt-8 text-sm text-gray-500">
              نیازی به کارت اعتباری نیست • راه‌اندازی در ۵ دقیقه • پشتیبانی رایگان
            </p>

          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-40 h-40 bg-brand-gold/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-luxury-gold-light/10 rounded-full blur-3xl" />

        </motion.div>

      </div>
    </section>
  );
}
