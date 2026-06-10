"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, CheckCircle, RotateCcw, MoveRight } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { createClient } from "@/lib/supabase/client";
import AynehLogo from "@/components/AynehLogo";

const LoginShader = dynamic(() => import("@/components/LoginShader"), { ssr: false });

type Step = "email" | "sent";

/* ─────────── Input بدون هیچ border/outline کثیف ─────────── */
function CleanInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "15px 18px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.04)",
        borderBottom: "1px solid rgba(198,168,124,0.25)",
      }}
    >
      <Mail
        size={14}
        style={{ color: "rgba(198,168,124,0.5)", flexShrink: 0 }}
      />
      <input
        type="email"
        placeholder="your@email.com"
        dir="ltr"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoFocus
        style={{
          background: "transparent",
          border: "none",
          outline: "none",
          boxShadow: "none",
          WebkitAppearance: "none",
          width: "100%",
          fontSize: 14,
          fontFamily: "'SF Mono', 'Fira Code', 'Courier New', monospace",
          color: "rgba(255,255,255,0.88)",
          letterSpacing: "0.05em",
          caretColor: "#C6A87C",
        }}
      />
    </div>
  );
}

/* ─────────── فرم (مشترک بین desktop و mobile) ─────────── */
function FormContent({
  step,
  email,
  setEmail,
  loading,
  error,
  onSubmit,
  onReset,
}: {
  step: Step;
  email: string;
  setEmail: (v: string) => void;
  loading: boolean;
  error: string;
  onSubmit: (e: React.FormEvent) => void;
  onReset: () => void;
}) {
  const valid = email.includes("@") && email.includes(".");

  return (
    <AnimatePresence mode="wait">
      {step === "email" ? (
        <motion.div
          key="email"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -14 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
        >
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            style={{ marginBottom: 32 }}
          >
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                fontSize: 10,
                letterSpacing: "0.38em",
                textTransform: "uppercase",
                color: "rgba(198,168,124,0.6)",
                padding: "5px 13px",
                borderRadius: 999,
                border: "1px solid rgba(198,168,124,0.15)",
              }}
            >
              <span
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: "50%",
                  background: "#C6A87C",
                }}
              />
              Members Only
            </span>
          </motion.div>

          {/* عنوان */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.13 }}
            style={{ marginBottom: 32 }}
          >
            <h1
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.75rem, 4vw, 2.4rem)",
                fontWeight: 700,
                color: "#ffffff",
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                marginBottom: 12,
              }}
            >
              آماده‌ای؟
            </h1>
            <p
              style={{
                fontSize: "clamp(13px, 1.4vw, 14px)",
                color: "rgba(255,255,255,0.32)",
                lineHeight: 1.9,
              }}
            >
              یک ایمیل — یک کلیک — داخلی.
              <br />
              بدون رمز، بدون دردسر.
            </p>
          </motion.div>

          {/* کارت فرم */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 18,
              padding: "24px",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: 10,
                    letterSpacing: "0.3em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.18)",
                    marginBottom: 10,
                  }}
                >
                  آدرس ایمیل
                </label>
                <CleanInput value={email} onChange={setEmail} />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      fontSize: 12,
                      color: "rgba(248,113,113,0.7)",
                      textAlign: "center",
                      paddingTop: 4,
                    }}
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button
                type="submit"
                disabled={loading || !valid}
                whileTap={valid ? { scale: 0.97 } : {}}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 12,
                  fontWeight: 600,
                  fontSize: "clamp(13px, 1.4vw, 14px)",
                  letterSpacing: "0.06em",
                  border: "none",
                  cursor: valid ? "pointer" : "not-allowed",
                  background: valid
                    ? "linear-gradient(135deg, #C6A87C 0%, #E2C99A 50%, #B8955E 100%)"
                    : "rgba(255,255,255,0.05)",
                  color: valid ? "#0a0806" : "rgba(255,255,255,0.18)",
                  transition: "all 0.35s cubic-bezier(0.33,1,0.68,1)",
                  boxShadow: valid
                    ? "0 6px 24px rgba(198,168,124,0.25)"
                    : "none",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                {loading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    ورود به کلاب
                    <MoveRight size={14} />
                  </>
                )}
              </motion.button>
            </form>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginTop: 20,
                paddingTop: 18,
                borderTop: "1px solid rgba(255,255,255,0.04)",
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.04)",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.12)",
                  whiteSpace: "nowrap",
                }}
              >
                No Password · Instant Access
              </span>
              <div
                style={{
                  flex: 1,
                  height: 1,
                  background: "rgba(255,255,255,0.04)",
                }}
              />
            </div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38 }}
            style={{
              marginTop: 18,
              fontSize: 11,
              color: "rgba(255,255,255,0.12)",
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            با ادامه،{" "}
            <span style={{ color: "rgba(198,168,124,0.35)" }}>
              قوانین آینه
            </span>{" "}
            رو می‌پذیری
          </motion.p>
        </motion.div>
      ) : (
        /* ─── state: sent ─── */
        <motion.div
          key="sent"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 18,
            padding: "36px 28px",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            textAlign: "center",
          }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: 0.1,
              type: "spring",
              stiffness: 240,
              damping: 17,
            }}
            style={{
              width: 64,
              height: 64,
              borderRadius: "50%",
              background: "rgba(198,168,124,0.06)",
              border: "1px solid rgba(198,168,124,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 24px",
              boxShadow: "0 0 28px rgba(198,168,124,0.1)",
            }}
          >
            <CheckCircle size={28} style={{ color: "#C6A87C" }} strokeWidth={1.5} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.42em",
                textTransform: "uppercase",
                color: "rgba(198,168,124,0.55)",
                marginBottom: 10,
              }}
            >
              Sent
            </p>
            <h2
              style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "clamp(1.5rem, 3vw, 1.9rem)",
                fontWeight: 700,
                color: "white",
                letterSpacing: "-0.02em",
                marginBottom: 14,
              }}
            >
              چک کن.
            </h2>
            <p
              style={{
                fontSize: 13,
                color: "rgba(255,255,255,0.3)",
                lineHeight: 2,
              }}
            >
              لینک ورود رفت به{" "}
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "rgba(255,255,255,0.6)",
                  background: "rgba(255,255,255,0.05)",
                  padding: "2px 8px",
                  borderRadius: 5,
                }}
              >
                {email}
              </span>
              <br />
              اگه نیومد، اسپم رو نگاه کن.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            style={{
              marginTop: 28,
              paddingTop: 20,
              borderTop: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <button
              onClick={onReset}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                margin: "0 auto",
                fontSize: 11,
                color: "rgba(255,255,255,0.2)",
                background: "none",
                border: "none",
                cursor: "pointer",
                transition: "color 0.25s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(255,255,255,0.2)")
              }
            >
              <RotateCcw size={11} />
              ایمیل اشتباهه؟ عوضش کن
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─────────── صفحه اصلی ─────────── */
export default function Login() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const valid = email.includes("@") && email.includes(".");
    if (!valid) return;
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (authError) throw authError;
      setStep("sent");
    } catch {
      setError("مشکلی پیش اومد. دوباره امتحان کن.");
    } finally {
      setLoading(false);
    }
  };

  const sharedProps = {
    step,
    email,
    setEmail,
    loading,
    error,
    onSubmit: handleSubmit,
    onReset: () => { setStep("email"); setError(""); },
  };

  return (
    <>
      {/* فونت Playfair */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&display=swap"
      />

      <main
        style={{
          background: "#050505",
          minHeight: "100vh",
          overflow: "hidden",
          fontFamily: "'Vazirmatn', 'Tahoma', sans-serif",
        }}
      >
        {/* ══════ DESKTOP ══════ */}
        <div
          style={{
            display: "none",
          }}
          className="lg:flex min-h-screen"
        >
          {/* ستون چپ — Shader */}
          <div style={{ position: "relative", flex: 1, minWidth: 0 }}>
            <LoginShader />

            {/* فید سمت راست */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                background:
                  "linear-gradient(to right, transparent 50%, #050505 100%)",
              }}
            />
            {/* فید پایین */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                background:
                  "linear-gradient(to top, #050505 0%, transparent 38%)",
              }}
            />

            {/* محتوای روی shader */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 20,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: "clamp(40px, 5vw, 64px)",
              }}
            >
              {/* لوگو */}
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  textDecoration: "none",
                  width: "fit-content",
                }}
              >
                <div
                  style={{
                    filter: "drop-shadow(0 0 14px rgba(198,168,124,0.35))",
                    transition: "transform 0.3s ease",
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.transform =
                      "scale(1.06)")
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.transform =
                      "scale(1)")
                  }
                >
                  <AynehLogo size={42} />
                </div>
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 900,
                    fontSize: "clamp(16px, 1.6vw, 20px)",
                    letterSpacing: "0.32em",
                    color: "white",
                    textDecoration: "none",
                  }}
                >
                  AYNEH
                </span>
              </Link>

              {/* متن پایین shader — هدفمند، انسانی */}
              <div style={{ maxWidth: 320 }}>
                <div
                  style={{
                    width: 28,
                    height: 1,
                    background:
                      "linear-gradient(90deg, #C6A87C, transparent)",
                    marginBottom: 20,
                  }}
                />
                <p
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontSize: "clamp(1.4rem, 2vw, 1.85rem)",
                    fontWeight: 700,
                    lineHeight: 1.35,
                    color: "white",
                    marginBottom: 14,
                  }}
                >
                  هر بار که می‌آی،
                  <br />
                  <span style={{ color: "#C6A87C" }}>می‌دانیم که کیستی.</span>
                </p>
                <p
                  style={{
                    fontSize: "clamp(12px, 1.1vw, 13px)",
                    color: "rgba(255,255,255,0.3)",
                    lineHeight: 2,
                    letterSpacing: "0.01em",
                  }}
                >
                  تجربه‌ای که دقیقاً برای تو
                  <br />
                  طراحی شده — نه برای همه.
                </p>

                <div
                  style={{
                    display: "flex",
                    gap: 20,
                    marginTop: 22,
                  }}
                >
                  {["Luxury", "Personal", "Exclusive"].map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontSize: 9,
                        letterSpacing: "0.32em",
                        textTransform: "uppercase",
                        color: "rgba(198,168,124,0.38)",
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ستون راست — فرم */}
          <div
            style={{
              width: "min(500px, 40vw)",
              flexShrink: 0,
              background: "#050505",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "clamp(40px, 5vw, 72px) clamp(32px, 4vw, 60px)",
              position: "relative",
            }}
          >
            {/* خط جداکننده */}
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "12%",
                bottom: "12%",
                width: 1,
                background:
                  "linear-gradient(to bottom, transparent, rgba(198,168,124,0.12), transparent)",
              }}
            />

            {/* دکمه بازگشت */}
            <Link
              href="/"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.18)",
                textDecoration: "none",
                marginBottom: 52,
                transition: "color 0.25s",
                width: "fit-content",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.5)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.18)")
              }
            >
              ← بازگشت
            </Link>

            <FormContent {...sharedProps} />

            <p
              style={{
                marginTop: "auto",
                paddingTop: 52,
                fontSize: 10,
                color: "rgba(255,255,255,0.08)",
                letterSpacing: "0.1em",
              }}
            >
              © {new Date().getFullYear()} Ayneh Beauty Lounge
            </p>
          </div>
        </div>

        {/* ══════ MOBILE ══════ */}
        <div
          className="lg:hidden"
          style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <LoginShader />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(5,5,5,0.5) 0%, rgba(5,5,5,0.82) 45%, #050505 100%)",
            }}
          />

          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              minHeight: "100vh",
            }}
          >
            {/* هدر موبایل */}
            <header
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "28px 24px 16px",
              }}
            >
              <Link
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  textDecoration: "none",
                }}
              >
                <AynehLogo size={34} />
                <span
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontWeight: 900,
                    fontSize: 16,
                    letterSpacing: "0.28em",
                    color: "white",
                  }}
                >
                  AYNEH
                </span>
              </Link>
              <Link
                href="/"
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                  letterSpacing: "0.15em",
                  textDecoration: "none",
                }}
              >
                بازگشت ↩
              </Link>
            </header>

            {/* فرم */}
            <div
              style={{
                flex: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
              }}
            >
              <div style={{ width: "100%", maxWidth: 380 }}>
                <FormContent {...sharedProps} />
              </div>
            </div>

            {/* فوتر موبایل */}
            <footer
              style={{
                padding: "20px 24px 36px",
                textAlign: "center",
              }}
            >
              <p
                style={{
                  fontSize: 12,
                  color: "rgba(255,255,255,0.18)",
                  fontStyle: "italic",
                  letterSpacing: "0.02em",
                }}
              >
                «هر بار که می‌آی، می‌دانیم که کیستی.»
              </p>
            </footer>
          </div>
        </div>
      </main>
    </>
  );
}