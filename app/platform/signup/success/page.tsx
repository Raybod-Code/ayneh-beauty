// app/platform/signup/success/page.tsx
"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import NoiseTexture from "@/components/ui/NoiseTexture";

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-[#050505] relative flex items-center justify-center px-6">
      <NoiseTexture />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative max-w-2xl text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="inline-flex items-center justify-center w-24 h-24 mb-8 rounded-full bg-gradient-to-br from-luxury-emerald-500 to-luxury-emerald-600 shadow-2xl shadow-luxury-emerald-500/30"
        >
          <CheckCircle2 className="w-12 h-12 text-white" />
        </motion.div>

        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-6">
          ثبت نام شما{" "}
          <span className="bg-gradient-to-l from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
            موفقیت‌آمیز
          </span>{" "}
          بود!
        </h1>

        <p className="text-lg text-gray-400 mb-12 leading-relaxed">
          درخواست شما در صف بررسی قرار گرفت. تیم ما در کمترین زمان با شما تماس خواهد گرفت و اطلاعات بیشتر را ارائه می‌دهد.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/platform">
            <motion.button
              className="px-8 py-4 bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black rounded-full font-bold hover:shadow-xl transition-all flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-5 h-5" />
              <span>بازگشت به صفحه اصلی</span>
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
