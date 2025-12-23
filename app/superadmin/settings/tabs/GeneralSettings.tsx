"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Upload,
  Image as ImageIcon,
  Save,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { updateGeneralSettings } from "../actions";

export default function GeneralSettings() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    site_name: "آینه بیوتی لانج",
    site_description: "سیستم مدیریت جامع سالن‌های زیبایی",
    site_url: "https://ayneh.beauty",
    contact_email: "info@ayneh.beauty",
    contact_phone: "09123456789",
    contact_address: "تهران، خیابان ولیعصر",
    logo_url: "",
    favicon_url: "",
    timezone: "Asia/Tehran",
    language: "fa",
  });

  const handleSave = async () => {
    setLoading(true);
    const result = await updateGeneralSettings(formData);
    setLoading(false);

    if (result.success) {
      toast.success("✅ تنظیمات با موفقیت ذخیره شد");
    } else {
      toast.error("❌ خطا در ذخیره تنظیمات");
    }
  };

  return (
    <div className="space-y-6">
      {/* Site Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden relative group"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold/10 via-purple-500/5 to-brand-gold/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">اطلاعات سایت</h2>
              <p className="text-xs text-brand-gray mt-0.5">
                تنظیمات اصلی و هویت برند
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                نام سایت
              </label>
              <div className="relative group/input">
                <input
                  type="text"
                  value={formData.site_name}
                  onChange={(e) =>
                    setFormData({ ...formData, site_name: e.target.value })
                  }
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                  placeholder="نام سایت خود را وارد کنید"
                />
              </div>
            </div>

            {/* Site URL */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                آدرس سایت
              </label>
              <div className="relative">
                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" strokeWidth={2.5} />
                <input
                  type="url"
                  value={formData.site_url}
                  onChange={(e) =>
                    setFormData({ ...formData, site_url: e.target.value })
                  }
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                  placeholder="https://example.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Description - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-white mb-2">
                توضیحات سایت
              </label>
              <textarea
                value={formData.site_description}
                onChange={(e) =>
                  setFormData({ ...formData, site_description: e.target.value })
                }
                rows={3}
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all resize-none"
                placeholder="توضیح کوتاهی درباره سایت..."
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Contact Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-brand-gold/5 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">اطلاعات تماس</h2>
              <p className="text-xs text-brand-gray mt-0.5">
                راه‌های ارتباطی با کاربران
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Contact Email */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                ایمیل تماس
              </label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" strokeWidth={2.5} />
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_email: e.target.value })
                  }
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                  placeholder="info@example.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                شماره تماس
              </label>
              <div className="relative">
                <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" strokeWidth={2.5} />
                <input
                  type="tel"
                  value={formData.contact_phone}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_phone: e.target.value })
                  }
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                  placeholder="09123456789"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Address - Full Width */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-white mb-2">
                آدرس
              </label>
              <div className="relative">
                <MapPin className="absolute right-4 top-4 w-5 h-5 text-brand-gray" strokeWidth={2.5} />
                <textarea
                  value={formData.contact_address}
                  onChange={(e) =>
                    setFormData({ ...formData, contact_address: e.target.value })
                  }
                  rows={2}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all resize-none"
                  placeholder="آدرس کامل را وارد کنید"
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end"
      >
        <motion.button
          onClick={handleSave}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="group/btn relative"
        >
          <div className="absolute -inset-1 bg-brand-gold/40 rounded-2xl blur-lg opacity-60 group-hover/btn:opacity-100 transition-opacity" />
          <div className="relative flex items-center gap-3 bg-gradient-to-r from-brand-gold to-brand-gold/90 text-black rounded-2xl px-8 py-3.5 font-bold shadow-2xl shadow-brand-gold/30 disabled:opacity-50">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" strokeWidth={2.5} />
                ذخیره تنظیمات
              </>
            )}
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
