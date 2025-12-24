// components/platform/PlatformPricing.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { 
  Check,
  Crown,
  Zap,
  Users,
  Globe,
  Brain,
  Shield,
  Sparkles,
  ArrowLeft,
  TrendingUp,
  Star,
  Infinity
} from "lucide-react";
import { useRef, useState } from "react";
import Link from "next/link";

const plans = [
  {
    id: 'starter',
    name: 'استارتر',
    slug: 'starter',
    icon: Shield,
    price_monthly: 0,
    price_yearly: 0,
    description: 'برای شروع و آزمایش',
    popular: false,
    gradient: 'from-luxury-slate-500 to-luxury-slate-600',
    features: [
      { text: 'پنل مدیریت پایه' },
      { text: '۳ کاربر پرسنل' },
      { text: '۵۰ رزرو در ماه' },
      { text: 'پشتیبانی ایمیلی' },
      { text: 'گزارش‌های ساده' },
    ]
  },
  {
    id: 'professional',
    name: 'حرفه‌ای',
    slug: 'professional',
    icon: Zap,
    price_monthly: 49,
    price_yearly: 470,
    description: 'برای سالن‌های در حال رشد',
    popular: false,
    gradient: 'from-luxury-sky-500 to-luxury-sky-600',
    features: [
      { text: 'تمام امکانات استارتر' },
      { text: '۱۰ کاربر پرسنل' },
      { text: 'رزرو نامحدود' },
      { text: 'آنالیز چهره AI' },
      { text: 'پشتیبانی اولویت‌دار' },
      { text: 'گزارش‌های پیشرفته' },
    ]
  },
  {
    id: 'business',
    name: 'کسب‌وکار',
    slug: 'business',
    icon: Crown,
    price_monthly: 99,
    price_yearly: 950,
    description: 'محبوب‌ترین انتخاب',
    popular: true,
    gradient: 'from-brand-gold to-luxury-gold-light',
    features: [
      { text: 'تمام امکانات حرفه‌ای' },
      { text: '۳۰ کاربر پرسنل' },
      { text: 'رزرو نامحدود' },
      { text: 'دامنه اختصاصی' },
      { text: 'تمام قابلیت‌های AI' },
      { text: 'پشتیبانی ۲۴/۷' },
      { text: 'اپلیکیشن موبایل' },
    ]
  },
  {
    id: 'enterprise',
    name: 'سازمانی',
    slug: 'enterprise',
    icon: Sparkles,
    price_monthly: null,
    price_yearly: null,
    description: 'برای شبکه‌های بزرگ',
    popular: false,
    gradient: 'from-luxury-rose-500 to-luxury-rose-600',
    features: [
      { text: 'تمام امکانات کسب‌وکار' },
      { text: 'پرسنل نامحدود' },
      { text: 'چند شعبه' },
      { text: 'API اختصاصی' },
      { text: 'مشاور اختصاصی' },
      { text: 'قرارداد SLA' },
      { text: 'سفارشی‌سازی کامل' },
    ]
  },
];

export default function PlatformPricing() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <section id="pricing" className="relative py-32 bg-gradient-to-b from-[#050505] via-brand-dark to-[#050505] overflow-hidden">
      
      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-gold/5 rounded-full blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
            <Crown className="w-4 h-4 text-brand-gold" />
            <span className="text-sm font-semibold text-white">پلن‌های اشتراک</span>
          </div>
          
          <h2 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            پلن مناسب خود را{" "}
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-l from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
              انتخاب کنید
            </span>
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed mb-10">
            هر آنچه برای دیجیتالی کردن سالن زیبایی خود نیاز دارید
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-1.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 ${
                billingCycle === 'monthly'
                  ? 'bg-brand-gold text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ماهانه
            </button>
            <button
              onClick={() => setBillingCycle('yearly')}
              className={`px-6 py-2.5 rounded-full font-medium text-sm transition-all duration-300 flex items-center gap-2 ${
                billingCycle === 'yearly'
                  ? 'bg-brand-gold text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              سالانه
              <span className="px-2 py-0.5 bg-luxury-emerald-500/20 text-luxury-emerald-400 rounded-full text-xs font-bold">
                ۲۰٪ تخفیف
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const isPopular = plan.popular;
            const price = billingCycle === 'monthly' ? plan.price_monthly : plan.price_yearly;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 60, scale: 0.9 }}
                animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{
                  delay: index * 0.1,
                  duration: 0.6,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`relative group ${
                  isPopular ? 'lg:-mt-6 lg:mb-6' : ''
                }`}
                whileHover={{ y: -8 }}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black px-4 py-1.5 rounded-full text-xs font-bold tracking-wide flex items-center gap-1.5 shadow-2xl">
                      <Star className="w-3 h-3 fill-current" />
                      <span>محبوب‌ترین</span>
                    </div>
                  </div>
                )}

                {/* Glow */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${plan.gradient} rounded-3xl opacity-0 group-hover:opacity-30 blur-2xl transition-opacity duration-500`} />

                {/* Card */}
                <div
                  className={`relative h-full bg-white/[0.03] backdrop-blur-xl rounded-3xl overflow-hidden transition-all duration-500 ${
                    isPopular
                      ? 'border-2 border-brand-gold/50 shadow-2xl shadow-brand-gold/20'
                      : 'border border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Noise */}
                  <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none bg-[url('/noise.png')]" />

                  <div className="relative z-10 p-8">
                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-6 bg-gradient-to-br ${plan.gradient} shadow-2xl transition-transform duration-500 group-hover:scale-110`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Plan Name */}
                    <h3 className="font-serif text-2xl font-bold mb-2 text-white">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-400 mb-6">
                      {plan.description}
                    </p>

                    {/* Price */}
                    <div className="mb-8">
                      {price !== null ? (
                        <>
                          <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-bold text-white">
                              ${price}
                            </span>
                            <span className="text-gray-500">
                              /{billingCycle === 'monthly' ? 'ماه' : 'سال'}
                            </span>
                          </div>
                          {billingCycle === 'yearly' && (
                            <p className="text-sm text-luxury-emerald-400 mt-2 font-medium">
                              ${Math.round(price / 12)} در ماه
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="text-3xl font-bold text-white">
                          تماس بگیرید
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className={`w-5 h-5 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                            <Check className="w-3 h-3 text-white" />
                          </div>
                          <span className="text-sm text-gray-300">
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* CTA */}
                    <Link href="/platform/signup">
                      <motion.button
                        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                          isPopular
                            ? 'bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black hover:shadow-xl hover:shadow-brand-gold/30'
                            : 'bg-white/10 text-white hover:bg-white/20 border border-white/20 hover:border-white/30'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <span>شروع کنید</span>
                        <ArrowLeft className="w-4 h-4" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 pt-16 border-t border-white/10"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { icon: Shield, text: 'پرداخت امن' },
              { icon: Check, text: 'لغو در هر زمان' },
              { icon: Crown, text: 'پشتیبانی ۲۴/۷' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className="text-center group"
                whileHover={{ scale: 1.05 }}
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/5 border border-white/10 mb-4 group-hover:border-brand-gold/30 transition-all">
                  <item.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <p className="text-sm text-gray-400 group-hover:text-white transition-colors">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
