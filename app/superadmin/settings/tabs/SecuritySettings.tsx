"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Lock,
  Key,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Eye,
  Clock,
  Activity,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { updateSecuritySettings } from "../actions";

export default function SecuritySettings() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Session Settings
    session_timeout: 60, // minutes
    max_login_attempts: 5,
    lockout_duration: 30, // minutes
    
    // Password Policy
    min_password_length: 8,
    require_uppercase: true,
    require_lowercase: true,
    require_numbers: true,
    require_special_chars: true,
    password_expiry_days: 90,
    
    // Two-Factor Authentication
    enable_2fa: false,
    force_2fa_for_admins: false,
    
    // Security Features
    enable_ip_whitelist: false,
    allowed_ips: [] as string[],
    enable_audit_log: true,
    log_retention_days: 90,
  });

  const [newIp, setNewIp] = useState("");

  const handleSave = async () => {
    setLoading(true);
    const result = await updateSecuritySettings(formData);
    setLoading(false);

    if (result.success) {
      toast.success("✅ تنظیمات امنیتی ذخیره شد");
    } else {
      toast.error("❌ خطا در ذخیره تنظیمات");
    }
  };

  const addIp = () => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (ipRegex.test(newIp.trim())) {
      setFormData({
        ...formData,
        allowed_ips: [...formData.allowed_ips, newIp.trim()],
      });
      setNewIp("");
    } else {
      toast.error("فرمت IP معتبر نیست");
    }
  };

  const removeIp = (index: number) => {
    setFormData({
      ...formData,
      allowed_ips: formData.allowed_ips.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      {/* Session Security Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-red-500/10 via-orange-500/5 to-red-500/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-400" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">امنیت نشست</h2>
              <p className="text-xs text-brand-gray mt-0.5">
                تنظیمات Session و Login
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Session Timeout */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                زمان انقضای نشست (دقیقه)
              </label>
              <input
                type="number"
                value={formData.session_timeout}
                onChange={(e) =>
                  setFormData({ ...formData, session_timeout: Number(e.target.value) })
                }
                min="5"
                max="1440"
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                dir="ltr"
              />
            </div>

            {/* Max Login Attempts */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                حداکثر تلاش ورود
              </label>
              <input
                type="number"
                value={formData.max_login_attempts}
                onChange={(e) =>
                  setFormData({ ...formData, max_login_attempts: Number(e.target.value) })
                }
                min="3"
                max="10"
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                dir="ltr"
              />
            </div>

            {/* Lockout Duration */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                مدت قفل شدن (دقیقه)
              </label>
              <input
                type="number"
                value={formData.lockout_duration}
                onChange={(e) =>
                  setFormData({ ...formData, lockout_duration: Number(e.target.value) })
                }
                min="5"
                max="180"
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Password Policy Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-brand-gold/10 via-yellow-500/5 to-brand-gold/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">سیاست رمز عبور</h2>
              <p className="text-xs text-brand-gray mt-0.5">
                قوانین انتخاب رمز عبور
              </p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Min Password Length */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                حداقل طول رمز عبور
              </label>
              <input
                type="number"
                value={formData.min_password_length}
                onChange={(e) =>
                  setFormData({ ...formData, min_password_length: Number(e.target.value) })
                }
                min="6"
                max="32"
                className="w-full md:w-48 bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                dir="ltr"
              />
            </div>

            {/* Password Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-center gap-3 cursor-pointer group/check">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.require_uppercase}
                    onChange={(e) =>
                      setFormData({ ...formData, require_uppercase: e.target.checked })
                    }
                    className="peer sr-only"
                  />
                  <div className="w-6 h-6 border-2 border-white/20 rounded-lg peer-checked:border-brand-gold peer-checked:bg-brand-gold transition-all" />
                  <motion.div
                    initial={{ scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100"
                  >
                    <CheckCircle className="w-4 h-4 text-black" strokeWidth={3} />
                  </motion.div>
                </div>
                <span className="text-sm text-white font-medium group-hover/check:text-brand-gold transition-colors">
                  نیاز به حروف بزرگ (A-Z)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group/check">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.require_lowercase}
                    onChange={(e) =>
                      setFormData({ ...formData, require_lowercase: e.target.checked })
                    }
                    className="peer sr-only"
                  />
                  <div className="w-6 h-6 border-2 border-white/20 rounded-lg peer-checked:border-brand-gold peer-checked:bg-brand-gold transition-all" />
                  <motion.div
                    initial={{ scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100"
                  >
                    <CheckCircle className="w-4 h-4 text-black" strokeWidth={3} />
                  </motion.div>
                </div>
                <span className="text-sm text-white font-medium group-hover/check:text-brand-gold transition-colors">
                  نیاز به حروف کوچک (a-z)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group/check">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.require_numbers}
                    onChange={(e) =>
                      setFormData({ ...formData, require_numbers: e.target.checked })
                    }
                    className="peer sr-only"
                  />
                  <div className="w-6 h-6 border-2 border-white/20 rounded-lg peer-checked:border-brand-gold peer-checked:bg-brand-gold transition-all" />
                  <motion.div
                    initial={{ scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100"
                  >
                    <CheckCircle className="w-4 h-4 text-black" strokeWidth={3} />
                  </motion.div>
                </div>
                <span className="text-sm text-white font-medium group-hover/check:text-brand-gold transition-colors">
                  نیاز به اعداد (0-9)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer group/check">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.require_special_chars}
                    onChange={(e) =>
                      setFormData({ ...formData, require_special_chars: e.target.checked })
                    }
                    className="peer sr-only"
                  />
                  <div className="w-6 h-6 border-2 border-white/20 rounded-lg peer-checked:border-brand-gold peer-checked:bg-brand-gold transition-all" />
                  <motion.div
                    initial={{ scale: 0 }}
                    className="absolute inset-0 flex items-center justify-center opacity-0 peer-checked:opacity-100"
                  >
                    <CheckCircle className="w-4 h-4 text-black" strokeWidth={3} />
                  </motion.div>
                </div>
                <span className="text-sm text-white font-medium group-hover/check:text-brand-gold transition-colors">
                  نیاز به کاراکترهای خاص (!@#$)
                </span>
              </label>
            </div>

            {/* Password Expiry */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                انقضای رمز عبور (روز)
              </label>
              <input
                type="number"
                value={formData.password_expiry_days}
                onChange={(e) =>
                  setFormData({ ...formData, password_expiry_days: Number(e.target.value) })
                }
                min="0"
                max="365"
                className="w-full md:w-48 bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all"
                placeholder="0 = بدون انقضا"
                dir="ltr"
              />
              <p className="text-xs text-brand-gray mt-2">
                صفر = بدون انقضا
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Two-Factor Authentication Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/10 via-blue-500/5 to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">احراز هویت دو مرحله‌ای</h2>
              <p className="text-xs text-brand-gray mt-0.5">
                Two-Factor Authentication (2FA)
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 cursor-pointer group/toggle p-4 rounded-2xl hover:bg-white/[0.02] transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.enable_2fa}
                  onChange={(e) =>
                    setFormData({ ...formData, enable_2fa: e.target.checked })
                  }
                  className="peer sr-only"
                />
                <div className="w-12 h-7 bg-white/10 rounded-full peer-checked:bg-brand-gold transition-all" />
                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-[-20px] shadow-lg" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white group-hover/toggle:text-brand-gold transition-colors">
                  فعال‌سازی احراز هویت دو مرحله‌ای
                </div>
                <div className="text-xs text-brand-gray mt-1">
                  کاربران می‌توانند 2FA را برای حساب خود فعال کنند
                </div>
              </div>
            </label>

            <label className="flex items-start gap-4 cursor-pointer group/toggle p-4 rounded-2xl hover:bg-white/[0.02] transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.force_2fa_for_admins}
                  onChange={(e) =>
                    setFormData({ ...formData, force_2fa_for_admins: e.target.checked })
                  }
                  disabled={!formData.enable_2fa}
                  className="peer sr-only disabled:opacity-50"
                />
                <div className="w-12 h-7 bg-white/10 rounded-full peer-checked:bg-red-500 transition-all peer-disabled:opacity-50" />
                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-[-20px] shadow-lg" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white group-hover/toggle:text-brand-gold transition-colors">
                  الزامی برای ادمین‌ها
                </div>
                <div className="text-xs text-brand-gray mt-1">
                  Super Admin و Tenant Admin باید حتماً 2FA فعال داشته باشند
                </div>
              </div>
            </label>
          </div>
        </div>
      </motion.div>

      {/* IP Whitelist Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-green-500/10 via-emerald-500/5 to-green-500/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
              <Lock className="w-5 h-5 text-green-400" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">محدودیت IP</h2>
              <p className="text-xs text-brand-gray mt-0.5">
                لیست سفید IP برای دسترسی به پنل
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Enable IP Whitelist Toggle */}
            <label className="flex items-start gap-4 cursor-pointer group/toggle p-4 rounded-2xl hover:bg-white/[0.02] transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.enable_ip_whitelist}
                  onChange={(e) =>
                    setFormData({ ...formData, enable_ip_whitelist: e.target.checked })
                  }
                  className="peer sr-only"
                />
                <div className="w-12 h-7 bg-white/10 rounded-full peer-checked:bg-green-500 transition-all" />
                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-[-20px] shadow-lg" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white group-hover/toggle:text-brand-gold transition-colors flex items-center gap-2">
                  فعال‌سازی محدودیت IP
                  <AlertTriangle className="w-4 h-4 text-orange-400" strokeWidth={2.5} />
                </div>
                <div className="text-xs text-brand-gray mt-1">
                  فقط IP های مشخص شده می‌توانند به پنل دسترسی داشته باشند
                </div>
              </div>
            </label>

            {/* IP List */}
            {formData.enable_ip_whitelist && (
              <div className="space-y-3 pt-2">
                <label className="block text-sm font-bold text-white">
                  IP های مجاز
                </label>

                <div className="space-y-2">
                  {formData.allowed_ips.map((ip, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5"
                    >
                      <Activity className="w-4 h-4 text-green-400" strokeWidth={2.5} />
                      <span className="flex-1 text-sm text-white font-mono">{ip}</span>
                      <button
                        onClick={() => removeIp(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4" strokeWidth={2.5} />
                      </button>
                    </div>
                  ))}

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newIp}
                      onChange={(e) => setNewIp(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addIp()}
                      className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
                      placeholder="192.168.1.1"
                      dir="ltr"
                    />
                    <button
                      onClick={addIp}
                      className="bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl px-5 py-2.5 text-sm font-bold hover:bg-green-500/20 transition-colors"
                    >
                      افزودن
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Audit Log Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-[#111]/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 overflow-hidden relative group"
      >
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 via-cyan-500/5 to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700" />

        <div className="relative">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">لاگ فعالیت</h2>
              <p className="text-xs text-brand-gray mt-0.5">
                ثبت فعالیت‌های کاربران
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <label className="flex items-start gap-4 cursor-pointer group/toggle p-4 rounded-2xl hover:bg-white/[0.02] transition-colors">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={formData.enable_audit_log}
                  onChange={(e) =>
                    setFormData({ ...formData, enable_audit_log: e.target.checked })
                  }
                  className="peer sr-only"
                />
                <div className="w-12 h-7 bg-white/10 rounded-full peer-checked:bg-blue-500 transition-all" />
                <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-[-20px] shadow-lg" />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-white group-hover/toggle:text-brand-gold transition-colors">
                  ثبت لاگ فعالیت
                </div>
                <div className="text-xs text-brand-gray mt-1">
                  تمام اقدامات کاربران در سیستم ثبت می‌شود
                </div>
              </div>
            </label>

            <div>
              <label className="block text-sm font-bold text-white mb-2">
                مدت نگهداری لاگ (روز)
              </label>
              <input
                type="number"
                value={formData.log_retention_days}
                onChange={(e) =>
                  setFormData({ ...formData, log_retention_days: Number(e.target.value) })
                }
                min="7"
                max="365"
                disabled={!formData.enable_audit_log}
                className="w-full md:w-48 bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:bg-white/[0.04] focus:outline-none transition-all disabled:opacity-50"
                dir="ltr"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
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
                <Shield className="w-5 h-5" strokeWidth={2.5} />
                ذخیره تنظیمات امنیتی
              </>
            )}
          </div>
        </motion.button>
      </motion.div>
    </div>
  );
}
