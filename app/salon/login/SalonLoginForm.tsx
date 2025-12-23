"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Store, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SalonLoginForm() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      toast.success("خوش آمدید!");
      window.location.href = "/salon/dashboard";
      setLoading(false);
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md"
    >
      <div className="bg-[#111] border border-white/10 rounded-3xl p-8">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0 bg-brand-gold rounded-2xl blur-xl"
            />
            <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-gold to-yellow-600 flex items-center justify-center">
              <Store className="w-8 h-8 text-white" strokeWidth={2.5} />
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white mb-2">پنل مدیریت سالن</h1>
          <p className="text-brand-gray">ورود به حساب کاربری</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-white mb-2">
              ایمیل
            </label>
            <div className="relative">
              <Mail
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray"
                strokeWidth={2.5}
              />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-12 pl-4 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
                placeholder="salon@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-white mb-2">
              رمز عبور
            </label>
            <div className="relative">
              <Lock
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-brand-gray"
                strokeWidth={2.5}
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl pr-12 pl-12 py-3 text-white placeholder:text-brand-gray/50 focus:border-brand-gold/50 focus:outline-none transition-all"
                placeholder="••••••••"
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
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-gold to-brand-gold/90 text-black rounded-2xl px-6 py-3 font-bold shadow-lg shadow-brand-gold/30 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                در حال ورود...
              </>
            ) : (
              <>
                <Store className="w-5 h-5" strokeWidth={2.5} />
                ورود به پنل
              </>
            )}
          </motion.button>
        </form>
      </div>
    </motion.div>
  );
}
