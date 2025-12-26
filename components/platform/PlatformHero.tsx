// components/platform/PlatformHero.tsx
"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  Sparkles,
  ArrowLeft,
  Check,
  Crown,
  Zap,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";
import Link from "next/link";
import NoiseTexture from "@/components/ui/NoiseTexture";
import { useEffect, useMemo, memo } from "react";

// ================================
// Shared Effects (Glow Cursor)
// ================================

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

// ================================
// Animated Gradient Mesh
// ================================

const AnimatedMesh = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-[80px] opacity-20"
        style={{
          background:
            "radial-gradient(circle, hsl(43, 74%, 66%) 0%, transparent 70%)",
          willChange: "transform",
        }}
        animate={{
          x: [0, 50, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-[70px] opacity-15"
        style={{
          background:
            "radial-gradient(circle, hsl(193, 82%, 66%) 0%, transparent 70%)",
          willChange: "transform",
        }}
        animate={{
          x: [0, -50, 0],
          y: [0, 50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
});
AnimatedMesh.displayName = "AnimatedMesh";

// ================================
// Floating Particles (optimized)
// ================================

const FloatingParticles = memo(() => {
  const particles = useMemo(() => {
    return [...Array(15)].map((_, i) => {
      const left = `${Math.random() * 100}%`;
      const top = `${Math.random() * 100}%`;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 2;

      return { i, left, top, duration, delay };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.i}
          className="absolute w-1 h-1 bg-brand-gold/40 rounded-full"
          style={{
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
});
FloatingParticles.displayName = "FloatingParticles";

// ================================
// Floating Stats Badge
// ================================

const FloatingBadge = memo(
  ({
    icon: Icon,
    value,
    label,
    delay = 0,
  }: {
    icon: any;
    value: string;
    label: string;
    delay?: number;
  }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.05, y: -5 }}
        className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-xl overflow-hidden group cursor-pointer"
      >
        <NoiseTexture />

        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        />

        <div className="relative flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-gold/20 to-transparent flex items-center justify-center">
            <Icon className="w-5 h-5 text-brand-gold" />
          </div>
          <div>
            <p className="text-xl font-bold text-white">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        </div>
      </motion.div>
    );
  }
);
FloatingBadge.displayName = "FloatingBadge";

// ================================
// MAIN COMPONENT
// ================================

export default function PlatformHero() {
  const features = ["بدون نیاز به کد نویسی", "پشتیبانی ۲۴/۷", "امنیت بانکی"];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505]">
      {/* Cursor Glow */}
      <CustomCursorGlow />

      {/* Noise Texture */}
      <NoiseTexture />

      {/* Animated Mesh Background */}
      <AnimatedMesh />

      {/* Floating Particles */}
      <FloatingParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-gradient-to-r from-brand-gold/20 to-luxury-gold-light/20 backdrop-blur-xl border border-brand-gold/30 relative overflow-hidden group"
              whileHover={{ scale: 1.05 }}
            >
              {/* subtle shine like signup */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"
              />
              <Crown className="w-4 h-4 text-brand-gold relative z-10" />
              <span className="text-sm font-bold bg-gradient-to-r from-brand-gold to-luxury-gold-light bg-clip-text text-transparent relative z-10">
                پلتفرم هوشمند مدیریت سالن‌های زیبایی
              </span>
              <Sparkles className="w-4 h-4 text-brand-gold animate-pulse relative z-10" />
            </motion.div>

            {/* Main Heading */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              سالن زیبایی خود را{" "}
              <span className="relative inline-block">
                <span className="absolute -inset-2 bg-gradient-to-r from-brand-gold via-luxury-gold-light to-brand-gold blur-3xl opacity-30 animate-pulse"></span>
                <motion.span
                  className="relative bg-gradient-to-r from-brand-gold via-luxury-gold-light to-brand-gold bg-clip-text text-transparent"
                  style={{ backgroundSize: "200% auto" }}
                  animate={{
                    backgroundPosition: ["0% center", "200% center"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  دیجیتال
                </motion.span>
              </span>{" "}
              کنید
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl">
              اولین و بهترین پلتفرم مدیریت جامع سالن‌های زیبایی در ایران. با آینه، رزرو آنلاین، مدیریت مشتری و افزایش درآمد را
              تجربه کنید.
            </p>

            {/* Features List */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {features.map((feature, i) => (
                <motion.div
                  key={feature}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <div className="w-5 h-5 rounded-full bg-luxury-emerald-500/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-luxury-emerald-400" />
                  </div>
                  <span className="text-sm text-gray-300">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
              <Link href="/platform/signup" className="w-full sm:w-auto">
                <motion.button
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black rounded-2xl font-bold text-lg shadow-2xl shadow-brand-gold/30 hover:shadow-brand-gold/50 transition-all flex items-center justify-center gap-3 group relative overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
                  className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  مشاهده دمو
                </motion.button>
              </Link>
            </div>

            {/* Trust Badge */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-gold to-luxury-gold-light border-2 border-[#050505]"
                  />
                ))}
              </div>
              <div>
                <p className="text-sm text-white font-semibold">2,500+ سالن فعال</p>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star key={i} className="w-3 h-3 text-brand-gold fill-brand-gold" />
                  ))}
                  <span className="text-xs text-gray-500 mr-1">4.9/5 رضایت</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side - Floating Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <FloatingBadge icon={Users} value="2,500+" label="سالن فعال" delay={0.4} />
              <FloatingBadge icon={TrendingUp} value="250%" label="افزایش درآمد" delay={0.5} />
              <FloatingBadge icon={Zap} value="50k+" label="رزرو موفق" delay={0.6} />
              <FloatingBadge icon={Star} value="4.9/5" label="رضایت کاربران" delay={0.7} />
            </div>

            {/* Decorative glow (reduced blur for perf) */}
            <div className="absolute -inset-10 bg-gradient-to-r from-brand-gold/20 to-luxury-emerald-500/20 blur-[70px] -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
