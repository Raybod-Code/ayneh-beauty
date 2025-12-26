// components/platform/PlatformPricing.tsx
"use client";

import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Check,
  Crown,
  Sparkles,
  Zap,
  Star,
  Gift,
  ArrowLeft,
  Info,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, memo } from "react";
import NoiseTexture from "@/components/ui/NoiseTexture";

const plans = [
  {
    name: "پایه",
    icon: Zap,
    price: "رایگان",
    duration: "۳۰ روز",
    description: "برای سالن‌های کوچک و شروع کار",
    color: "hsl(193, 82%, 66%)",
    gradient: "from-luxury-sky-500/20 to-transparent",
    features: [
      "۱۰۰ رزرو رایگان در ماه",
      "۱ کاربر مدیریتی",
      "پنل مدیریت ساده",
      "پشتیبانی ایمیلی",
      "گزارش‌گیری پایه",
      "رزرو آنلاین ۲۴/۷",
    ],
    cta: "شروع رایگان",
    popular: false,
  },
  {
    name: "حرفه‌ای",
    icon: Crown,
    price: 490000,
    duration: "ماهانه",
    description: "برای سالن‌های فعال و در حال رشد",
    color: "hsl(43, 74%, 66%)",
    gradient: "from-brand-gold/20 to-transparent",
    features: [
      "رزرو نامحدود",
      "تا ۵ کاربر مدیریتی",
      "پشتیبانی تلفنی ۲۴/۷",
      "گزارش‌های پیشرفته و آماری",
      "پیام‌رسانی خودکار (SMS/Email)",
      "وب‌سایت اختصاصی سالن",
      "اپلیکیشن موبایل",
      "تخفیف ۱۰٪ برای مواد اولیه",
    ],
    cta: "انتخاب این پلن",
    popular: true,
  },
  {
    name: "سازمانی",
    icon: Star,
    price: "تماس بگیرید",
    duration: "قرارداد سالانه",
    description: "برای مجموعه‌ها و زنجیره سالن‌ها",
    color: "hsl(280, 80%, 70%)",
    gradient: "from-purple-500/20 to-transparent",
    features: [
      "تمام امکانات پلن حرفه‌ای",
      "تعداد نامحدود کاربر و شعبه",
      "مدیریت متمرکز چند شعبه",
      "API اختصاصی برای یکپارچگی",
      "مشاور اختصاصی کسب‌وکار",
      "آموزش حضوری و آنلاین",
      "قرارداد SLA تضمینی",
      "سفارشی‌سازی کامل سیستم",
    ],
    cta: "درخواست مشاوره",
    popular: false,
  },
];

// Cursor glow
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

const PricingToggle = ({
  isYearly,
  setIsYearly,
}: {
  isYearly: boolean;
  setIsYearly: (value: boolean) => void;
}) => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
      <button
        onClick={() => setIsYearly(false)}
        className={`text-sm font-medium transition-colors ${
          !isYearly ? "text-white" : "text-gray-500"
        }`}
      >
        پرداخت ماهانه
      </button>

      <motion.button
        className="relative w-16 h-8 rounded-full bg-white/10 border border-white/20"
        onClick={() => setIsYearly(!isYearly)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="absolute top-1 w-6 h-6 rounded-full bg-gradient-to-r from-brand-gold to-luxury-gold-light shadow-lg"
          animate={{
            right: isYearly ? 4 : 36,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        />
      </motion.button>

      <button
        onClick={() => setIsYearly(true)}
        className="flex items-center gap-2"
      >
        <span
          className={`text-sm font-medium transition-colors ${
            isYearly ? "text-white" : "text-gray-500"
          }`}
        >
          پرداخت سالانه
        </span>
        <motion.div
          className="px-2 py-1 rounded-full bg-luxury-emerald-500/20 border border-luxury-emerald-500/30"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-xs font-bold text-luxury-emerald-400">
            ۲۰٪ تخفیف
          </span>
        </motion.div>
      </button>
    </div>
  );
};

export default function PlatformPricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section
      id="pricing"
      className="relative py-24 bg-gradient-to-b from-[#0a0a0a] to-[#050505] overflow-hidden"
    >
      <CustomCursorGlow />

      {/* Noise Texture */}
      <NoiseTexture />

      {/* Background Glow (lighter blur for perf) */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/3 right-1/3 w-[600px] h-[600px] bg-brand-gold/10 rounded-full blur-[80px]"
          style={{ willChange: "transform, opacity" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
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
          className="text-center mb-12"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-gradient-to-r from-brand-gold/20 to-luxury-gold-light/20 backdrop-blur-xl border border-brand-gold/30"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-bold text-brand-gold">
              قیمت‌گذاری شفاف و منصفانه
            </span>
          </motion.div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
            پلنی برای{" "}
            <span className="relative inline-block">
              <span className="absolute -inset-1 bg-gradient-to-r from-brand-gold to-luxury-gold-light blur-2xl opacity-30"></span>
              <span className="relative bg-gradient-to-r from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
                هر اندازه سالن
              </span>
            </span>
          </h2>

          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
            بدون هزینه پنهان. بدون قرارداد بلندمدت. لغو رایگان در هر زمان.
          </p>

          <PricingToggle isYearly={isYearly} setIsYearly={setIsYearly} />
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, i) => {
            const displayPrice =
              typeof plan.price === "number"
                ? isYearly
                  ? Math.floor(plan.price * 12 * 0.8).toLocaleString("fa-IR")
                  : plan.price.toLocaleString("fa-IR")
                : plan.price;

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative group"
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 -translate-x-1/2 z-20"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                  >
                    <div className="px-4 py-1.5 rounded-full bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black text-xs font-bold shadow-lg flex items-center gap-1">
                      <Crown className="w-3 h-3" />
                      پرطرفدارترین انتخاب
                    </div>
                  </motion.div>
                )}

                <div
                  className={`
                    relative h-full p-8 rounded-3xl border transition-all overflow-hidden
                    ${
                      plan.popular
                        ? "bg-white/[0.04] backdrop-blur-xl border-brand-gold/30 shadow-2xl shadow-brand-gold/20"
                        : "bg-white/[0.02] backdrop-blur-xl border-white/10"
                    }
                  `}
                >
                  <NoiseTexture />

                  {/* Gradient overlay */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  />

                  {/* Top glow for popular plan */}
                  {plan.popular && (
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent" />
                  )}

                  <div className="relative flex flex-col h-full">
                    {/* Icon */}
                    <motion.div
                      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <plan.icon
                        className="w-7 h-7"
                        style={{ color: plan.color }}
                      />
                    </motion.div>

                    {/* Plan Info */}
                    <h3 className="text-2xl font-bold text-white mb-2">
                      پلن {plan.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-6">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="text-4xl font-bold text-white">
                          {displayPrice}
                        </span>
                        {typeof plan.price === "number" && (
                          <span className="text-sm text-gray-500">تومان</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {typeof plan.price === "number" && isYearly
                          ? "سالانه (۲ ماه رایگان)"
                          : plan.duration}
                      </p>
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8 flex-1">
                      {plan.features.map((feature, idx) => (
                        <motion.li
                          key={feature}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.3 + idx * 0.05 }}
                          className="flex items-start gap-3"
                        >
                          <div className="w-5 h-5 rounded-full bg-luxury-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Check className="w-3 h-3 text-luxury-emerald-400" />
                          </div>
                          <span className="text-sm text-gray-300">
                            {feature}
                          </span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <Link href="/platform/signup" className="block mt-auto">
                      <motion.button
                        className={`
                          w-full py-4 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 relative overflow-hidden
                          ${
                            plan.popular
                              ? "bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black shadow-2xl shadow-brand-gold/30 hover:shadow-brand-gold/50"
                              : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                          }
                        `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {plan.popular && (
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
                          />
                        )}

                        <span className="relative z-10">{plan.cta}</span>
                        <ArrowLeft className="w-5 h-5 relative z-10" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10 mb-6">
            <Info className="w-5 h-5 text-brand-gold" />
            <span className="text-sm text-gray-400">
              تمامی پلن‌ها شامل{" "}
              <span className="text-white font-semibold">
                ۳۰ روز ضمانت بازگشت وجه
              </span>{" "}
              هستند
            </span>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10"
            >
              <Gift className="w-8 h-8 text-brand-gold mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-white mb-1">
                بدون هزینه اولیه
              </h4>
              <p className="text-xs text-gray-500">
                شروع آسان در چند دقیقه
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10"
            >
              <TrendingUp className="w-8 h-8 text-luxury-emerald-400 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-white mb-1">
                ارتقای فوری
              </h4>
              <p className="text-xs text-gray-500">
                تغییر پلن در یک کلیک
              </p>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="p-4 rounded-2xl bg-white/[0.02] backdrop-blur-xl border border-white/10"
            >
              <Zap className="w-8 h-8 text-luxury-sky-400 mx-auto mb-3" />
              <h4 className="text-sm font-semibold text-white mb-1">
                بدون قید و بند
              </h4>
              <p className="text-xs text-gray-500">
                لغو آسان بدون جریمه
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
