// app/admin/(protected)/(admin-only)/tenants/[id]/edit/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";
import { Building2, ArrowRight, Loader2, Save, Link2, Crown, Globe } from "lucide-react";
import Link from "next/link";

export default function EditTenantPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    plan: "bronze",
    locale: "fa",
  });

  useEffect(() => {
    async function fetchTenant() {
      const supabase = createClient();
      const { data } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", params.id)
        .single();
      
      if (data) {
        setFormData({
          name: data.name || "",
          slug: data.slug || "",
          plan: data.plan || "bronze",
          locale: data.locale || "fa",
        });
      }
      setLoading(false);
    }
    fetchTenant();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("tenants")
        .update({
          name: formData.name,
          slug: formData.slug,
          plan: formData.plan,
          locale: formData.locale,
        })
        .eq("id", params.id);

      if (error) throw error;

      router.push(`/admin/tenants/${params.id}`);
    } catch (error: any) {
      alert("خطا: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-[#0a0a0a] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#C8A951] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#050505] to-[#0a0a0a] text-white">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/3 w-[600px] h-[600px] bg-[#C8A951]/[0.02] rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] bg-purple-500/[0.02] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 p-6 lg:p-8">
        <div className="max-w-3xl mx-auto">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <Link
              href={`/admin/tenants/${params.id}`}
              className="text-gray-500 hover:text-[#C8A951] transition-colors text-sm font-bold flex items-center gap-2 group"
            >
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              بازگشت به جزئیات
            </Link>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C8A951] to-[#D4B56A] flex items-center justify-center shadow-lg shadow-[#C8A951]/20">
                <Building2 className="w-6 h-6 text-black" />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white">
                ویرایش سالن
              </h1>
            </div>
            <p className="text-gray-400 mr-16">
              ویرایش اطلاعات سالن در سیستم
            </p>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative group"
          >
            {/* Glow */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C8A951]/10 via-transparent to-[#C8A951]/10 rounded-[2rem] opacity-0 group-hover:opacity-100 blur transition-opacity duration-700" />
            
            {/* Card */}
            <div className="relative bg-[#111] border border-white/5 rounded-[2rem] p-8 overflow-hidden hover:border-[#C8A951]/20 transition-all">
              {/* Noise */}
              <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/noise.png')] pointer-events-none" />

              <div className="relative z-10">
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
                      disabled={saving}
                      className="group relative w-full overflow-hidden"
                    >
                      {/* Glow */}
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-[#C8A951] to-[#D4B56A] rounded-2xl blur opacity-50 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Button */}
                      <div className="relative bg-gradient-to-r from-[#C8A951] to-[#D4B56A] text-black py-4 rounded-2xl font-black text-lg hover:shadow-2xl hover:shadow-[#C8A951]/40 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-3">
                        {saving ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            در حال ذخیره...
                          </>
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            ذخیره تغییرات
                          </>
                        )}
                      </div>
                    </button>
                  </motion.div>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
