// components/admin/NewTenantForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Loader2, Building2, Link2, Crown, Globe } from "lucide-react";

export default function NewTenantForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    plan: "bronze",
    locale: "fa",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("tenants")
        .insert({
          name: formData.name,
          slug: formData.slug,
          plan: formData.plan,
          locale: formData.locale,
          status: "active",
          is_active: true,
        })
        .select()
        .single();

      if (error) throw error;

      router.push(`/admin/tenants/${data.id}`);
    } catch (error: any) {
      alert("خطا: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-300">
          <Building2 className="w-4 h-4 text-[#C8A951]" />
          نام سالن
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C8A951]/20 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="relative w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-sans focus:border-[#C8A951]/50 focus:outline-none transition-all"
            placeholder="Royal Beauty Salon"
          />
        </div>
      </motion.div>

      {/* Slug Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-300">
          <Link2 className="w-4 h-4 text-[#C8A951]" />
          Slug (آدرس یکتا)
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C8A951]/20 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData({ ...formData, slug: e.target.value.toLowerCase() })
              }
              required
              pattern="[a-z0-9-]+"
              className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-sans focus:border-[#C8A951]/50 focus:outline-none transition-all"
              placeholder="royal"
            />
            <span className="text-gray-500 font-mono text-sm bg-white/5 px-4 py-4 rounded-2xl border border-white/5">
              .ayneh.com
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2 mr-1 font-mono">
          فقط حروف انگلیسی کوچک، اعداد و خط تیره (-)
        </p>
      </motion.div>

      {/* Plan Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-300">
          <Crown className="w-4 h-4 text-[#C8A951]" />
          پلن اشتراک
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C8A951]/20 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
          <select
            value={formData.plan}
            onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
            className="relative w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-sans focus:border-[#C8A951]/50 focus:outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="bronze" className="bg-[#111]">Bronze - $29.99/ماه</option>
            <option value="silver" className="bg-[#111]">Silver - $59.99/ماه</option>
            <option value="gold" className="bg-[#111]">Gold - $99.99/ماه (محبوب)</option>
            <option value="platinum" className="bg-[#111]">Platinum - $199.99/ماه</option>
          </select>
        </div>
      </motion.div>

      {/* Locale Field */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <label className="flex items-center gap-2 text-sm font-bold mb-3 text-gray-300">
          <Globe className="w-4 h-4 text-[#C8A951]" />
          زبان پیش‌فرض
        </label>
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C8A951]/20 to-transparent rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-opacity" />
          <select
            value={formData.locale}
            onChange={(e) => setFormData({ ...formData, locale: e.target.value })}
            className="relative w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white font-sans focus:border-[#C8A951]/50 focus:outline-none transition-all appearance-none cursor-pointer"
          >
            <option value="fa" className="bg-[#111]">فارسی (FA)</option>
            <option value="en" className="bg-[#111]">English (EN)</option>
            <option value="ar" className="bg-[#111]">العربية (AR)</option>
          </select>
        </div>
      </motion.div>

      {/* Submit Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="pt-4"
      >
        <button
          type="submit"
          disabled={loading}
          className="group relative w-full overflow-hidden"
        >
          {/* Glow */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C8A951] to-[#D4B56A] rounded-2xl blur opacity-50 group-hover:opacity-100 transition-opacity" />
          
          {/* Button */}
          <div className="relative bg-gradient-to-r from-[#C8A951] to-[#D4B56A] text-black py-4 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-[#C8A951]/40 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                در حال ایجاد سالن...
              </>
            ) : (
              <>
                <Building2 className="w-5 h-5" />
                ایجاد سالن جدید
              </>
            )}
          </div>
        </button>
      </motion.div>
    </form>
  );
}
