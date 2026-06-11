"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Loader2, CheckCircle, RotateCcw, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import AynehLogo from "@/components/AynehLogo";

/* ══ SHADER — native WebGL, یه instance، position:fixed ══ */
function AynehShader() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false });
    if (!gl) return;

    const vert = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() { v_uv = a_pos*0.5+0.5; gl_Position = vec4(a_pos,0.0,1.0); }
    `;
    const frag = `
      precision mediump float;
      uniform float u_time; uniform vec2 u_res; varying vec2 v_uv;
      float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);
        return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
      float fbm(vec2 p){float v=0.0,a=0.5;mat2 r=mat2(0.8,0.6,-0.6,0.8);
        for(int i=0;i<6;i++){v+=a*noise(p);p=r*p*2.1;a*=0.48;}return v;}
      void main(){
        float t=u_time*0.07; vec2 uv=v_uv;
        vec2 q=vec2(fbm(uv+t*0.5),fbm(uv+vec2(5.2,1.3)));
        vec2 r=vec2(fbm(uv+4.0*q+vec2(1.7,9.2)+t*0.13),fbm(uv+4.0*q+vec2(8.3,2.8)+t*0.11));
        float f=fbm(uv+4.0*r);
        vec3 col=mix(vec3(0.02,0.015,0.01),vec3(0.28,0.18,0.07),clamp(f*f*4.5,0.0,1.0));
        col=mix(col,vec3(0.48,0.32,0.12),clamp(length(r)*0.75,0.0,1.0));
        col=mix(col,vec3(0.72,0.54,0.26),clamp(f*f*f*2.8,0.0,1.0));
        vec2 vc=uv*2.0-1.0; float vig=1.0-dot(vc*0.65,vc*0.65);
        col*=clamp(vig*1.15,0.0,1.0)*0.82;
        gl_FragColor=vec4(col,1.0);
      }
    `;

    function compile(type: number, src: string) {
      const s = gl!.createShader(type)!;
      gl!.shaderSource(s, src); gl!.compileShader(s); return s;
    }
    const prog = gl.createProgram()!;
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
    gl.linkProgram(prog); gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes  = gl.getUniformLocation(prog, "u_res");
    const start = performance.now();

    let w = 0, h = 0;
    function resize() {
      const dpr = Math.min(devicePixelRatio, 1.5);
      w = Math.floor(canvas!.clientWidth * dpr);
      h = Math.floor(canvas!.clientHeight * dpr);
      canvas!.width = w; canvas!.height = h;
      gl!.viewport(0, 0, w, h);
    }
    const ro = new ResizeObserver(resize);
    ro.observe(canvas); resize();

    function draw() {
      gl!.uniform1f(uTime, (performance.now() - start) / 1000);
      gl!.uniform2f(uRes, w, h);
      gl!.drawArrays(gl!.TRIANGLE_STRIP, 0, 4);
      rafRef.current = requestAnimationFrame(draw);
    }
    draw();

    return () => { cancelAnimationFrame(rafRef.current); ro.disconnect(); };
  }, []);

  return (
    <canvas ref={canvasRef}
      style={{ position: "fixed", inset: 0, width: "100%", height: "100%", zIndex: 0, display: "block" }} />
  );
}

/* ══ INPUT ══ */
function EmailInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "14px 18px", borderRadius: 14,
      background: focused ? "rgba(198,168,124,0.04)" : "rgba(255,255,255,0.03)",
      border: `1px solid ${focused ? "rgba(198,168,124,0.4)" : "rgba(255,255,255,0.08)"}`,
      transition: "all 0.3s cubic-bezier(0.33,1,0.68,1)",
      boxShadow: focused ? "0 0 0 3px rgba(198,168,124,0.06)" : "none",
    }}>
      <Mail size={14} style={{ color: focused ? "rgba(198,168,124,0.8)" : "rgba(255,255,255,0.2)", flexShrink: 0, transition: "color 0.3s" }} />
      <input type="email" dir="ltr" placeholder="your@email.com"
        value={value} onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        autoFocus autoComplete="email"
        style={{
          background: "transparent", border: "none", outline: "none", boxShadow: "none",
          width: "100%", fontSize: 14, fontFamily: "'SF Mono','Fira Code','Courier New',monospace",
          color: "rgba(255,255,255,0.9)", letterSpacing: "0.04em", caretColor: "#C6A87C",
        }}
      />
    </div>
  );
}

/* ══ FORM PANEL ══ */
function FormPanel({ step, email, setEmail, loading, error, onSubmit, onReset }: {
  step: "email" | "sent"; email: string; setEmail: (v: string) => void;
  loading: boolean; error: string; onSubmit: (e: React.FormEvent) => void; onReset: () => void;
}) {
  const valid = email.includes("@") && email.includes(".");

  return (
    <AnimatePresence mode="wait">
      {step === "email" ? (
        <motion.div key="email-step"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16, scale: 0.98 }}
          transition={{ duration: 0.42, ease: [0.33,1,0.68,1] }}>

          <motion.span initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }}
            transition={{ delay:0.06 }} style={{
              display:"inline-flex", alignItems:"center", gap:8,
              fontSize:9, letterSpacing:"0.42em", textTransform:"uppercase",
              color:"rgba(198,168,124,0.55)", padding:"5px 13px", borderRadius:999,
              border:"1px solid rgba(198,168,124,0.14)", background:"rgba(198,168,124,0.03)",
              marginBottom:28, userSelect:"none",
            }}>
            <span style={{ width:4, height:4, borderRadius:"50%", background:"#C6A87C", boxShadow:"0 0 6px #C6A87C80" }} />
            Members Only
          </motion.span>

          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.1 }} style={{ marginBottom:32 }}>
            <h1 style={{
              fontFamily:"'Playfair Display',Georgia,serif",
              fontSize:"clamp(1.8rem,3vw,2.4rem)", fontWeight:700,
              color:"#fff", lineHeight:1.2, letterSpacing:"-0.025em", marginBottom:14,
            }}>
              جایت اینجاست.
            </h1>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.3)", lineHeight:2 }}>
              یک ایمیل — یک کلیک — داخلی.<br />
              بدون رمز، بدون دردسر.
            </p>
          </motion.div>

          <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }}
            transition={{ delay:0.18 }} style={{
              background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)",
              borderRadius:20, padding:26,
              backdropFilter:"blur(32px)", WebkitBackdropFilter:"blur(32px)",
            }}>
            <form onSubmit={onSubmit} style={{ display:"flex", flexDirection:"column", gap:14 }}>
              <div>
                <label style={{ display:"block", fontSize:9, letterSpacing:"0.32em", textTransform:"uppercase", color:"rgba(255,255,255,0.16)", marginBottom:10 }}>آدرس ایمیل</label>
                <EmailInput value={email} onChange={setEmail} />
              </div>

              <AnimatePresence>
                {error && (
                  <motion.p initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
                    exit={{ opacity:0, height:0 }}
                    style={{ fontSize:12, color:"rgba(248,113,113,0.75)", textAlign:"center" }}>
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <motion.button type="submit" disabled={loading || !valid}
                whileTap={valid ? { scale:0.97 } : {}} style={{
                  padding:"14px 20px", borderRadius:13, border:"none",
                  fontWeight:600, fontSize:14, letterSpacing:"0.05em",
                  cursor:valid ? "pointer" : "not-allowed",
                  background:valid
                    ? "linear-gradient(135deg,#C6A87C 0%,#E2C99A 50%,#B8955E 100%)"
                    : "rgba(255,255,255,0.05)",
                  color:valid ? "#0a0806" : "rgba(255,255,255,0.16)",
                  transition:"all 0.35s cubic-bezier(0.33,1,0.68,1)",
                  boxShadow:valid ? "0 8px 28px rgba(198,168,124,0.28)" : "none",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                }}>
                {loading ? <Loader2 size={16} className="animate-spin" /> : <>ورود به کلاب →</>}
              </motion.button>
            </form>

            <div style={{ display:"flex", alignItems:"center", gap:12, marginTop:20, paddingTop:18, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ flex:1, height:1, background:"rgba(255,255,255,0.04)" }} />
              <span style={{ fontSize:9, letterSpacing:"0.24em", textTransform:"uppercase", color:"rgba(255,255,255,0.1)", whiteSpace:"nowrap" }}>
                No Password · Instant Access
              </span>
              <span style={{ flex:1, height:1, background:"rgba(255,255,255,0.04)" }} />
            </div>
          </motion.div>

          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.35 }}
            style={{ marginTop:16, fontSize:10, color:"rgba(255,255,255,0.1)", textAlign:"center", lineHeight:1.7 }}>
            با ادامه، <span style={{ color:"rgba(198,168,124,0.32)" }}>قوانین آینه</span> رو می‌پذیری
          </motion.p>
        </motion.div>
      ) : (
        <motion.div key="sent-step"
          initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }}
          exit={{ opacity:0 }} transition={{ duration:0.4, ease:[0.33,1,0.68,1] }}
          style={{
            background:"rgba(255,255,255,0.025)", border:"1px solid rgba(255,255,255,0.07)",
            borderRadius:20, padding:"44px 28px",
            backdropFilter:"blur(32px)", WebkitBackdropFilter:"blur(32px)",
            textAlign:"center",
          }}>
          <motion.div initial={{ scale:0, rotate:-18 }} animate={{ scale:1, rotate:0 }}
            transition={{ delay:0.08, type:"spring", stiffness:240, damping:16 }}
            style={{
              width:66, height:66, borderRadius:"50%",
              background:"rgba(198,168,124,0.06)", border:"1px solid rgba(198,168,124,0.22)",
              display:"flex", alignItems:"center", justifyContent:"center",
              margin:"0 auto 24px", boxShadow:"0 0 36px rgba(198,168,124,0.14)",
            }}>
            <CheckCircle size={28} style={{ color:"#C6A87C" }} strokeWidth={1.5} />
          </motion.div>

          <motion.div initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.16 }}>
            <p style={{ fontSize:9, letterSpacing:"0.44em", textTransform:"uppercase", color:"rgba(198,168,124,0.5)", marginBottom:10 }}>Access Granted</p>
            <h2 style={{ fontFamily:"'Playfair Display',Georgia,serif", fontSize:"clamp(1.5rem,2.8vw,1.85rem)", fontWeight:700, color:"white", letterSpacing:"-0.02em", marginBottom:14 }}>لینکت رسید.</h2>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.3)", lineHeight:2 }}>
              ایمیلی به{" "}
              <span style={{ fontFamily:"monospace", fontSize:12, color:"rgba(255,255,255,0.62)", background:"rgba(255,255,255,0.06)", padding:"2px 8px", borderRadius:5 }}>{email}</span>
              <br />فرستادیم — پوشه اسپم رو هم چک کن.
            </p>
          </motion.div>

          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.28 }}
            style={{ marginTop:28, paddingTop:20, borderTop:"1px solid rgba(255,255,255,0.05)" }}>
            <button onClick={onReset}
              style={{ display:"flex", alignItems:"center", gap:7, margin:"0 auto", fontSize:11, color:"rgba(255,255,255,0.18)", background:"none", border:"none", cursor:"pointer", transition:"color 0.25s" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.48)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.18)")}>
              <RotateCcw size={11} /> ایمیل اشتباهه؟ عوضش کن
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ══ PAGE ══ */
export default function LoginPage() {
  const [step,    setStep]    = useState<"email"|"sent">("email");
  const [email,   setEmail]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(min-width: 1024px)");
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || !email.includes(".")) return;
    setLoading(true); setError("");
    try {
      const supabase = createClient();
      const { error: authErr } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (authErr) throw authErr;
      setStep("sent");
    } catch {
      setError("مشکلی پیش اومد. دوباره امتحان کن.");
    } finally {
      setLoading(false);
    }
  };

  const formProps = {
    step, email, setEmail, loading, error,
    onSubmit: handleSubmit,
    onReset: () => { setStep("email"); setError(""); },
  };

  if (!mounted) return <div style={{ background: "#050505", minHeight: "100dvh" }} />;

  return (
    <>
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&display=swap" />

      <main style={{ background: "#050505", minHeight: "100dvh", overflow: "hidden", position: "relative" }}>

        {/* ══ یه shader برای همه ══ */}
        <AynehShader />

        {/* ══ DESKTOP ══ */}
        {isDesktop ? (
          <div style={{ position: "relative", zIndex: 1, display: "flex", minHeight: "100dvh" }}>
            {/* چپ */}
            <div style={{ flex: 1, minWidth: 0, position: "relative", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "clamp(40px,5vw,64px)" }}>
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to right, rgba(5,5,5,0.08) 0%, rgba(5,5,5,0.55) 70%, #050505 100%)" }} />
              <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "linear-gradient(to top, #050505 0%, transparent 28%)" }} />

              <Link href="/" style={{ position: "relative", zIndex: 2, display: "inline-flex", alignItems: "center", gap: 12, textDecoration: "none", width: "fit-content" }}>
                <div style={{ filter: "drop-shadow(0 0 14px rgba(198,168,124,0.45))", transition: "transform 0.3s" }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.06)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}>
                  <AynehLogo size={42} />
                </div>
                <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 900, fontSize: "clamp(15px,1.5vw,19px)", letterSpacing: "0.34em", color: "white" }}>AYNEH</span>
              </Link>

              <div style={{ position: "relative", zIndex: 2, maxWidth: 300 }}>
                <div style={{ width: 28, height: 1, background: "linear-gradient(90deg,#C6A87C,transparent)", marginBottom: 20 }} />
                <p style={{ fontFamily: "'Playfair Display',Georgia,serif", fontSize: "clamp(1.3rem,1.9vw,1.75rem)", fontWeight: 700, lineHeight: 1.38, color: "white", marginBottom: 14 }}>
                  هر بار که می‌آی،<br />
                  <span style={{ color: "#C6A87C" }}>می‌دانیم که کیستی.</span>
                </p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.26)", lineHeight: 2 }}>
                  تجربه‌ای که دقیقاً برای تو<br />طراحی شده — نه برای همه.
                </p>
                <div style={{ display: "flex", gap: 20, marginTop: 22 }}>
                  {["Luxury","Personal","Exclusive"].map(t => (
                    <span key={t} style={{ fontSize: 9, letterSpacing: "0.32em", textTransform: "uppercase", color: "rgba(198,168,124,0.3)" }}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* راست */}
            <div style={{ width: "min(500px,40vw)", flexShrink: 0, position: "relative", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(40px,5vw,72px) clamp(32px,4vw,60px)" }}>
              <div style={{ position: "absolute", left: 0, top: "10%", bottom: "10%", width: 1, background: "linear-gradient(to bottom,transparent,rgba(198,168,124,0.13),transparent)" }} />
              <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "rgba(255,255,255,0.16)", textDecoration: "none", marginBottom: 52, width: "fit-content", transition: "color 0.25s" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.16)")}>
                <ArrowLeft size={13} /> بازگشت
              </Link>
              <FormPanel {...formProps} />
              <p style={{ marginTop: "auto", paddingTop: 52, fontSize: 10, color: "rgba(255,255,255,0.07)", letterSpacing: "0.1em" }}>
                © {new Date().getFullYear()} Ayneh Beauty Lounge
              </p>
            </div>
          </div>
        ) : (
          /* ══ MOBILE ══ */
          <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", minHeight: "100dvh" }}>
            <div style={{ position: "fixed", inset: 0, pointerEvents: "none", background: "linear-gradient(to bottom,rgba(5,5,5,0.42) 0%,rgba(5,5,5,0.78) 50%,#050505 100%)" }} />

            <header style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "28px 24px 12px" }}>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
                <AynehLogo size={34} />
                <span style={{ fontFamily: "'Playfair Display',Georgia,serif", fontWeight: 900, fontSize: 16, letterSpacing: "0.28em", color: "white" }}>AYNEH</span>
              </Link>
              <Link href="/" style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", letterSpacing: "0.15em", textDecoration: "none" }}>بازگشت ↩</Link>
            </header>

            <div style={{ position: "relative", zIndex: 2, flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
              <div style={{ width: "100%", maxWidth: 380 }}>
                <FormPanel {...formProps} />
              </div>
            </div>

            <footer style={{ position: "relative", zIndex: 2, padding: "16px 24px 36px", textAlign: "center" }}>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.14)", fontStyle: "italic" }}>
                «هر بار که می‌آی، می‌دانیم که کیستی.»
              </p>
            </footer>
          </div>
        )}
      </main>
    </>
  );
}