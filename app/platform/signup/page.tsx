// app/platform/signup/page.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Building2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Shield,
  Zap,
  Loader2,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import NoiseTexture from "@/components/ui/NoiseTexture";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    salonName: '',
    slug: '',
    ownerName: '',
    email: '',
    phone: '',
    city: '',
    staffCount: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/platform/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'خطا در ثبت نام');
      }

      // Success - redirect to success page
      router.push('/platform/signup/success');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden">
      
      {/* Noise Texture */}
      <NoiseTexture />

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxury-sky-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-20">
        
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/platform" className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-gold transition-colors mb-8">
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span className="text-sm">بازگشت به صفحه اصلی</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
              <Sparkles className="w-4 h-4 text-brand-gold" />
              <span className="text-sm font-semibold text-white">شروع رایگان ۳۰ روزه</span>
            </div>
            
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              سالن خود را{" "}
              <span className="bg-gradient-to-l from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
                دیجیتال کنید
              </span>
            </h1>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              در کمتر از ۵ دقیقه سالن خود را راه‌اندازی کنید
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative bg-white/[0.03] backdrop-blur-2xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden"
          >
            {/* Noise */}
            <NoiseTexture />

            <form onSubmit={handleSubmit} className="relative space-y-6">
              
              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 rounded-2xl bg-luxury-rose-500/10 border border-luxury-rose-500/30 text-luxury-rose-400"
                >
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              {/* Salon Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                  <Building2 className="w-4 h-4 text-brand-gold" />
                  <span>نام سالن</span>
                </label>
                <input
                  type="text"
                  value={formData.salonName}
                  onChange={(e) => setFormData({...formData, salonName: e.target.value})}
                  placeholder="مثلاً: سالن زیبایی رز"
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-brand-gold focus:bg-white/10 transition-all outline-none text-white placeholder:text-gray-500"
                  required
                  disabled={loading}
                />
              </div>

              {/* Slug */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  <span>آدرس اختصاصی (نام انگلیسی)</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                    placeholder="rose-salon"
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-brand-gold focus:bg-white/10 transition-all outline-none text-white placeholder:text-gray-500"
                    required
                    disabled={loading}
                  />
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                    .ayneh.beauty
                  </div>
                </div>
                {formData.slug && (
                  <p className="mt-2 text-xs text-luxury-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>سالن شما در آدرس <strong>{formData.slug}.ayneh.beauty</strong> در دسترس خواهد بود</span>
                  </p>
                )}
              </div>

              {/* Owner Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                  <User className="w-4 h-4 text-brand-gold" />
                  <span>نام و نام خانوادگی شما</span>
                </label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                  placeholder="مثلاً: سارا احمدی"
                  className="w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-brand-gold focus:bg-white/10 transition-all outline-none text-white placeholder:text-gray-500"
                  required
                  disabled={loading}
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                    <Mail className="w-4 h-4 text-brand-gold" />
                    <span>ایمیل</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="info@example.com"
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-brand-gold focus:bg-white/10 transition-all outline-none text-white placeholder:text-gray-500"
                    required
                    disabled={loading}
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                    <Phone className="w-4 h-4 text-brand-gold" />
                    <span>موبایل</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-brand-gold focus:bg-white/10 transition-all outline-none text-white placeholder:text-gray-500"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-6">
                {/* City */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                    <MapPin className="w-4 h-4 text-brand-gold" />
                    <span>شهر</span>
                  </label>
                  <select
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-brand-gold focus:bg-white/10 transition-all outline-none text-white"
                    required
                    disabled={loading}
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="تهران">تهران</option>
                    <option value="اصفهان">اصفهان</option>
                    <option value="شیراز">شیراز</option>
                    <option value="مشهد">مشهد</option>
                    <option value="تبریز">تبریز</option>
                  </select>
                </div>

                {/* Staff Count */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
                    <Users className="w-4 h-4 text-brand-gold" />
                    <span>تعداد پرسنل</span>
                  </label>
                  <select
                    value={formData.staffCount}
                    onChange={(e) => setFormData({...formData, staffCount: e.target.value})}
                    className="w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-brand-gold focus:bg-white/10 transition-all outline-none text-white"
                    required
                    disabled={loading}
                  >
                    <option value="">انتخاب کنید</option>
                    <option value="1-3">۱ تا ۳ نفر</option>
                    <option value="4-10">۴ تا ۱۰ نفر</option>
                    <option value="11-30">۱۱ تا ۳۰ نفر</option>
                    <option value="30+">بیش از ۳۰ نفر</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black rounded-2xl font-bold text-lg shadow-2xl shadow-brand-gold/30 hover:shadow-2xl transition-all flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={!loading ? { scale: 1.02 } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>در حال ارسال...</span>
                  </>
                ) : (
                  <>
                    <span>شروع رایگان ۳۰ روزه</span>
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                  </>
                )}
              </motion.button>

              <p className="text-center text-xs text-gray-500">
                با ثبت نام، شما{" "}
                <Link href="#" className="text-brand-gold hover:underline">
                  شرایط و قوانین
                </Link>{" "}
                را می‌پذیرید
              </p>

            </form>
          </motion.div>

          {/* Benefits */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 lg:sticky lg:top-24"
          >
            <h3 className="font-serif text-2xl font-bold text-white mb-6">
              چرا آینه؟
            </h3>

            {[
              {
                icon: CheckCircle2,
                title: 'راه‌اندازی سریع',
                description: 'سالن خود را در کمتر از ۵ دقیقه راه‌اندازی کنید، بدون نیاز به دانش فنی'
              },
              {
                icon: Shield,
                title: 'امنیت کامل',
                description: 'رمزنگاری بانکی، بکاپ خودکار و تأیید دو مرحله‌ای'
              },
              {
                icon: Zap,
                title: 'افزایش درآمد',
                description: 'به طور میانگین ۲۵۰٪ افزایش رزروها در ۳ ماه اول'
              },
              {
                icon: Users,
                title: 'پشتیبانی ۲۴/۷',
                description: 'تیم پشتیبانی فارسی‌زبان همیشه در کنار شما'
              },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                className="relative flex gap-4 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-white/[0.06] transition-all overflow-hidden"
                whileHover={{ x: 4 }}
              >
                <NoiseTexture />
                <div className="relative w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-brand-gold" />
                </div>
                <div className="relative">
                  <h4 className="font-semibold text-white mb-2">{benefit.title}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{benefit.description}</p>
                </div>
              </motion.div>
            ))}

            {/* Trust Badge */}
            <div className="relative p-6 rounded-2xl bg-gradient-to-br from-brand-gold/10 to-transparent border border-brand-gold/20 overflow-hidden">
              <NoiseTexture />
              <p className="relative text-sm text-gray-400 mb-3">به ما اعتماد کرده‌اند:</p>
              <div className="relative flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-luxury-gold-light border-2 border-[#050505]" />
                  ))}
                </div>
                <span className="text-sm text-white font-semibold">
                  ۲,۵۰۰+ سالن فعال
                </span>
              </div>
            </div>

          </motion.div>

        </div>

      </div>
    </div>
  );
}
