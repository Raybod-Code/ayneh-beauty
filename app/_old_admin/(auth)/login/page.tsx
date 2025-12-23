"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import MagneticButton from "@/components/ui/MagneticButton";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = useMemo(() => createClient(), []);

  const nextPath = searchParams.get("next");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState<"login" | "reset" | null>(null);
  const [focusField, setFocusField] = useState<"email" | "password" | null>(null);

const signIn = async () => {
  if (!email.trim() || !password) {
    toast("لطفاً ایمیل و رمز عبور را وارد فرمایید.");
    return;
  }

  setLoading("login");
  const { error: authError } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (authError) {
    setLoading(null);
    toast("ورود انجام نشد. لطفاً اطلاعات را بررسی کنید.");
    return;
  }

  // بعد از لاگین موفق، نقش را بخوان
  const { data: userData } = await supabase.auth.getUser();
  const userId = userData?.user?.id;

  console.log("🔐 User ID:", userId);

  let targetPath = nextPath || null;

  if (userId && !targetPath) {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("user_id", userId)
      .single();

    console.log("👤 Profile data:", profile);
    console.log("❌ Profile error:", profileError);

    if (profile?.role === "super_admin") {
      targetPath = "/superadmin/dashboard";
      console.log("✅ Super admin detected, going to:", targetPath);
    } else {
      targetPath = "/";
      console.log("⚠️ Not super admin, role is:", profile?.role);
      toast("لطفاً از طریق دامنه سالن خود وارد شوید.");
    }
  } else if (nextPath) {
    console.log("🔗 Next path exists:", nextPath);
  }

  setLoading(null);

  console.log("🎯 Final target:", targetPath);
  
  if (targetPath) {
    toast("خوش آمدید. در حال انتقال به پنل…");
    router.replace(targetPath);
  } else {
    toast("خوش آمدید.");
    router.replace("/");
  }
};


  const resetPassword = async () => {
    if (!email.trim()) {
      toast("لطفاً ابتدا ایمیل خود را وارد فرمایید.");
      return;
    }

    setLoading("reset");
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/login${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`,
    });
    setLoading(null);

    if (error) {
      toast("ارسال لینک بازیابی ناموفق بود. لطفاً دوباره تلاش کنید.");
      return;
    }

    toast("لینک بازیابی رمز عبور ارسال شد. لطفاً صندوق ورودی و پوشه Spam را بررسی کنید.");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#060607] text-white" dir="rtl">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(900px 520px at 70% 12%, rgba(198,168,124,0.22), transparent 58%)," +
              "radial-gradient(820px 560px at 18% 78%, rgba(120,200,255,0.10), transparent 62%)," +
              "radial-gradient(760px 520px at 90% 78%, rgba(255,255,255,0.08), transparent 60%)," +
              "radial-gradient(720px 520px at 55% 45%, rgba(185,110,255,0.07), transparent 62%)," +
              "linear-gradient(180deg, rgba(8,8,8,1), rgba(4,4,4,1))",
          }}
        />

        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1, x: [0, -18, 0], y: [0, 10, 0] }}
          transition={{
            opacity: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
            x: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 12, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -top-44 -right-44 h-[660px] w-[660px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle at 30% 30%, rgba(198,168,124,0.36), rgba(198,168,124,0) 60%)",
          }}
        />

        <motion.div
          aria-hidden
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1, x: [0, 22, 0], y: [0, -12, 0] }}
          transition={{
            opacity: { duration: 1.0, delay: 0.05, ease: [0.22, 1, 0.36, 1] },
            scale: { duration: 1.0, delay: 0.05, ease: [0.22, 1, 0.36, 1] },
            x: { duration: 11, repeat: Infinity, ease: "easeInOut" },
            y: { duration: 13, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -bottom-72 -left-72 h-[820px] w-[820px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle at 60% 40%, rgba(255,255,255,0.12), rgba(255,255,255,0) 62%)",
          }}
        />

        <motion.div
          aria-hidden
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, x: [0, -14, 0] }}
          transition={{
            opacity: { duration: 0.9, delay: 0.08, ease: [0.22, 1, 0.36, 1] },
            x: { duration: 16, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute top-20 left-10 h-[420px] w-[420px] rounded-full blur-3xl"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(120,200,255,0.12), rgba(120,200,255,0) 62%)",
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.06] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.45'/%3E%3C/svg%3E\")",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(65% 55% at 50% 40%, rgba(0,0,0,0), rgba(0,0,0,0.65) 80%)",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-5">
        <motion.div
          initial={{ opacity: 0, y: 18, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md rounded-[28px] border border-white/10 bg-white/[0.05] backdrop-blur-2xl shadow-[0_30px_120px_rgba(0,0,0,0.65)] overflow-hidden"
        >
          <div
            className="h-[1px] w-full"
            style={{
              background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.28), rgba(255,255,255,0))",
              opacity: 0.5,
            }}
          />

          <div className="p-6 md:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] text-gray-400">AYNEH Admin</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight">ورود به پنل مدیریت</h1>
                <p className="mt-2 text-xs text-gray-400 leading-relaxed">
                  لطفاً با حساب کاربری مجاز وارد شوید؛ دسترسی‌ها بر اساس نقش شما تنظیم می‌شود.
                </p>
              </div>

              <div className="h-11 w-11 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Lock size={18} className="text-brand-gold" />
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="text-xs text-gray-300">ایمیل</label>
                <motion.div
                  className="relative mt-2 rounded-2xl"
                  animate={
                    focusField === "email"
                      ? { boxShadow: "0 0 0 2px rgba(198,168,124,0.18), 0 16px 60px rgba(0,0,0,0.35)" }
                      : { boxShadow: "0 0 0 0 rgba(0,0,0,0)" }
                  }
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <Mail size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  <input
                    className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 pr-11 outline-none focus:border-brand-gold/60 transition"
                    placeholder="admin@ayneh.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusField("email")}
                    onBlur={() => setFocusField(null)}
                    autoComplete="email"
                    inputMode="email"
                  />
                </motion.div>
              </div>

              <div>
                <label className="text-xs text-gray-300">رمز عبور</label>
                <motion.div
                  className="relative mt-2 rounded-2xl"
                  animate={
                    focusField === "password"
                      ? { boxShadow: "0 0 0 2px rgba(198,168,124,0.18), 0 16px 60px rgba(0,0,0,0.35)" }
                      : { boxShadow: "0 0 0 0 rgba(0,0,0,0)" }
                  }
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <input
                    className="w-full rounded-2xl bg-black/40 border border-white/10 px-4 py-3 pl-12 outline-none focus:border-brand-gold/60 transition"
                    placeholder="••••••••"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusField("password")}
                    onBlur={() => setFocusField(null)}
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass((p) => !p)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition"
                    title={showPass ? "مخفی کردن رمز" : "نمایش رمز"}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </motion.div>
              </div>

              <MagneticButton
                onClick={signIn}
                disabled={loading === "login"}
                className="w-full rounded-2xl py-3 font-bold text-sm bg-brand-gold text-black hover:brightness-110 active:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {loading === "login" ? <Loader2 className="mx-auto animate-spin" size={18} /> : "ورود"}
              </MagneticButton>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={resetPassword}
                  disabled={loading === "reset"}
                  className="text-xs text-gray-300 hover:text-white transition disabled:opacity-60"
                >
                  {loading === "reset" ? "در حال ارسال لینک…" : "بازیابی رمز عبور"}
                </button>

                <span className="text-[11px] text-gray-500">v1 • Secure</span>
              </div>
            </div>
          </div>

          <div className="h-10 bg-gradient-to-t from-black/30 to-transparent" />
        </motion.div>
      </div>
    </div>
  );
}
