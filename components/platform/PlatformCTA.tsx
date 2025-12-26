// components/platform/PlatformCTA.tsx
"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { ArrowLeft, Sparkles, Rocket, Zap } from "lucide-react";
import Link from "next/link";
import NoiseTexture from "@/components/ui/NoiseTexture";
import { useEffect, memo } from "react";

// Cursor glow (مثل Signup/ Hero)
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

export default function PlatformCTA() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] overflow-hidden">
      {/* Cursor Glow */}
      <CustomCursorGlow />

      {/* Noise Texture */}
      <NoiseTexture />

      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/20 rounded-full blur-[80px]"
          style={{ willChange: "transform, opacity" }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Main Card */}
          <div className="relative p-12 sm:p-16 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 overflow-hidden">
            <NoiseTexture />

            {/* Top gradient line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />

            {/* Floating icons */}
            <motion.div
              className="absolute top-8 left-8"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Rocket className="w-8 h-8 text-brand-gold/30" />
            </motion.div>

            <motion.div
              className="absolute bottom-8 right-8"
              animate={{
                y: [0, 10, 0],
                rotate: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
            >
              <Zap className="w-8 h-8 text-luxury-emerald-400/30" />
            </motion.div>

            <div className="relative">
              {/* Badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-brand-gold/20 to-luxury-gold-light/20 border border-brand-gold/30 relative overflow-hidden group"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(236, 179, 101, 0.4)",
                    "0 0 0 10px rgba(236, 179, 101, 0)",
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
                />
                <Sparkles className="w-4 h-4 text-brand-gold relative z-10" />
                <span className="text-sm font-bold text-brand-gold relative z-10">
                  آماده شروع هستید؟
                </span>
              </motion.div>

              {/* Heading */}
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
                سالن خود را همین امروز{" "}
                <span className="relative inline-block">
                  <span className="absolute -inset-1 bg-gradient-to-r from-brand-gold to-luxury-gold-light blur-2xl opacity-40"></span>
                  <span className="relative bg-gradient-to-r from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
                    دیجیتال کنید
                  </span>
                </span>
              </h2>

              <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-10">
                بدون نیاز به کد نویسی، بدون هزینه راه‌اندازی. فقط ۵ دقیقه فرصت لازم است.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/platform/signup" className="w-full sm:w-auto">
                  <motion.button
                    className="w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black rounded-2xl font-bold text-lg shadow-2xl shadow-brand-gold/30 hover:shadow-brand-gold/50 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {/* Shine effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                    />
                    <span className="relative z-10">شروع رایگان ۳۰ روزه</span>
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform relative z-10" />
                  </motion.button>
                </Link>

                <Link href="/platform/demo">
                  <motion.button
                    className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    مشاهده دمو
                  </motion.button>
                </Link>
              </div>

              {/* Bottom text */}
              <p className="text-sm text-gray-500 mt-8">
                بدون نیاز به کارت اعتباری • لغو در هر زمان • پشتیبانی ۲۴/۷
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
