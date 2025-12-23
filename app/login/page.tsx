"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Phone, Lock, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Login() {
  const [step, setStep] = useState(1); // 1: Phone, 2: OTP
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const router = useRouter();

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.length >= 10) setStep(2);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // شبیه‌سازی لاگین موفق
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center relative overflow-hidden">
      
      {/* پس‌زمینه هنری */}
      <div className="absolute inset-0 z-0">
        <Image src="/images/service-bridal.png" alt="Background" fill className="object-cover opacity-20 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md p-8"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white mb-8 transition-colors">
          <ArrowLeft size={18} /> بازگشت به خانه
        </Link>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 rounded-[2rem] shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black font-serif text-white mb-2">AYNEH</h1>
            <p className="text-gray-400 text-sm font-sans">ورود به باشگاه مشتریان</p>
          </div>

          {step === 1 ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs text-brand-gold uppercase tracking-widest font-bold">شماره موبایل</label>
                <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus-within:border-brand-gold transition-colors">
                  <Phone size={18} className="text-gray-500" />
                  <input 
                    type="tel" 
                    placeholder="0912..." 
                    className="bg-transparent w-full outline-none text-lg font-mono text-left"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    autoFocus
                  />
                </div>
              </div>
              <button className="w-full bg-brand-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors">
                دریافت کد تایید
              </button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="space-y-6">
              <div className="flex items-center gap-2 mb-6">
                <button type="button" onClick={() => setStep(1)} className="p-1 hover:bg-white/10 rounded-full"><ChevronLeft /></button>
                <span className="text-sm text-gray-400">ارسال شده به {phone}</span>
              </div>
              
              <div className="flex justify-between gap-2" dir="ltr">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    maxLength={1}
                    className="w-14 h-14 bg-black/40 border border-white/10 rounded-xl text-center text-2xl font-bold outline-none focus:border-brand-gold transition-colors"
                    value={digit}
                    onChange={(e) => {
                      const newOtp = [...otp];
                      newOtp[idx] = e.target.value;
                      setOtp(newOtp);
                      // فوکس خودکار روی بعدی (ساده)
                      if (e.target.value && e.target.nextElementSibling) {
                        (e.target.nextElementSibling as HTMLInputElement).focus();
                      }
                    }}
                  />
                ))}
              </div>
              
              <button className="w-full bg-brand-gold text-black py-4 rounded-xl font-bold text-lg hover:bg-white transition-colors">
                ورود به حساب
              </button>
            </form>
          )}
        </div>
      </motion.div>

    </main>
  );
}