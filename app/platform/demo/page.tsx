// app/platform/demo/page.tsx
"use client";

import { motion } from "framer-motion";
import { Play, Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-brand-bg to-white py-32">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Link href="/platform" className="inline-flex items-center gap-2 text-brand-gray hover:text-brand-gold transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span className="text-sm">بازگشت</span>
          </Link>

          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-brand-gold/10 border border-brand-gold/20">
            <Play className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-semibold text-brand-dark">دمو زنده</span>
          </div>
          
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-brand-dark mb-6">
            مشاهده{" "}
            <span className="bg-gradient-to-l from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
              دمو پلتفرم
            </span>
          </h1>
          
          <p className="text-lg text-brand-gray max-w-2xl mx-auto">
            یک تور کامل از امکانات و قابلیت‌های پلتفرم آینه
          </p>
        </motion.div>

        {/* Video Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="relative aspect-video rounded-3xl overflow-hidden bg-brand-dark border border-brand-gold/20 shadow-2xl mb-12"
        >
          {/* Placeholder for video */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-brand-gold/20 flex items-center justify-center mx-auto mb-4">
                <Play className="w-12 h-12 text-brand-gold" />
              </div>
              <p className="text-white text-lg font-medium">ویدیو دمو به زودی...</p>
            </div>
          </div>
        </motion.div>

        {/* Features List */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6"
        >
          {[
            'مدیریت رزروها و تقویم',
            'پنل کاربری مشتریان',
            'سیستم CRM پیشرفته',
            'گزارش‌گیری و آنالیتیکس',
            'تحلیل چهره با AI',
            'پنل مدیریت کارکنان',
          ].map((feature, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-4 rounded-2xl bg-white border border-brand-gold/10"
            >
              <CheckCircle2 className="w-5 h-5 text-luxury-emerald-500" />
              <span className="text-brand-dark font-medium">{feature}</span>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-16"
        >
          <Link href="/platform/signup">
            <motion.button
              className="px-10 py-5 bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black rounded-full font-bold text-lg shadow-xl shadow-brand-gold/30 hover:shadow-2xl transition-all flex items-center justify-center gap-3 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>شروع رایگان کنید</span>
              <Sparkles className="w-5 h-5" />
            </motion.button>
          </Link>
        </motion.div>

      </div>
    </div>
  );
}
