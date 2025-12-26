// app/platform/signup/success/page.tsx
"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Calendar,
  Users,
  Zap,
  Crown,
  Star,
  Gift,
  Rocket
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import NoiseTexture from "@/components/ui/NoiseTexture";

// Confetti Component
const Confetti = () => {
  const confettiCount = 50;
  const colors = [
    "hsl(43, 74%, 66%)",   // gold
    "hsl(193, 82%, 66%)",  // sky
    "hsl(158, 64%, 52%)",  // emerald
    "hsl(280, 80%, 70%)",  // purple
    "hsl(350, 80%, 60%)",  // rose
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {[...Array(confettiCount)].map((_, i) => {
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = Math.random() * 10 + 5;
        const leftPosition = Math.random() * 100;
        const delay = Math.random() * 0.5;
        const duration = Math.random() * 3 + 2;
        const rotation = Math.random() * 360;

        return (
          <motion.div
            key={i}
            className="absolute"
            style={{
              left: `${leftPosition}%`,
              top: -20,
              width: size,
              height: size,
              backgroundColor: color,
              borderRadius: Math.random() > 0.5 ? "50%" : "0%",
            }}
            initial={{ y: -20, opacity: 1, rotate: 0 }}
            animate={{
              y: window.innerHeight + 50,
              rotate: rotation * 3,
              opacity: [1, 1, 0],
            }}
            transition={{
              duration,
              delay,
              ease: "easeIn",
            }}
          />
        );
      })}
    </div>
  );
};

// Celebration Particles
const CelebrationParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(20)].map((_, i) => {
        const angle = (360 / 20) * i;
        const distance = 200;
        
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2"
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0,
              opacity: 1 
            }}
            animate={{
              x: Math.cos(angle * Math.PI / 180) * distance,
              y: Math.sin(angle * Math.PI / 180) * distance,
              scale: [0, 1, 0],
              opacity: [1, 1, 0],
            }}
            transition={{
              duration: 1.5,
              delay: i * 0.05,
              ease: "easeOut",
            }}
          >
            <Star className="w-6 h-6 text-brand-gold fill-brand-gold" />
          </motion.div>
        );
      })}
    </div>
  );
};

// Circular Progress
const CircularProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    return () => clearInterval(interval);
  }, []);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90">
        ircle
          cx="64"
          cy="64"
          r="45"
          stroke="currentColor"
          strokeWidth="8"
          fill="none"
          className="text-white/10"
        />
        <motion.circle
          cx="64"
          cy="64"
          r="45"
          stroke="url(#gradient)"
          strokeWidth="8"
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          style={{
            strokeDasharray: circumference,
          }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(43, 74%, 66%)" />
            <stop offset="100%" stopColor="hsl(158, 64%, 52%)" />
          </linearGradient>
        </defs>
      </svg>
      
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ 
          delay: 0.5,
          type: "spring",
          stiffness: 200
        }}
      >
        <CheckCircle2 className="w-16 h-16 text-luxury-emerald-400" />
      </motion.div>
    </div>
  );
};

export default function SuccessPage() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 3 seconds
    const confettiTimer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          router.push('/salon/dashboard'); // Redirect to salon dashboard
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearTimeout(confettiTimer);
      clearInterval(countdownInterval);
    };
  }, [router]);

  const nextSteps = [
    {
      icon: Users,
      title: "افزودن پرسنل",
      description: "تیم خود را به سیستم اضافه کنید",
      color: "hsl(193, 82%, 66%)"
    },
    {
      icon: Calendar,
      title: "تنظیم ساعات کاری",
      description: "ساعات کار سالن را مشخص کنید",
      color: "hsl(43, 74%, 66%)"
    },
    {
      icon: Zap,
      title: "سرویس‌ها و قیمت‌ها",
      description: "خدمات و قیمت‌گذاری را تعریف کنید",
      color: "hsl(158, 64%, 52%)"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505] relative overflow-hidden flex items-center justify-center">
      
      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && <Confetti />}
      </AnimatePresence>
      
      {/* Noise Texture */}
      <NoiseTexture />
      
      {/* Background Glow */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-emerald-500/20 rounded-full blur-[150px]"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-gold/20 rounded-full blur-[120px]"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>
      
      <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 py-12">
        
        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative bg-white/[0.02] backdrop-blur-3xl border border-white/10 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden"
        >
          <NoiseTexture />
          
          {/* Celebration Particles */}
          <CelebrationParticles />
          
          {/* Success Icon with Circular Progress */}
          <div className="flex justify-center mb-8">
            <CircularProgress />
          </div>
          
          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-luxury-emerald-500/10 border border-luxury-emerald-500/30"
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(52, 211, 153, 0.4)",
                  "0 0 0 10px rgba(52, 211, 153, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <CheckCircle2 className="w-5 h-5 text-luxury-emerald-400" />
              <span className="text-sm font-semibold text-luxury-emerald-400">
                ثبت نام موفقیت‌آمیز
              </span>
            </motion.div>
            
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
              🎉 تبریک می‌گوییم!
            </h1>
            
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              سالن شما با موفقیت ایجاد شد و آماده استفاده است
            </p>
          </motion.div>
          
          {/* Gift Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
            className="flex justify-center mb-10"
          >
            <div className="relative px-6 py-3 rounded-full bg-gradient-to-r from-brand-gold/20 to-luxury-gold-light/20 border border-brand-gold/30">
              <div className="flex items-center gap-3">
                <Gift className="w-5 h-5 text-brand-gold" />
                <span className="text-sm font-bold text-white">
                  ۳۰ روز استفاده رایگان فعال شد
                </span>
                <Crown className="w-5 h-5 text-brand-gold" />
              </div>
            </div>
          </motion.div>
          
          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <h3 className="text-xl font-bold text-white text-center mb-6">
              قدم‌های بعدی
            </h3>
            
            <div className="grid sm:grid-cols-3 gap-4">
              {nextSteps.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1 }}
                  className="relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/10 hover:border-white/20 transition-all overflow-hidden group cursor-pointer"
                  whileHover={{ y: -5, scale: 1.02 }}
                >
                  <NoiseTexture />
                  
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${step.color}15 0%, transparent 70%)`,
                    }}
                  />
                  
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale
-110 transition-transform">
                      <step.icon className="w-6 h-6 text-white" />
                    </div>
                    <h4 className="font-semibold text-white mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/salon/dashboard" className="flex-1 w-full sm:w-auto">
              <motion.button
                className="w-full px-8 py-4 bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black rounded-2xl font-bold text-lg shadow-2xl shadow-brand-gold/30 hover:shadow-brand-gold/50 transition-all flex items-center justify-center gap-3 group"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span>شروع کنید</span>
                <Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            
            <motion.div
              className="text-center text-sm text-gray-400"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <p>انتقال خودکار در <span className="text-brand-gold font-bold">{countdown}</span> ثانیه...</p>
            </motion.div>
          </motion.div>
          
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-brand-gold/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-luxury-emerald-500/10 to-transparent rounded-full blur-3xl" />
        </motion.div>
        
        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-gray-500">
            نیاز به کمک دارید؟{" "}
            <Link href="#" className="text-brand-gold hover:underline">
              پشتیبانی ۲۴/۷ ما
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
