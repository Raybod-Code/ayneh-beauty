"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  Loader2,
  DollarSign,
} from "lucide-react";
import { toast } from "sonner";
import { getPlans, createPlan, updatePlan, deletePlan } from "../actions";

interface Plan {
  id: string;
  name: string;
  name_en: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  max_staff: number;
  max_services: number;
  max_bookings_per_month: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
}

export default function PlansSettings() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    setLoading(true);
    const result = await getPlans();
    if (result.success && result.data) {
      setPlans(result.data);
    }
    setLoading(false);
  };

  const handleDeletePlan = async (planId: string) => {
    if (!confirm("آیا از حذف این پلن اطمینان دارید؟")) return;

    const result = await deletePlan(planId);
    if (result.success) {
      toast.success("✅ پلن حذف شد");
      loadPlans();
    } else {
      toast.error("❌ خطا در حذف پلن");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-brand-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-black text-white">مدیریت پلن‌ها</h2>
          <p className="text-sm text-brand-gray mt-1">
            پلن‌های اشتراک و قیمت‌گذاری سیستم
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowNewPlanForm(true)}
          className="flex items-center gap-2 bg-brand-gold text-black rounded-2xl px-5 py-2.5 font-bold text-sm shadow-lg shadow-brand-gold/30 hover:shadow-brand-gold/50 transition-shadow"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          افزودن پلن جدید
        </motion.button>
      </motion.div>

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              index={index}
              onEdit={() => setEditingPlan(plan)}
              onDelete={() => handleDeletePlan(plan.id)}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* New Plan Modal */}
      <AnimatePresence>
        {showNewPlanForm && (
          <PlanFormModal
            onClose={() => setShowNewPlanForm(false)}
            onSuccess={() => {
              setShowNewPlanForm(false);
              loadPlans();
            }}
          />
        )}
      </AnimatePresence>

      {/* Edit Plan Modal */}
      <AnimatePresence>
        {editingPlan && (
          <PlanFormModal
            plan={editingPlan}
            onClose={() => setEditingPlan(null)}
            onSuccess={() => {
              setEditingPlan(null);
              loadPlans();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// Plan Card Component
function PlanCard({
  plan,
  index,
  onEdit,
  onDelete,
}: {
  plan: Plan;
  index: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const getIcon = () => {
    if (plan.name_en.toLowerCase().includes("premium")) return <Crown className="w-5 h-5" />;
    if (plan.name_en.toLowerCase().includes("pro")) return <Zap className="w-5 h-5" />;
    return <Sparkles className="w-5 h-5" />;
  };

  const getGradient = () => {
    if (plan.name_en.toLowerCase().includes("premium"))
      return "from-purple-500/20 via-brand-gold/10 to-purple-500/20";
    if (plan.name_en.toLowerCase().includes("pro"))
      return "from-brand-gold/20 via-yellow-500/10 to-brand-gold/20";
    return "from-blue-500/20 via-cyan-500/10 to-blue-500/20";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      {/* Popular Badge */}
      {plan.is_popular && (
        <div className="absolute -top-3 right-6 z-10">
          <div className="bg-brand-gold text-black text-xs font-black px-3 py-1 rounded-full shadow-lg">
            محبوب‌ترین
          </div>
        </div>
      )}

      {/* Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${getGradient()} rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700`} />

      {/* Card */}
      <div className="relative bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 flex items-center justify-center text-brand-gold">
              {getIcon()}
            </div>
            <div>
              <h3 className="text-lg font-black text-white">{plan.name}</h3>
              <p className="text-xs text-brand-gray">{plan.name_en}</p>
            </div>
          </div>

          {/* Status Badge */}
          <div
            className={`px-2 py-1 rounded-lg text-xs font-bold ${
              plan.is_active
                ? "bg-green-500/10 text-green-400 border border-green-500/20"
                : "bg-red-500/10 text-red-400 border border-red-500/20"
            }`}
          >
            {plan.is_active ? "فعال" : "غیرفعال"}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-brand-gray mb-4 line-clamp-2">
          {plan.description}
        </p>

        {/* Pricing */}
        <div className="mb-4 pb-4 border-b border-white/10">
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-white">
              {plan.price_monthly.toLocaleString("fa-IR")}
            </span>
            <span className="text-brand-gray text-sm">تومان / ماه</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-bold text-brand-gray line-through">
              {plan.price_yearly.toLocaleString("fa-IR")}
            </span>
            <span className="text-brand-gray text-xs">تومان / سال</span>
          </div>
        </div>

        {/* Limits */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-gray">تعداد کارمند</span>
            <span className="text-white font-bold">{plan.max_staff}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-gray">تعداد سرویس</span>
            <span className="text-white font-bold">{plan.max_services}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-brand-gray">رزرو در ماه</span>
            <span className="text-white font-bold">{plan.max_bookings_per_month}</span>
          </div>
        </div>

        {/* Features */}
        <div className="mb-4">
          <div className="text-xs font-bold text-white mb-2">امکانات:</div>
          <div className="space-y-1.5">
            {plan.features.slice(0, 3).map((feature, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-brand-gray">
                <Check className="w-3.5 h-3.5 text-brand-gold mt-0.5 flex-shrink-0" strokeWidth={3} />
                <span>{feature}</span>
              </div>
            ))}
            {plan.features.length > 3 && (
              <div className="text-xs text-brand-gray/70">
                و {plan.features.length - 3} مورد دیگر...
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-white/10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onEdit}
            className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl px-4 py-2 text-sm font-bold transition-colors"
          >
            <Edit className="w-4 h-4" strokeWidth={2.5} />
            ویرایش
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onDelete}
            className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-xl px-4 py-2 text-sm font-bold transition-colors"
          >
            <Trash2 className="w-4 h-4" strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

// Plan Form Modal Component
function PlanFormModal({
  plan,
  onClose,
  onSuccess,
}: {
  plan?: Plan;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: plan?.name || "",
    name_en: plan?.name_en || "",
    description: plan?.description || "",
    price_monthly: plan?.price_monthly || 0,
    price_yearly: plan?.price_yearly || 0,
    max_staff: plan?.max_staff || 1,
    max_services: plan?.max_services || 10,
    max_bookings_per_month: plan?.max_bookings_per_month || 100,
    features: plan?.features || [],
    is_popular: plan?.is_popular || false,
    is_active: plan?.is_active || true,
  });

  const [newFeature, setNewFeature] = useState("");

  const handleSubmit = async () => {
    if (!formData.name || !formData.name_en) {
      toast.error("نام پلن الزامی است");
      return;
    }

    setLoading(true);
    const result = plan
      ? await updatePlan(plan.id, formData)
      : await createPlan(formData);

    setLoading(false);

    if (result.success) {
      toast.success(plan ? "✅ پلن بروزرسانی شد" : "✅ پلن جدید ایجاد شد");
      onSuccess();
    } else {
      toast.error("❌ خطا در ذخیره پلن");
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({
        ...formData,
        features: [...formData.features, newFeature.trim()],
      });
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-white">
            {plan ? "ویرایش پلن" : "افزودن پلن جدید"}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" strokeWidth={2.5} />
          </button>
        </div>

        {/* Form */}
        <div className="space-y-5">
          {/* Names */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                نام فارسی
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
                placeholder="پایه"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                نام انگلیسی
              </label>
              <input
                type="text"
                value={formData.name_en}
                onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
                placeholder="Basic"
                dir="ltr"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              توضیحات
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all resize-none"
              placeholder="توضیحات پلن..."
            />
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                قیمت ماهانه (تومان)
              </label>
              <input
                type="number"
                value={formData.price_monthly}
                onChange={(e) =>
                  setFormData({ ...formData, price_monthly: Number(e.target.value) })
                }
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
                placeholder="500000"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                قیمت سالانه (تومان)
              </label>
              <input
                type="number"
                value={formData.price_yearly}
                onChange={(e) =>
                  setFormData({ ...formData, price_yearly: Number(e.target.value) })
                }
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
                placeholder="5000000"
                dir="ltr"
              />
            </div>
          </div>

          {/* Limits */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                تعداد کارمند
              </label>
              <input
                type="number"
                value={formData.max_staff}
                onChange={(e) =>
                  setFormData({ ...formData, max_staff: Number(e.target.value) })
                }
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
                min="1"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                تعداد سرویس
              </label>
              <input
                type="number"
                value={formData.max_services}
                onChange={(e) =>
                  setFormData({ ...formData, max_services: Number(e.target.value) })
                }
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
                min="1"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                رزرو/ماه
              </label>
              <input
                type="number"
                value={formData.max_bookings_per_month}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    max_bookings_per_month: Number(e.target.value),
                  })
                }
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
                min="1"
                dir="ltr"
              />
            </div>
          </div>

          {/* Features */}
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              امکانات
            </label>
            <div className="space-y-2">
              {formData.features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2"
                >
                  <Check className="w-4 h-4 text-brand-gold" strokeWidth={2.5} />
                  <span className="flex-1 text-sm text-white">{feature}</span>
                  <button
                    onClick={() => removeFeature(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </button>
                </div>
              ))}

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addFeature()}
                  className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
                  placeholder="امکان جدید..."
                />
                <button
                  onClick={addFeature}
                  className="bg-brand-gold/10 border border-brand-gold/20 text-brand-gold rounded-xl px-4 py-2 text-sm font-bold hover:bg-brand-gold/20 transition-colors"
                >
                  افزودن
                </button>
              </div>
            </div>
          </div>

          {/* Toggles */}
          <div className="flex gap-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_popular}
                onChange={(e) =>
                  setFormData({ ...formData, is_popular: e.target.checked })
                }
                className="w-5 h-5 rounded border-2 border-white/20 checked:bg-brand-gold checked:border-brand-gold"
              />
              <span className="text-sm text-white font-bold">محبوب‌ترین</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) =>
                  setFormData({ ...formData, is_active: e.target.checked })
                }
                className="w-5 h-5 rounded border-2 border-white/20 checked:bg-green-500 checked:border-green-500"
              />
              <span className="text-sm text-white font-bold">فعال</span>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6 pt-6 border-t border-white/10">
          <button
            onClick={onClose}
            className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl px-6 py-3 font-bold transition-colors"
          >
            انصراف
          </button>

          <motion.button
            onClick={handleSubmit}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold to-brand-gold/90 text-black rounded-2xl px-6 py-3 font-bold shadow-lg shadow-brand-gold/30 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Check className="w-5 h-5" strokeWidth={2.5} />
                {plan ? "بروزرسانی" : "ایجاد پلن"}
              </>
            )}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
