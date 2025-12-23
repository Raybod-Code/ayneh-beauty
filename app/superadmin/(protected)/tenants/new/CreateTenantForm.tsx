"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  Crown,
  Globe,
  Mail,
  User,
  Sparkles,
  Zap,
  Shield,
  Eye,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { createTenant } from "./actions";
import { toast } from "sonner";

type Step = 1 | 2 | 3 | 4;

interface FormData {
  name: string;
  slug: string;
  description: string;
  plan: "basic" | "pro" | "enterprise";
  language: string;
  timezone: string;
  currency: string;
  ownerEmail: string;
  ownerName: string;
}

export default function CreateTenantForm() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    description: "",
    plan: "basic",
    language: "fa",
    timezone: "Asia/Tehran",
    currency: "IRR",
    ownerEmail: "",
    ownerName: "",
  });

  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "رایگان",
      icon: Building2,
      features: ["5 کاربر", "100 رزرو/ماه", "پشتیبانی ایمیل"],
      color: "blue",
    },
    {
      id: "pro",
      name: "Pro",
      price: "$49/ماه",
      icon: Zap,
      features: ["20 کاربر", "نامحدود رزرو", "پشتیبانی 24/7", "تحلیل پیشرفته"],
      color: "brand-gold",
      popular: true,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: "سفارشی",
      icon: Shield,
      features: ["کاربر نامحدود", "API دسترسی", "White Label", "مشاور اختصاصی"],
      color: "purple",
    },
  ];

  const handleNext = () => {
    if (currentStep === 1 && (!formData.name || !formData.slug)) {
      toast.error("لطفا نام و دامنه را وارد کنید");
      return;
    }
    if (currentStep === 3 && (!formData.ownerEmail || !formData.ownerName)) {
      toast.error("لطفا اطلاعات مالک را وارد کنید");
      return;
    }
    if (currentStep < 4) setCurrentStep((currentStep + 1) as Step);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep((currentStep - 1) as Step);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    const result = await createTenant(formData);

    if (result.success) {
      toast.success("✅ سالن با موفقیت ثبت شد!");
      router.push(`/superadmin/tenants/${result.tenantId}`);
    } else {
      toast.error("خطا: " + result.error);
      setLoading(false);
    }
  };

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from name
    if (field === "name") {
      const slug = value
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "");
      setFormData((prev) => ({ ...prev, slug }));
    }
  };

  const steps = [
    { number: 1, title: "اطلاعات پایه", icon: Building2 },
    { number: 2, title: "انتخاب پلن", icon: Crown },
    { number: 3, title: "اطلاعات مالک", icon: User },
    { number: 4, title: "بررسی نهایی", icon: Eye },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Link
          href="/superadmin/tenants"
          className="inline-flex items-center gap-2 text-sm text-brand-gray hover:text-brand-gold transition-colors mb-6"
        >
          <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
          بازگشت به لیست سالن‌ها
        </Link>

        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-gold/80 flex items-center justify-center shadow-2xl shadow-brand-gold/30">
            <Sparkles className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-white">افزودن سالن جدید</h1>
            <p className="text-brand-gray mt-1">ثبت سالن زیبایی در سیستم</p>
          </div>
        </div>
      </motion.div>

      {/* Progress Steps */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-8"
      >
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-6 right-0 left-0 h-0.5 bg-white/5" />
          <motion.div
            className="absolute top-6 right-0 h-0.5 bg-gradient-to-l from-brand-gold to-brand-gold/60"
            initial={{ width: "0%" }}
            animate={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Steps */}
          <div className="relative flex justify-between">
            {steps.map((step) => {
              const Icon = step.icon;
              const isActive = currentStep === step.number;
              const isCompleted = currentStep > step.number;

              return (
                <motion.div
                  key={step.number}
                  className="flex flex-col items-center gap-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + step.number * 0.1 }}
                >
                  <div
                    className={`relative w-12 h-12 rounded-xl flex items-center justify-center border-2 transition-all duration-500 ${
                      isCompleted
                        ? "bg-brand-gold border-brand-gold"
                        : isActive
                        ? "bg-brand-gold/20 border-brand-gold"
                        : "bg-white/5 border-white/10"
                    }`}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6 text-white" strokeWidth={3} />
                    ) : (
                      <Icon
                        className={`w-5 h-5 ${
                          isActive ? "text-brand-gold" : "text-brand-gray"
                        }`}
                        strokeWidth={2.5}
                      />
                    )}
                  </div>
                  <div className="text-center">
                    <div
                      className={`text-xs font-bold ${
                        isActive ? "text-white" : "text-brand-gray"
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Form Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="relative group"
        >
          <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold/10 via-transparent to-brand-gold/10 rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur transition-opacity duration-700" />

          <div className="relative bg-[#111] border border-white/5 rounded-[2.5rem] p-8 overflow-hidden">
            {/* Noise */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
              backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
            }} />

            <div className="relative z-10">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">اطلاعات پایه</h3>
                    <p className="text-brand-gray text-sm">نام و دامنه سالن را وارد کنید</p>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        نام سالن <span className="text-red-400">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute -inset-0.5 bg-brand-gold/20 rounded-2xl opacity-0 group-focus-within/input:opacity-100 blur transition-opacity" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => updateFormData("name", e.target.value)}
                          placeholder="مثال: سالن زیبایی رویال"
                          className="relative w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-brand-gray focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all backdrop-blur-xl"
                        />
                      </div>
                    </div>

                    {/* Slug */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        دامنه <span className="text-red-400">*</span>
                      </label>
                      <div className="relative group/input">
                        <div className="absolute -inset-0.5 bg-brand-gold/20 rounded-2xl opacity-0 group-focus-within/input:opacity-100 blur transition-opacity" />
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => updateFormData("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                            placeholder="royal"
                            className="relative w-full bg-white/[0.02] border border-white/10 rounded-r-2xl px-6 py-4 text-white placeholder:text-brand-gray focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all backdrop-blur-xl"
                          />
                          <span className="px-6 py-4 bg-white/5 border border-white/10 border-r-0 rounded-l-2xl text-brand-gray text-sm font-mono whitespace-nowrap">
                            .ayneh.com
                          </span>
                        </div>
                      </div>
                      {formData.slug && (
                        <p className="text-xs text-brand-gray mt-2 flex items-center gap-2">
                          <Globe className="w-3 h-3" />
                          دامنه شما: <span className="text-brand-gold font-mono">{formData.slug}.ayneh.com</span>
                        </p>
                      )}
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        توضیحات (اختیاری)
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => updateFormData("description", e.target.value)}
                        placeholder="توضیحات مختصر درباره سالن..."
                        rows={4}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-brand-gray focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all backdrop-blur-xl resize-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Plan Selection */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">انتخاب پلن</h3>
                    <p className="text-brand-gray text-sm">بهترین پلن را برای سالن انتخاب کنید</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {plans.map((plan) => {
                      const Icon = plan.icon;
                      const isSelected = formData.plan === plan.id;

                      return (
                        <motion.button
                          key={plan.id}
                          onClick={() => updateFormData("plan", plan.id)}
                          whileHover={{ scale: 1.02, y: -4 }}
                          whileTap={{ scale: 0.98 }}
                          className="relative group/plan"
                        >
                          {plan.popular && (
                            <div className="absolute -top-3 right-1/2 translate-x-1/2 px-3 py-1 bg-brand-gold text-black text-xs font-black rounded-full z-10">
                              محبوب
                            </div>
                          )}

                          <div className={`absolute -inset-0.5 rounded-2xl opacity-0 group-hover/plan:opacity-100 blur transition-opacity duration-500 ${
                            isSelected
                              ? `bg-${plan.color}/30 opacity-100`
                              : `bg-${plan.color}/20`
                          }`} />

                          <div className={`relative bg-[#0a0a0a] border-2 rounded-2xl p-6 transition-all ${
                            isSelected
                              ? `border-${plan.color === "brand-gold" ? "brand-gold" : plan.color + "-400"}`
                              : "border-white/10"
                          }`}>
                            <div className={`w-12 h-12 mx-auto mb-4 rounded-xl flex items-center justify-center ${
                              isSelected
                                ? `bg-${plan.color === "brand-gold" ? "brand-gold" : plan.color + "-400"}/20 border border-${plan.color === "brand-gold" ? "brand-gold" : plan.color + "-400"}/30`
                                : "bg-white/5 border border-white/10"
                            }`}>
                              <Icon className={`w-6 h-6 ${
                                isSelected
                                  ? `text-${plan.color === "brand-gold" ? "brand-gold" : plan.color + "-400"}`
                                  : "text-brand-gray"
                              }`} strokeWidth={2.5} />
                            </div>

                            <h4 className="text-xl font-black text-white text-center mb-2">{plan.name}</h4>
                            <p className="text-2xl font-black text-brand-gold text-center mb-6">{plan.price}</p>

                            <ul className="space-y-2">
                              {plan.features.map((feature, idx) => (
                                <li key={idx} className="flex items-center gap-2 text-xs text-brand-gray">
                                  <Check className={`w-4 h-4 ${
                                    isSelected ? "text-green-400" : "text-brand-gray"
                                  }`} strokeWidth={2.5} />
                                  {feature}
                                </li>
                              ))}
                            </ul>

                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute top-4 left-4 w-6 h-6 bg-brand-gold rounded-full flex items-center justify-center"
                              >
                                <Check className="w-4 h-4 text-black" strokeWidth={3} />
                              </motion.div>
                            )}
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Owner Info */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">اطلاعات مالک</h3>
                    <p className="text-brand-gray text-sm">مشخصات مالک سالن را وارد کنید</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        نام مالک <span className="text-red-400">*</span>
                      </label>
                      <div className="relative group/input">
                        <User className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray group-focus-within/input:text-brand-gold transition-colors" strokeWidth={2.5} />
                        <input
                          type="text"
                          value={formData.ownerName}
                          onChange={(e) => updateFormData("ownerName", e.target.value)}
                          placeholder="نام و نام خانوادگی"
                          className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-14 pl-6 py-4 text-white placeholder:text-brand-gray focus:border-brand-gold/50 focus:outline-none transition-all backdrop-blur-xl"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-white mb-2">
                        ایمیل مالک <span className="text-red-400">*</span>
                      </label>
                      <div className="relative group/input">
                        <Mail className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray group-focus-within/input:text-brand-gold transition-colors" strokeWidth={2.5} />
                        <input
                          type="email"
                          value={formData.ownerEmail}
                          onChange={(e) => updateFormData("ownerEmail", e.target.value)}
                          placeholder="email@example.com"
                          className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-14 pl-6 py-4 text-white placeholder:text-brand-gray focus:border-brand-gold/50 focus:outline-none transition-all backdrop-blur-xl"
                        />
                      </div>
                      <p className="text-xs text-brand-gray mt-2 flex items-center gap-2">
                        <AlertCircle className="w-3 h-3" />
                        لینک فعال‌سازی به این ایمیل ارسال می‌شود
                      </p>
                    </div>

                    {/* Advanced Settings */}
                    <div className="grid md:grid-cols-3 gap-4 pt-4">
                      <div>
                        <label className="block text-xs font-bold text-brand-gray mb-2">زبان</label>
                        <select
                          value={formData.language}
                          onChange={(e) => updateFormData("language", e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-gold/50 focus:outline-none transition-all backdrop-blur-xl"
                        >
                          <option value="fa">فارسی</option>
                          <option value="en">English</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-gray mb-2">منطقه زمانی</label>
                        <select
                          value={formData.timezone}
                          onChange={(e) => updateFormData("timezone", e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-gold/50 focus:outline-none transition-all backdrop-blur-xl"
                        >
                          <option value="Asia/Tehran">تهران (UTC+3:30)</option>
                          <option value="Asia/Dubai">دبی (UTC+4)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-brand-gray mb-2">ارز</label>
                        <select
                          value={formData.currency}
                          onChange={(e) => updateFormData("currency", e.target.value)}
                          className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:border-brand-gold/50 focus:outline-none transition-all backdrop-blur-xl"
                        >
                          <option value="IRR">ریال (IRR)</option>
                          <option value="USD">دلار (USD)</option>
                          <option value="EUR">یورو (EUR)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-2xl font-black text-white mb-2">بررسی نهایی</h3>
                    <p className="text-brand-gray text-sm">قبل از ثبت، اطلاعات را بررسی کنید</p>
                  </div>

                  <div className="space-y-4">
                    {/* Preview Card */}
                    <div className="relative group/preview">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold/20 via-purple-500/10 to-blue-500/10 rounded-2xl blur" />
                      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-brand-gold/10 border border-brand-gold/20 rounded-2xl flex items-center justify-center">
                            <Building2 className="w-8 h-8 text-brand-gold" strokeWidth={2.5} />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-white">{formData.name}</h4>
                            <p className="text-sm text-brand-gray font-mono">{formData.slug}.ayneh.com</p>
                          </div>
                        </div>

                        {formData.description && (
                          <p className="text-sm text-brand-gray leading-relaxed">{formData.description}</p>
                        )}

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                          <div>
                            <p className="text-xs text-brand-gray mb-1">پلن انتخابی</p>
                            <p className="text-sm font-bold text-white capitalize">{formData.plan}</p>
                          </div>
                          <div>
                            <p className="text-xs text-brand-gray mb-1">مالک</p>
                            <p className="text-sm font-bold text-white">{formData.ownerName}</p>
                          </div>
                          <div>
                            <p className="text-xs text-brand-gray mb-1">ایمیل</p>
                            <p className="text-sm font-bold text-white">{formData.ownerEmail}</p>
                          </div>
                          <div>
                            <p className="text-xs text-brand-gray mb-1">زبان</p>
                            <p className="text-sm font-bold text-white">{formData.language === "fa" ? "فارسی" : "English"}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Warning */}
                    <div className="flex items-start gap-3 p-4 bg-yellow-400/5 border border-yellow-400/20 rounded-xl">
                      <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                      <div>
                        <p className="text-sm font-bold text-yellow-400 mb-1">توجه</p>
                        <p className="text-xs text-brand-gray leading-relaxed">
                          پس از ثبت، یک ایمیل حاوی لینک فعال‌سازی به آدرس <span className="text-white font-mono">{formData.ownerEmail}</span> ارسال خواهد شد.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/5">
                <motion.button
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  whileHover={{ scale: currentStep === 1 ? 1 : 1.05 }}
                  whileTap={{ scale: currentStep === 1 ? 1 : 0.95 }}
                  className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-2xl font-bold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
                  قبلی
                </motion.button>

                {currentStep < 4 ? (
                  <motion.button
                    onClick={handleNext}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative"
                  >
                    <div className="absolute -inset-1 bg-brand-gold/40 rounded-2xl blur opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-brand-gold to-brand-gold/90 text-white rounded-2xl font-bold shadow-lg shadow-brand-gold/30">
                      بعدی
                      <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
                    </div>
                  </motion.button>
                ) : (
                  <motion.button
                    onClick={handleSubmit}
                    disabled={loading}
                    whileHover={{ scale: loading ? 1 : 1.05 }}
                    whileTap={{ scale: loading ? 1 : 0.95 }}
                    className="group relative"
                  >
                    <div className="absolute -inset-1 bg-green-500/40 rounded-2xl blur opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="relative flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-500/30 disabled:opacity-50">
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                          />
                          در حال ثبت...
                        </>
                      ) : (
                        <>
                          <Check className="w-4 h-4" strokeWidth={3} />
                          ثبت سالن
                        </>
                      )}
                    </div>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
