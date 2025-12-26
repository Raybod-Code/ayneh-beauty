// app/platform/signup/page.tsx
"use client";

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  Building2,
  User,
  Mail,
  Phone,
  MapPin,
  Users,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Shield,
  Zap,
  Loader2,
  AlertCircle,
  Crown,
  TrendingUp,
  Clock,
  Check,
  Star,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef, useMemo, memo } from "react";
import { useRouter } from "next/navigation";
import NoiseTexture from "@/components/ui/NoiseTexture";

// ============================================
// ADVANCED COMPONENTS
// ============================================

// Animated Gradient Mesh Background
const AnimatedGradientMesh = memo(() => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Large morphing blobs */}
      <motion.div
        className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full blur-[80px] opacity-20"
        style={{
          background:
            "radial-gradient(circle, hsl(43, 74%, 66%) 0%, transparent 70%)",
          willChange: "transform",
        }}
        animate={{
          x: [0, 100, 0],
          y: [0, -100, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-0 left-0 w-[700px] h-[700px] rounded-full blur-[70px] opacity-15"
        style={{
          background:
            "radial-gradient(circle, hsl(193, 82%, 66%) 0%, transparent 70%)",
          willChange: "transform",
        }}
        animate={{
          x: [0, -80, 0],
          y: [0, 80, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />

      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[60px] opacity-10"
        style={{
          background:
            "radial-gradient(circle, hsl(158, 64%, 52%) 0%, transparent 70%)",
          willChange: "transform",
        }}
        animate={{
          scale: [1, 1.4, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
});

// Floating Particles with better animation
const FloatingParticles = memo(() => {
  const particles = useMemo(() => {
    return [...Array(30)].map((_, i) => {
      const size = Math.random() * 3 + 1;
      const duration = Math.random() * 15 + 15;
      const delay = Math.random() * 5;

      const left = `${Math.random() * 100}%`;
      const top = `${Math.random() * 100}%`;

      const yDistance = -100 * Math.random();
      const xDistance = 50 * (Math.random() - 0.5);

      return { i, size, duration, delay, left, top, yDistance, xDistance };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.i}
          className="absolute rounded-full bg-brand-gold/40"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, p.yDistance, 0],
            x: [0, p.xDistance, 0],
            opacity: [0, 0.6, 0],
            scale: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});

// Custom Cursor Glow Effect
const CustomCursor = memo(() => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 w-8 h-8 rounded-full z-50 mix-blend-screen"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, hsl(43, 74%, 66%) 0%, transparent 70%)",
        filter: "blur(8px)",
      }}
    />
  );
});

// 3D Tilt Card Component
const TiltCard = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const rotateX = useMotionValue(0);
  const rotateY = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 20 };
  const rotateXSpring = useSpring(rotateX, springConfig);
  const rotateYSpring = useSpring(rotateY, springConfig);

  const rafRef = useRef<number | null>(null);
  const latestRef = useRef({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateXValue = ((y - centerY) / centerY) * -10;
    const rotateYValue = ((x - centerX) / centerX) * 10;

    latestRef.current = { rotateX: rotateXValue, rotateY: rotateYValue };

    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      rotateX.set(latestRef.current.rotateX);
      rotateY.set(latestRef.current.rotateY);
      rafRef.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
      }}
    >
      {children}
    </motion.div>
  );
};

// Premium Input with advanced effects
const PremiumInput = ({
  icon: Icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  disabled = false,
  suffix,
  children,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <label className="flex items-center gap-2 text-sm font-semibold text-white mb-3">
        <motion.div
          animate={{
            scale: isFocused ? 1.2 : 1,
            rotate: isFocused ? 12 : 0,
          }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <Icon className="w-4 h-4 text-brand-gold" />
        </motion.div>
        <span>{label}</span>
      </label>

      <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
        {type === "select" ? (
          <motion.select
            value={value}
            onChange={onChange}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-brand-gold focus:bg-white/10 focus:shadow-[0_0_30px_rgba(236,179,101,0.3)] transition-all duration-300 outline-none text-white appearance-none cursor-pointer"
            style={{
              transform: isFocused ? "translateY(-2px)" : "translateY(0)",
            }}
          >
            {children}
          </motion.select>
        ) : (
          <motion.input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="w-full px-5 py-4 rounded-2xl bg-white/5 border-2 border-white/10 focus:border-brand-gold focus:bg-white/10 focus:shadow-[0_0_30px_rgba(236,179,101,0.3)] transition-all duration-300 outline-none text-white placeholder:text-gray-500"
            style={{
              transform: isFocused ? "translateY(-2px)" : "translateY(0)",
            }}
          />
        )}

        {suffix && (
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-sm text-gray-500">
            {suffix}
          </div>
        )}

        {/* Focus ring glow */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              className="absolute inset-0 rounded-2xl pointer-events-none"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                boxShadow: "0 0 40px rgba(236, 179, 101, 0.4)",
              }}
            />
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

// Magnetic Button
const MagneticButton = ({
  children,
  onClick,
  disabled,
  variant = "primary",
}: any) => {
  const ref = useRef<HTMLButtonElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 300, damping: 20 };
  const xSpring = useSpring(x, springConfig);
  const ySpring = useSpring(y, springConfig);

  const rafRef = useRef<number | null>(null);
  const latestRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!ref.current || disabled) return;

    const rect = ref.current.getBoundingClientRect();
    const rawX = e.clientX - rect.left - rect.width / 2;
    const rawY = e.clientY - rect.top - rect.height / 2;

    latestRef.current = { x: rawX * 0.3, y: rawY * 0.3 };

    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(() => {
      x.set(latestRef.current.x);
      y.set(latestRef.current.y);
      rafRef.current = null;
    });
  };

  const handleMouseLeave = () => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`
        relative overflow-hidden font-bold text-lg flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed
        ${
          variant === "primary"
            ? "flex-1 py-4 bg-gradient-to-r from-brand-gold to-luxury-gold-light text-black rounded-2xl shadow-2xl shadow-brand-gold/30 hover:shadow-brand-gold/50"
            : "px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10"
        }
        transition-all duration-300
      `}
      style={{
        x: xSpring,
        y: ySpring,
      }}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
    >
      {/* Shine effect on hover */}
      <motion.div
        className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
        }}
      />

      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function SignupPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    salonName: "",
    slug: "",
    ownerName: "",
    email: "",
    phone: "",
    city: "",
    staffCount: "",
  });

  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const steps = [
    {
      number: 1,
      title: "اطلاعات سالن",
      description: "نام و آدرس سالن خود را وارد کنید",
      icon: Building2,
    },
    {
      number: 2,
      title: "اطلاعات شخصی",
      description: "نام و ایمیل خود را وارد کنید",
      icon: User,
    },
    {
      number: 3,
      title: "اطلاعات تماس",
      description: "شماره تماس و موقعیت مکانی",
      icon: MapPin,
    },
  ];

  const handleNext = () => {
    // Validation for current step
    if (currentStep === 1 && (!formData.salonName || !formData.slug)) {
      setError("لطفاً همه فیلدها را پر کنید");
      return;
    }
    if (currentStep === 2 && (!formData.ownerName || !formData.email)) {
      setError("لطفاً همه فیلدها را پر کنید");
      return;
    }
    if (
      currentStep === 3 &&
      (!formData.phone || !formData.city || !formData.staffCount)
    ) {
      setError("لطفاً همه فیلدها را پر کنید");
      return;
    }

    setError(null);
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/platform/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "خطا در ثبت نام");
      }

      // Success - redirect to success page
      router.push("/platform/signup/success");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050505] via-[#0a0a0a] to-[#050505] relative overflow-hidden">
      {/* Custom Cursor Glow */}
      <CustomCursor />

      {/* Noise Texture */}
      <NoiseTexture />

      {/* Animated Gradient Mesh */}
      <AnimatedGradientMesh />

      {/* Floating Particles */}
      <FloatingParticles />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-12 lg:py-16">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <Link
            href="/platform"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-brand-gold transition-all duration-300 mb-8 group"
          >
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            <span className="text-sm font-medium">بازگشت به صفحه اصلی</span>
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge with Stars */}
            <motion.div
              className="inline-flex items-center gap-2 px-5 py-2.5 mb-8 rounded-full bg-gradient-to-r from-brand-gold/20 to-luxury-gold-light/20 backdrop-blur-lg border border-brand-gold/30 shadow-lg shadow-brand-gold/10 relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated stars */}
              {[...Array(3)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                    x: [0, (i - 1) * 30],
                    y: [0, -20],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.4,
                  }}
                >
                  <Star className="w-3 h-3 text-brand-gold fill-brand-gold" />
                </motion.div>
              ))}

              <Crown className="w-4 h-4 text-brand-gold relative z-10" />
              <span className="text-sm font-bold bg-gradient-to-r from-brand-gold to-luxury-gold-light bg-clip-text text-transparent relative z-10">
                شروع رایگان ۳۰ روزه
              </span>
              <Sparkles className="w-4 h-4 text-brand-gold animate-pulse relative z-10" />
            </motion.div>

            {/* Main Heading with Advanced Effects */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              سالن خود را{" "}
              <span className="relative inline-block">
                {/* Multi-layer glow */}
                <span className="absolute -inset-2 bg-gradient-to-r from-brand-gold via-luxury-gold-light to-brand-gold blur-3xl opacity-40 animate-pulse"></span>
                <span className="absolute -inset-1 bg-gradient-to-r from-brand-gold to-luxury-gold-light blur-2xl opacity-30"></span>

                {/* Animated gradient text */}
                <motion.span
                  className="relative bg-gradient-to-r from-brand-gold via-luxury-gold-light to-brand-gold bg-clip-text text-transparent"
                  style={{
                    backgroundSize: "200% auto",
                  }}
                  animate={{
                    backgroundPosition: ["0% center", "200% center"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  دیجیتال
                </motion.span>
              </span>{" "}
              کنید
            </h1>

            <p className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              در کمتر از{" "}
              <span className="text-brand-gold font-semibold">۵ دقیقه</span>{" "}
              سالن خود را راه‌اندازی کنید و درآمد خود را{" "}
              <span className="text-luxury-emerald-400 font-semibold">
                ۳ برابر
              </span>{" "}
              کنید
            </p>
          </motion.div>
        </div>

        {/* Progress Steps with Enhanced Animation */}
        <motion.div
          className="max-w-3xl mx-auto mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="relative">
            {/* Progress Bar Background with Glow */}
            <div className="absolute top-5 right-0 left-0 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-brand-gold to-luxury-gold-light relative"
                initial={{ width: "0%" }}
                animate={{
                  width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {/* Animated shimmer */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                  animate={{
                    x: ["-100%", "200%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            </div>

            {/* Steps */}
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const isCompleted = completedSteps.includes(step.number);
                const isCurrent = currentStep === step.number;
                const StepIcon = step.icon;

                return (
                  <motion.div
                    key={step.number}
                    className="flex flex-col items-center gap-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                  >
                    <motion.div
                      className={`
                        relative w-12 h-12 rounded-full flex items-center justify-center
                        ${
                          isCurrent
                            ? "bg-gradient-to-r from-brand-gold to-luxury-gold-light shadow-2xl shadow-brand-gold/60"
                            : ""
                        }
                        ${
                          isCompleted
                            ? "bg-luxury-emerald-500 shadow-lg shadow-luxury-emerald-500/50"
                            : ""
                        }
                        ${
                          !isCurrent && !isCompleted
                            ? "bg-white/10 border-2 border-white/20"
                            : ""
                        }
                        transition-all duration-300
                      `}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      animate={{
                        scale: isCurrent ? [1, 1.1, 1] : 1,
                      }}
                      transition={{
                        scale: {
                          duration: 2,
                          repeat: isCurrent ? Infinity : 0,
                          ease: "easeInOut",
                        },
                      }}
                    >
                      {/* Pulsing ring for current step */}
                      {isCurrent && (
                        <motion.div
                          className="absolute inset-0 rounded-full bg-brand-gold/30"
                          animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.5, 0, 0.5],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        />
                      )}

                      <AnimatePresence mode="wait">
                        {isCompleted ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            <Check className="w-6 h-6 text-white" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="icon"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <StepIcon
                              className={`w-6 h-6 ${
                                isCurrent ? "text-black" : "text-gray-500"
                              }`}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>

                    <div className="text-center hidden sm:block">
                      <p
                        className={`text-sm font-semibold transition-colors ${
                          isCurrent ? "text-white" : "text-gray-500"
                        }`}
                      >
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-600 max-w-[120px] mt-1">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Form with 3D Tilt */}
          <TiltCard className="relative">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl overflow-hidden"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Noise */}
              <NoiseTexture />

              {/* Decorative gradient with animation */}
              <motion.div
                className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-brand-gold/5 to-transparent pointer-events-none"
                animate={{
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Corner accents */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-gold/10 to-transparent rounded-bl-full" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-luxury-sky-500/10 to-transparent rounded-tr-full" />

              <div
                className="relative"
                style={{ transform: "translateZ(50px)" }}
              >
                {/* Error Message with Animation */}
                <AnimatePresence mode="wait">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className="mb-6"
                    >
                      <motion.div
                        className="flex items-center gap-3 p-4 rounded-2xl bg-luxury-rose-500/10 border border-luxury-rose-500/30 text-luxury-rose-400"
                        animate={{
                          boxShadow: [
                            "0 0 0 0 rgba(244, 63, 94, 0.3)",
                            "0 0 0 8px rgba(244, 63, 94, 0)",
                          ],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                        }}
                      >
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">{error}</span>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Form Content with Stagger Animation */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-6"
                  >
                    {/* Step 1: Salon Info */}
                    {currentStep === 1 && (
                      <>
                        <PremiumInput
                          icon={Building2}
                          label="نام سالن"
                          type="text"
                          value={formData.salonName}
                          onChange={(e: any) =>
                            setFormData({
                              ...formData,
                              salonName: e.target.value,
                            })
                          }
                          placeholder="مثلاً: سالن زیبایی رز"
                          disabled={loading}
                        />

                        <div>
                          <PremiumInput
                            icon={Sparkles}
                            label="آدرس اختصاصی (نام انگلیسی)"
                            type="text"
                            value={formData.slug}
                            onChange={(e: any) =>
                              setFormData({
                                ...formData,
                                slug: e.target.value
                                  .toLowerCase()
                                  .replace(/[^a-z0-9-]/g, ""),
                              })
                            }
                            placeholder="rose-salon"
                            disabled={loading}
                            suffix=".ayneh.beauty"
                          />
                          {formData.slug && (
                            <motion.p
                              initial={{ opacity: 0, y: -5 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="mt-3 text-xs text-luxury-emerald-400 flex items-center gap-2 px-3 py-2 rounded-xl bg-luxury-emerald-500/10 border border-luxury-emerald-500/20"
                            >
                              <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 1, repeat: Infinity }}
                              >
                                <CheckCircle2 className="w-4 h-4" />
                              </motion.div>
                              <span>
                                سالن شما در آدرس{" "}
                                <strong>{formData.slug}.ayneh.beauty</strong> در
                                دسترس خواهد بود
                              </span>
                            </motion.p>
                          )}
                        </div>
                      </>
                    )}

                    {/* Step 2: Personal Info */}
                    {currentStep === 2 && (
                      <>
                        <PremiumInput
                          icon={User}
                          label="نام و نام خانوادگی شما"
                          type="text"
                          value={formData.ownerName}
                          onChange={(e: any) =>
                            setFormData({
                              ...formData,
                              ownerName: e.target.value,
                            })
                          }
                          placeholder="مثلاً: سارا احمدی"
                          disabled={loading}
                        />

                        <PremiumInput
                          icon={Mail}
                          label="ایمیل"
                          type="email"
                          value={formData.email}
                          onChange={(e: any) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          placeholder="info@example.com"
                          disabled={loading}
                        />
                      </>
                    )}

                    {/* Step 3: Contact Info */}
                    {currentStep === 3 && (
                      <>
                        <PremiumInput
                          icon={Phone}
                          label="موبایل"
                          type="tel"
                          value={formData.phone}
                          onChange={(e: any) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                          disabled={loading}
                        />

                        <PremiumInput
                          icon={MapPin}
                          label="شهر"
                          type="select"
                          value={formData.city}
                          onChange={(e: any) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          disabled={loading}
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="تهران">تهران</option>
                          <option value="اصفهان">اصفهان</option>
                          <option value="شیراز">شیراز</option>
                          <option value="مشهد">مشهد</option>
                          <option value="تبریز">تبریز</option>
                          <option value="کرج">کرج</option>
                          <option value="اهواز">اهواز</option>
                          <option value="قم">قم</option>
                        </PremiumInput>

                        <PremiumInput
                          icon={Users}
                          label="تعداد پرسنل"
                          type="select"
                          value={formData.staffCount}
                          onChange={(e: any) =>
                            setFormData({
                              ...formData,
                              staffCount: e.target.value,
                            })
                          }
                          disabled={loading}
                        >
                          <option value="">انتخاب کنید</option>
                          <option value="1-3">۱ تا ۳ نفر</option>
                          <option value="4-10">۴ تا ۱۰ نفر</option>
                          <option value="11-30">۱۱ تا ۳۰ نفر</option>
                          <option value="30+">بیش از ۳۰ نفر</option>
                        </PremiumInput>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex items-center gap-3 mt-8">
                  {currentStep > 1 && (
                    <MagneticButton
                      onClick={handleBack}
                      disabled={loading}
                      variant="secondary"
                    >
                      <ArrowRight className="w-4 h-4" />
                      <span>قبلی</span>
                    </MagneticButton>
                  )}

                  <MagneticButton
                    onClick={handleNext}
                    disabled={loading}
                    variant="primary"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>در حال ارسال...</span>
                      </>
                    ) : currentStep === 3 ? (
                      <>
                        <span>تکمیل ثبت نام</span>
                        <CheckCircle2 className="w-5 h-5" />
                      </>
                    ) : (
                      <>
                        <span>بعدی</span>
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                      </>
                    )}
                  </MagneticButton>
                </div>

                <p className="text-center text-xs text-gray-500 mt-6">
                  با ثبت نام، شما{" "}
                  <Link
                    href="#"
                    className="text-brand-gold hover:underline transition-colors"
                  >
                    شرایط و قوانین
                  </Link>{" "}
                  را می‌پذیرید
                </p>
              </div>
            </motion.div>
          </TiltCard>

          {/* Benefits Sidebar with Enhanced Effects */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="space-y-6 lg:sticky lg:top-24"
          >
            <h3 className="font-serif text-2xl font-bold text-white mb-6">
              چرا آینه؟
            </h3>

            {[
              {
                icon: Clock,
                title: "راه‌اندازی سریع",
                description:
                  "سالن خود را در کمتر از ۵ دقیقه راه‌اندازی کنید، بدون نیاز به دانش فنی",
                gradient: "from-luxury-sky-500/10 to-transparent",
                color: "hsl(193, 82%, 66%)",
              },
              {
                icon: Shield,
                title: "امنیت کامل",
                description: "رمزنگاری بانکی، بکاپ خودکار و تأیید دو مرحله‌ای",
                gradient: "from-luxury-emerald-500/10 to-transparent",
                color: "hsl(158, 64%, 52%)",
              },
              {
                icon: TrendingUp,
                title: "افزایش درآمد",
                description: "به طور میانگین ۲۵۰٪ افزایش رزروها در ۳ ماه اول",
                gradient: "from-brand-gold/10 to-transparent",
                color: "hsl(43, 74%, 66%)",
              },
              {
                icon: Users,
                title: "پشتیبانی ۲۴/۷",
                description: "تیم پشتیبانی فارسی‌زبان همیشه در کنار شما",
                gradient: "from-luxury-sky-500/10 to-transparent",
                color: "hsl(193, 82%, 66%)",
              },
            ].map((benefit, i) => (
              <motion.div
                key={i}
                className="relative flex gap-4 p-6 rounded-2xl bg-white/[0.03] backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all overflow-hidden group cursor-pointer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                whileHover={{ x: 6, scale: 1.02 }}
              >
                <NoiseTexture />

                {/* Gradient overlay with hover effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${benefit.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                  style={{
                    background: `radial-gradient(circle at 20% 50%, ${benefit.color}15 0%, transparent 70%)`,
                  }}
                />

                {/* Icon container with advanced effects */}
                <motion.div
                  className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-brand-gold/20 to-transparent flex items-center justify-center flex-shrink-0"
                  whileHover={{
                    scale: 1.15,
                    rotate: 12,
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {/* Glow effect */}
                  <motion.div
                    className="absolute inset-0 rounded-xl blur-xl opacity-0 group-hover:opacity-60 transition-opacity"
                    style={{
                      background: benefit.color,
                    }}
                  />
                  <benefit.icon className="w-7 h-7 text-brand-gold relative z-10" />
                </motion.div>

                <div className="relative flex-1">
                  <h4 className="font-semibold text-white mb-2 group-hover:text-brand-gold transition-colors">
                    {benefit.title}
                  </h4>
                  <p className="text-sm text-gray-400 leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Trust Badge with Enhanced Animation */}
            <motion.div
              className="relative p-6 rounded-2xl bg-gradient-to-br from-brand-gold/10 via-brand-gold/5 to-transparent border border-brand-gold/20 overflow-hidden group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.1 }}
              whileHover={{ scale: 1.03 }}
            >
              <NoiseTexture />

              {/* Animated shine */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />

              <p className="relative text-sm text-gray-400 mb-4">
                به ما اعتماد کرده‌اند:
              </p>
              <div className="relative flex items-center gap-3">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <motion.div
                      key={i}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-gold to-luxury-gold-light border-2 border-[#050505]"
                      initial={{ scale: 0, x: 20 * i }}
                      animate={{ scale: 1, x: 0 }}
                      transition={{
                        delay: 1.2 + i * 0.1,
                        type: "spring",
                        stiffness: 300,
                      }}
                      whileHover={{ scale: 1.1, zIndex: 10 }}
                    />
                  ))}
                </div>
                <motion.span
                  className="text-sm text-white font-semibold"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  ۲,۵۰۰+ سالن فعال
                </motion.span>
              </div>
            </motion.div>

            {/* Stats Cards with Advanced Animation */}
            <motion.div
              className="grid grid-cols-2 gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
            >
              <motion.div
                className="relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-lg border border-white/10 overflow-hidden group hover:border-white/20 transition-all cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <NoiseTexture />

                {/* Glow effect on hover */}
                <motion.div className="absolute inset-0 bg-gradient-to-br from-luxury-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <motion.div
                    animate={{
                      rotate: [0, 5, 0, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Zap className="w-8 h-8 text-luxury-emerald-400 mb-2" />
                  </motion.div>
                  <p className="text-2xl font-bold text-white mb-1">۹۸٪</p>
                  <p className="text-xs text-gray-500">رضایت مشتریان</p>
                </div>
              </motion.div>

              <motion.div
                className="relative p-5 rounded-2xl bg-white/[0.03] backdrop-blur-lg border border-white/10 overflow-hidden group hover:border-white/20 transition-all cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <NoiseTexture />

                {/* Glow effect on hover */}
                <motion.div className="absolute inset-0 bg-gradient-to-br from-brand-gold/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative">
                  <motion.div
                    animate={{
                      y: [0, -5, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <TrendingUp className="w-8 h-8 text-brand-gold mb-2" />
                  </motion.div>
                  <p className="text-2xl font-bold text-white mb-1">۲۵۰٪</p>
                  <p className="text-xs text-gray-500">افزایش درآمد</p>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
