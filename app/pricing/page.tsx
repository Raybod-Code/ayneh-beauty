// app/pricing/page.tsx
import { createClient } from "@/lib/supabase/server";
import { 
  Check, 
  Crown, 
  Zap, 
  Users, 
  Globe, 
  Brain, 
  Shield, 
  Sparkles,
  ArrowRight 
} from "lucide-react";

export const metadata = {
  title: "پلن‌های اشتراک | Ayneh Beauty",
  description: "انتخاب پلن مناسب برای سالن زیبایی خود",
};

export default async function PricingPage() {
  const supabase = await createClient();
  
  const { data: plans } = await supabase
    .from('subscription_plans')
    .select('*')
    .order('price_monthly', { ascending: true });

  const planIcons: Record<string, any> = {
    bronze: Shield,
    silver: Zap,
    gold: Crown,
    platinum: Sparkles,
  };

  const features = {
    bronze: [
      { text: "پنل مدیریت هوشمند", icon: Check },
      { text: "5 کاربر پرسنل", icon: Users },
      { text: "رزرو آنلاین نامحدود", icon: Check },
      { text: "پشتیبانی ایمیلی", icon: Check },
      { text: "گزارش‌های ساده", icon: Check },
    ],
    silver: [
      { text: "تمام امکانات برنز", icon: Check },
      { text: "15 کاربر پرسنل", icon: Users },
      { text: "آنالیز چهره با AI", icon: Brain },
      { text: "پشتیبانی اولویت‌دار", icon: Crown },
      { text: "گزارش‌های پیشرفته", icon: Check },
    ],
    gold: [
      { text: "تمام امکانات نقره", icon: Check },
      { text: "50 کاربر پرسنل", icon: Users },
      { text: "دامنه اختصاصی", icon: Globe },
      { text: "آنالیز دست و ناخن AI", icon: Brain },
      { text: "پشتیبانی 24/7", icon: Crown },
    ],
    platinum: [
      { text: "تمام امکانات طلا", icon: Check },
      { text: "پرسنل نامحدود", icon: Users },
      { text: "اپلیکیشن موبایل اختصاصی", icon: Check },
      { text: "تمامی قابلیت‌های AI", icon: Brain },
      { text: "مشاور اختصاصی", icon: Crown },
    ],
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#C8A951]/5 via-transparent to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#C8A951]/10 border border-[#C8A951]/20 rounded-full mb-6">
              <Crown className="w-4 h-4 text-[#C8A951]" />
              <span className="text-sm text-[#C8A951] font-sans">
                پلن‌های اشتراک
              </span>
            </div>

            <h1 className="font-playfair text-5xl md:text-7xl font-bold mb-6 leading-tight">
              پلن مناسب خود را
              <br />
              <span className="text-[#C8A951]">انتخاب کنید</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-sans">
              هر آنچه برای دیجیتالی کردن سالن زیبایی خود نیاز دارید،
              در یک پلتفرم
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
            {plans?.map((plan) => {
              const Icon = planIcons[plan.slug] || Crown;
              const isPopular = plan.slug === 'gold';
              const planFeatures = features[plan.slug as keyof typeof features] || [];

              return (
                <div
                  key={plan.id}
                  className={`relative group ${
                    isPopular ? 'lg:-mt-4 lg:mb-4' : ''
                  }`}
                >
                  {/* Popular Badge */}
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <div className="bg-gradient-to-r from-[#C8A951] to-[#D4B56A] text-black px-4 py-1 rounded-full text-xs font-bold tracking-wide font-sans">
                        محبوب‌ترین
                      </div>
                    </div>
                  )}

                  {/* Card */}
                  <div
                    className={`relative h-full bg-[#0a0a0a] backdrop-blur-xl rounded-2xl overflow-hidden transition-all duration-500 ${
                      isPopular
                        ? 'border-2 border-[#C8A951] shadow-2xl shadow-[#C8A951]/20'
                        : 'border border-white/5 hover:border-white/10'
                    } group-hover:scale-105`}
                  >
                    {/* Glow Effect */}
                    <div className={`absolute inset-0 bg-gradient-to-b ${
                      isPopular 
                        ? 'from-[#C8A951]/10 to-transparent' 
                        : 'from-white/5 to-transparent'
                    } opacity-0 group-hover:opacity-100 transition-opacity`} />

                    <div className="relative z-10 p-8">
                      {/* Icon */}
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-6 ${
                        isPopular 
                          ? 'bg-[#C8A951]/20 text-[#C8A951]' 
                          : 'bg-white/5 text-white'
                      }`}>
                        <Icon className="w-7 h-7" />
                      </div>

                      {/* Plan Name */}
                      <h3 className="font-playfair text-2xl font-bold mb-2">
                        {plan.name}
                      </h3>

                      {/* Price */}
                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-5xl font-bold font-sans">
                            ${plan.price_monthly}
                          </span>
                          <span className="text-gray-500 font-sans">/ماه</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 font-sans">
                          یا ${plan.price_yearly} سالانه
                        </p>
                      </div>

                      {/* Features */}
                      <ul className="space-y-3 mb-8">
                        {planFeatures.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-[#C8A951] flex-shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-300 font-sans">
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* CTA Button */}
                      <button
                        className={`w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 group/btn font-sans ${
                          isPopular
                            ? 'bg-gradient-to-r from-[#C8A951] to-[#D4B56A] text-black hover:shadow-xl hover:shadow-[#C8A951]/30'
                            : 'bg-white/5 text-white hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        شروع کنید
                        <ArrowRight className="w-4 h-4 group-hover/btn:-translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Badges */}
          <div className="mt-16 pt-16 border-t border-white/5">
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto text-center">
              <div>
                <Shield className="w-8 h-8 text-[#C8A951] mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-sans">
                  پرداخت امن
                </p>
              </div>
              <div>
                <Check className="w-8 h-8 text-[#C8A951] mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-sans">
                  لغو در هر زمان
                </p>
              </div>
              <div>
                <Crown className="w-8 h-8 text-[#C8A951] mx-auto mb-3" />
                <p className="text-sm text-gray-400 font-sans">
                  پشتیبانی 24/7
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
