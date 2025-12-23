"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Server,
  Lock,
  User,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { updateEmailSettings, testEmailConnection } from "../actions";

export default function EmailSettings() {
  const [loading, setLoading] = useState(false);
  const [testing, setTesting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    smtp_host: "smtp.gmail.com",
    smtp_port: 587,
    smtp_user: "",
    smtp_password: "",
    smtp_from_email: "",
    smtp_from_name: "آینه بیوتی لانج",
    smtp_encryption: "tls" as "tls" | "ssl" | "none",
  });

  const handleSave = async () => {
    if (!formData.smtp_host || !formData.smtp_user || !formData.smtp_password) {
      toast.error("لطفاً تمام فیلدها را پر کنید");
      return;
    }

    setLoading(true);
    const result = await updateEmailSettings(formData);
    setLoading(false);

    if (result.success) {
      toast.success("✅ تنظیمات ایمیل ذخیره شد");
    } else {
      toast.error("❌ خطا در ذخیره تنظیمات");
    }
  };

  const handleTest = async () => {
    if (!formData.smtp_host || !formData.smtp_user || !formData.smtp_password) {
      toast.error("لطفاً ابتدا تنظیمات را وارد کنید");
      return;
    }

    setTesting(true);
    setTestResult(null);
    const result = await testEmailConnection(formData);
    setTesting(false);
    setTestResult(result);

    if (result.success) {
      toast.success("✅ اتصال موفقیت‌آمیز!");
    } else {
      toast.error("❌ خطا در اتصال");
    }
  };

  return (
    <div className="space-y-6">
      {/* SMTP Configuration Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden relative group"
      >
        {/* Glow Effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-purple-500/5 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Server className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">پیکربندی SMTP</h2>
              <p className="text-xs text-brand-gray mt-0.5">
                تنظیمات سرور ایمیل خروجی
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* SMTP Host */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                SMTP Host
              </label>
              <div className="relative">
                <Server className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" strokeWidth={2.5} />
                <input
                  type="text"
                  value={formData.smtp_host}
                  onChange={(e) =>
                    setFormData({ ...formData, smtp_host: e.target.value })
                  }
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                  placeholder="smtp.gmail.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* SMTP Port */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Port
              </label>
              <input
                type="number"
                value={formData.smtp_port}
                onChange={(e) =>
                  setFormData({ ...formData, smtp_port: Number(e.target.value) })
                }
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                placeholder="587"
                dir="ltr"
              />
            </div>

            {/* Encryption */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                نوع رمزنگاری
              </label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" strokeWidth={2.5} />
                <select
                  value={formData.smtp_encryption}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      smtp_encryption: e.target.value as "tls" | "ssl" | "none",
                    })
                  }
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-white focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all appearance-none cursor-pointer"
                  dir="ltr"
                >
                  <option value="tls">TLS (587)</option>
                  <option value="ssl">SSL (465)</option>
                  <option value="none">None</option>
                </select>
              </div>
            </div>

            {/* SMTP Username */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                نام کاربری (Email)
              </label>
              <div className="relative">
                <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" strokeWidth={2.5} />
                <input
                  type="email"
                  value={formData.smtp_user}
                  onChange={(e) =>
                    setFormData({ ...formData, smtp_user: e.target.value })
                  }
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                  placeholder="your@email.com"
                  dir="ltr"
                />
              </div>
            </div>

            {/* SMTP Password */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-white mb-2">
                رمز عبور / App Password
              </label>
              <div className="relative">
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" strokeWidth={2.5} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.smtp_password}
                  onChange={(e) =>
                    setFormData({ ...formData, smtp_password: e.target.value })
                  }
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-12 pl-14 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                  placeholder="••••••••••••••••"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-gray hover:text-white transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" strokeWidth={2.5} />
                  ) : (
                    <Eye className="w-5 h-5" strokeWidth={2.5} />
                  )}
                </button>
              </div>
              <p className="text-xs text-brand-gray mt-2">
                برای Gmail از App Password استفاده کنید
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sender Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold/10 via-purple-500/5 to-brand-gold/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">اطلاعات فرستنده</h2>
              <p className="text-xs text-brand-gray mt-0.5">
                نام و ایمیل نمایشی در ایمیل‌های ارسالی
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* From Email */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                ایمیل فرستنده
              </label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray" strokeWidth={2.5} />
                <input
                  type="email"
                  value={formData.smtp_from_email}
                  onChange={(e) =>
                    setFormData({ ...formData, smtp_from_email: e.target.value })
                  }
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                  placeholder="noreply@ayneh.beauty"
                  dir="ltr"
                />
              </div>
            </div>

            {/* From Name */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                نام فرستنده
              </label>
              <input
                type="text"
                value={formData.smtp_from_name}
                onChange={(e) =>
                  setFormData({ ...formData, smtp_from_name: e.target.value })
                }
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                placeholder="آینه بیوتی لانج"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Test Result */}
      {testResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`
            bg-[#111]/50 backdrop-blur-xl border rounded-3xl p-6 flex items-start gap-4
            ${testResult.success 
              ? "border-green-500/30 bg-green-500/5" 
              : "border-red-500/30 bg-red-500/5"
            }
          `}
        >
          {testResult.success ? (
            <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" strokeWidth={2.5} />
          ) : (
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" strokeWidth={2.5} />
          )}
          <div>
            <h3 className={`font-bold mb-1 ${testResult.success ? "text-green-400" : "text-red-400"}`}>
              {testResult.success ? "اتصال موفقیت‌آمیز" : "خطا در اتصال"}
            </h3>
            <p className="text-sm text-brand-gray">{testResult.message}</p>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3"
      >
        <motion.button
          onClick={handleTest}
          disabled={testing}
          whileHover={{ scale: testing ? 1 : 1.02 }}
          whileTap={{ scale: testing ? 1 : 0.98 }}
          className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-2xl px-6 py-3.5 font-bold transition-colors disabled:opacity-50"
        >
          {testing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
              در حال تست...
            </>
          ) : (
            <>
              <Zap className="w-5 h-5" strokeWidth={2.5} />
              تست اتصال
            </>
          )}
        </motion.button>

        <motion.button
          onClick={handleSave}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.02 }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
          className="flex-1 group/btn relative"
        >
          <div className="absolute -inset-1 bg-brand-gold/40 rounded-2xl blur-lg opacity-60 group-hover/btn:opacity-100 transition-opacity" />
          <div className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-brand-gold to-brand-gold/90 text-black rounded-2xl px-8 py-3.5 font-bold shadow-2xl shadow-brand-gold/30 disabled:opacity-50">
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                در حال ذخیره...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" strokeWidth={2.5} />
                ذخیره تنظیمات
              </>
            )}
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
