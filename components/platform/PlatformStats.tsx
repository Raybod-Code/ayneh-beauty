// components/platform/PlatformStats.tsx
"use client";

import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useEffect, useRef, useState, memo } from "react";
import {
  Users,
  TrendingUp,
  Star,
  Zap,
  Calendar,
  DollarSign,
} from "lucide-react";
import NoiseTexture from "@/components/ui/NoiseTexture";

// Cursor glow (shared)
const CustomCursorGlow = memo(() => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const cursorXSpring = useTransform(cursorX, (v) => v);
  const cursorYSpring = useTransform(cursorY, (v) => v);

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

// Animated Counter Component (viewport-aware)
const AnimatedCounter = ({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) =>
    Number.isInteger(value)
      ? Math.floor(latest)
      : Math.round(latest * 10) / 10
  );
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Intersection observer برای شروع انیمیشن فقط وقتی توی ویو هست
  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || hasAnimated) return;
    setHasAnimated(true);
    const controls = animate(motionValue, value, {
      duration: 2,
    });
    return controls.stop;
  }, [isInView, hasAnimated, motionValue, value]);

  return (
    <span ref={ref} className="inline-flex items-baseline gap-1">
      <motion.span>{rounded}</motion.span>
      <span>{suffix}</span>
    </span>
  );
};

const stats = [
  {
    icon: Users,
    value: 2500,
    suffix: "+",
    label: "سالن فعال",
    color: "hsl(193, 82%, 66%)",
    gradient: "from-luxury-sky-500/20 to-transparent",
  },
  {
    icon: Calendar,
    value: 50000,
    suffix: "+",
    label: "رزرو موفق",
    color: "hsl(43, 74%, 66%)",
    gradient: "from-brand-gold/20 to-transparent",
  },
  {
    icon: TrendingUp,
    value: 250,
    suffix: "%",
    label: "افزایش درآمد",
    color: "hsl(158, 64%, 52%)",
    gradient: "from-luxury-emerald-500/20 to-transparent",
  },
  {
    icon: Star,
    value: 4.9,
    suffix: "/5",
    label: "رضایت مشتریان",
    color: "hsl(43, 74%, 66%)",
    gradient: "from-brand-gold/20 to-transparent",
  },
  {
    icon: Zap,
    value: 99.9,
    suffix: "%",
    label: "آپتایم سرور",
    color: "hsl(280, 80%, 70%)",
    gradient: "from-purple-500/20 to-transparent",
  },
  {
    icon: DollarSign,
    value: 15,
    suffix: "M+",
    label: "تراکنش ماهانه",
    color: "hsl(158, 64%, 52%)",
    gradient: "from-luxury-emerald-500/20 to-transparent",
  },
];

export default function PlatformStats() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-[#050505] to-[#0a0a0a] overflow-hidden">
      <CustomCursorGlow />

      {/* Noise Texture */}
      <NoiseTexture />

      {/* Background Effects */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-gold/10 rounded-full blur-[80px]"
          style={{ willChange: "transform, opacity" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Stats Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="relative group cursor-pointer"
            >
              <div className="relative p-8 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all overflow-hidden">
                <NoiseTexture />

                {/* Gradient overlay */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />

                <div className="relative flex items-center gap-4">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <div
                      className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity"
                      style={{ background: stat.color }}
                    />
                    <stat.icon
                      className="w-8 h-8 relative z-10"
                      style={{ color: stat.color }}
                    />
                  </div>

                  {/* Content */}
                  <div>
                    <div className="text-3xl font-bold text-white mb-1">
                      <AnimatedCounter
                        value={stat.value}
                        suffix={stat.suffix}
                      />
                    </div>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
