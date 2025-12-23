"use client";

import { useState, useRef, useEffect } from "react";
import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  Sparkles,
  Hand,
  Palette,
  RefreshCw,
  Check,
  Loader2,
  Download,
  Scan,
  ArrowUpDown,
  Maximize2,
  Gem,
  Fingerprint,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  analyzeHandShape,
  getSkinTone,
  NAIL_RECOMMENDATIONS,
  COLOR_PALETTES,
} from "@/app/constants/nails";
import html2canvas from "html2canvas-pro";

export default function HandAnalyzer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  const [landmarker, setLandmarker] = useState<HandLandmarker | null>(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [landmarks, setLandmarks] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLowLight, setIsLowLight] = useState(false);
  const [flash, setFlash] = useState(false);

  const getShapeIcon = (id: string) => {
    switch (id) {
      case "slender":
        return <ArrowUpDown size={64} className="text-[#C6A87C]" />;
      case "broad":
        return <Maximize2 size={64} className="text-[#C6A87C]" />;
      case "petite":
        return <Gem size={64} className="text-[#C6A87C]" />;
      default:
        return <Hand size={64} className="text-[#C6A87C]" />;
    }
  };

  // ---- Helpers (Camera) ----
  const stopStream = () => {
    const v = videoRef.current;
    if (v?.srcObject instanceof MediaStream) {
      v.srcObject.getTracks().forEach((t) => t.stop());
      v.srcObject = null;
    }
  };

  // 1) Load Model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
        );
        const handLandmarker = await HandLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/models/hand_landmarker.task",
            delegate: "GPU",
          },
          runningMode: "VIDEO",
          numHands: 1,
        });
        setLandmarker(handLandmarker);
      } catch (err) {
        console.error("AI Load Error:", err);
        setErrorMsg("خطا در بارگذاری مدل دست. لطفاً رفرش کنید.");
      }
    };
    loadModel();

    return () => {
      stopStream();
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Toggle Camera
  const enableCam = async () => {
    if (!landmarker) return;

    if (webcamRunning) {
      setWebcamRunning(false);
      stopStream();
      return;
    }

    const isMobile = window.innerWidth < 768;
    const constraints: MediaStreamConstraints = {
      video: {
        width: isMobile ? 720 : 1280,
        height: isMobile ? 1280 : 720,
        facingMode: "environment",
      },
      audio: false,
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadeddata = () => {
          videoRef.current?.play();
          setWebcamRunning(true);
          setErrorMsg(null);
        };
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("دسترسی به دوربین مسدود است.");
    }
  };

  // 3) Render Loop + Light Check
  useEffect(() => {
    if (webcamRunning && landmarker && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      let lastVideoTime = -1;
      let frameCount = 0;

      const renderLoop = () => {
        if (!webcamRunning || !landmarker) return;

        if (video.readyState >= 2 && video.currentTime !== lastVideoTime) {
          const startTimeMs = performance.now();
          const detection = landmarker.detectForVideo(video, startTimeMs);

          if (detection.landmarks && detection.landmarks.length > 0) {
            setLandmarks(detection.landmarks[0]);
          } else {
            setLandmarks([]);
          }
          lastVideoTime = video.currentTime;

          // Lighting Check
          if (frameCount++ % 30 === 0 && ctx) {
            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(video, 0, 0, 100, 100);
            const frame = ctx.getImageData(0, 0, 100, 100).data;
            let total = 0;
            for (let i = 0; i < frame.length; i += 4) {
              total += (frame[i] + frame[i + 1] + frame[i + 2]) / 3;
            }
            setIsLowLight(total / (frame.length / 4) < 60);
          }
        }

        requestRef.current = requestAnimationFrame(renderLoop);
      };

      requestRef.current = requestAnimationFrame(renderLoop);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    };
  }, [webcamRunning, landmarker]);

  // 4) Analyze
  const analyzeHand = () => {
    if (landmarks.length === 0) {
      setErrorMsg("لطفاً دست خود را در کادر قرار دهید!");
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    let capturedResult: any = null;

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const shapeKey = analyzeHandShape(landmarks);
        const x = landmarks[9].x * canvas.width;
        const y = (landmarks[9].y + 0.05) * canvas.height;
        const toneKey = getSkinTone(ctx, x, y);

        capturedResult = {
          shape: NAIL_RECOMMENDATIONS[shapeKey || "Petite"],
          tone: COLOR_PALETTES[toneKey || "Neutral"],
        };
      }
    }

    if (!capturedResult) {
      capturedResult = {
        shape: NAIL_RECOMMENDATIONS["Petite"],
        tone: COLOR_PALETTES["Neutral"],
      };
    }

    setIsAnalyzing(true);
    setWebcamRunning(false);
    stopStream();

    setTimeout(() => setScanStep(1), 1000);
    setTimeout(() => setScanStep(2), 2500);
    setTimeout(() => setScanStep(3), 4000);

    setTimeout(() => {
      setResult(capturedResult);
      setIsAnalyzing(false);
      setScanStep(0);
    }, 5500);
  };

  // ---- Download helpers (OKLAB-safe) ----
  const sanitizeForHtml2Canvas = (root: HTMLElement) => {
    const all = root.querySelectorAll<HTMLElement>("*");
    all.forEach((node) => {
      const cs = window.getComputedStyle(node);

      // این‌ها معمولاً به rgba/rgb resolve می‌شوند؛ با inline کردن، html2canvas گیر oklab نمی‌افتد
      node.style.backgroundColor = cs.backgroundColor;
      node.style.borderColor = cs.borderColor;
      node.style.color = cs.color;

      // ولی background-image (گرادیانت‌ها) ممکن است شامل oklab/oklch/color-mix باشند → حذف
      const bgImg = cs.backgroundImage || "";
      if (
        bgImg.includes("oklab(") ||
        bgImg.includes("oklch(") ||
        bgImg.includes("color-mix(") ||
        bgImg.includes("color(")
      ) {
        node.style.backgroundImage = "none";
      }
    });
  };

  const handleDownload = async () => {
    if (!resultCardRef.current) return;

    setIsDownloading(true);
    setErrorMsg(null);

    const original = resultCardRef.current;

    // Overlay برای اینکه clone دیده نشه
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.inset = "0";
    overlay.style.background = "#050505";
    overlay.style.zIndex = "2147483646";
    overlay.style.pointerEvents = "none";
    document.body.appendChild(overlay);

    const clone = original.cloneNode(true) as HTMLElement;

    // نکته: html2canvas (و حتی pro) چیزی که display:none باشه رو خوب رندر نمی‌کنه،
    // پس clone رو همیشه قابل رندر می‌کنیم.
    clone.style.display = "flex";
    clone.style.position = "fixed";
    clone.style.left = "0";
    clone.style.top = "0";
    clone.style.width = "1080px";
    clone.style.height = "1920px";
    clone.style.zIndex = "2147483647";
    clone.style.pointerEvents = "none";

    document.body.appendChild(clone);

    try {
      // صبر برای فونت‌ها
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fonts = (document as any).fonts;
      if (fonts?.ready) await fonts.ready;

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
      const scale = isIOS && isMobile ? 1.6 : 2;

      const canvas = await html2canvas(clone, {
        scale,
        backgroundColor: "#050505",
        useCORS: true,
        logging: false,
        windowWidth: 1080,
        windowHeight: 1920,
        scrollX: 0,
        scrollY: 0,
      });

      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);

      if (isIOS) {
        window.open(dataUrl, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `Ayneh-Nail-Report-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (e) {
      console.error(e);
      const msg = e instanceof Error ? e.message : String(e);
      setErrorMsg(`خطا در دانلود کارت. (${msg})`);
    } finally {
      if (clone.parentNode) clone.parentNode.removeChild(clone);
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
      setIsDownloading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setLandmarks([]);
    setWebcamRunning(false);
    stopStream();
    enableCam();
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden z-[100]">
      <canvas ref={canvasRef} className="hidden" />

      {flash && (
        <div className="fixed inset-0 bg-white z-[200] animate-[flash_0.3s_ease-out] pointer-events-none" />
      )}

      <AnimatePresence>
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed top-10 left-1/2 -translate-x-1/2 z-[150] bg-red-500/10 border border-red-500 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-2xl"
          >
            <AlertTriangle />
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg(null)}>
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- 🌟 Invisible Download Card 🌟 --- */}
      <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
        {result && (
          <div
            ref={resultCardRef}
            className="w-[1080px] h-[1920px] bg-[#050505] hidden flex-col relative border-[40px] border-[#C6A87C] font-sans"
            dir="rtl"
          >
            {/* ... محتویات کارت دانلود دقیقاً مثل قبل ... */}
            <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-10"></div>
            <div className="absolute top-0 right-0 w-[900px] h-[900px] bg-gradient-to-b from-[#C6A87C]/10 to-transparent rounded-full blur-[150px] -mr-40 -mt-40"></div>

            <div className="p-20 border-b border-[#C6A87C]/20 flex justify-between items-end relative z-10">
              <div className="text-right">
                <h1 className="text-9xl font-black text-[#C6A87C] font-serif tracking-tighter">
                  آینه
                </h1>
                <p className="text-4xl text-gray-400 tracking-[0.4em] mt-6 uppercase">
                  NAIL ATELIER
                </p>
              </div>
              <div className="text-left opacity-50" dir="ltr">
                <p className="text-3xl font-mono text-white">
                  REF: {Math.floor(Math.random() * 90000) + 10000}
                </p>
                <p className="text-2xl mt-2 text-gray-400">
                  {new Date().toLocaleDateString("fa-IR")}
                </p>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-24 p-20 relative z-10">
              <div className="relative">
                <div className="w-[450px] h-[450px] rounded-full border-[3px] border-[#C6A87C] flex items-center justify-center bg-[#0a0a0a] shadow-[0_0_150px_rgba(198,168,124,0.3)]">
                  {result.shape.id === "slender" && (
                    <ArrowUpDown size={200} className="text-[#C6A87C]" />
                  )}
                  {result.shape.id === "broad" && (
                    <Maximize2 size={200} className="text-[#C6A87C]" />
                  )}
                  {result.shape.id === "petite" && (
                    <Gem size={200} className="text-[#C6A87C]" />
                  )}
                </div>
                <div className="absolute inset-0 border border-[#C6A87C]/30 rounded-full scale-110"></div>
              </div>

              <div className="text-center w-full">
                <div className="flex justify-center items-center gap-4 mb-8">
                  <span className="h-[1px] w-20 bg-[#C6A87C]/50"></span>
                  <p className="text-4xl text-[#C6A87C] font-bold uppercase tracking-[0.3em]">
                    تحلیل آناتومی
                  </p>
                  <span className="h-[1px] w-20 bg-[#C6A87C]/50"></span>
                </div>
                <h2 className="text-8xl font-black text-white leading-tight mb-8">
                  {result.shape.title}
                </h2>
                <p className="text-4xl text-gray-300 font-light leading-relaxed max-w-5xl mx-auto">
                  {result.shape.desc}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-10 w-full">
                <div className="bg-white/5 rounded-[3rem] p-12 border border-white/10 text-center">
                  <span className="text-2xl text-gray-500 uppercase tracking-widest block mb-4">
                    فرم پیشنهادی
                  </span>
                  <span className="text-5xl text-white font-bold">
                    {result.shape.shape}
                  </span>
                </div>
                <div className="bg-white/5 rounded-[3rem] p-12 border border-white/10 text-center">
                  <span className="text-2xl text-gray-500 uppercase tracking-widest block mb-4">
                    تناژ پوست
                  </span>
                  <span className="text-5xl text-white font-bold">
                    {result.tone.title.split(" ")[1]}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-16 border-t border-[#C6A87C]/20 flex justify-between items-center bg-[#080808]">
              <div className="flex items-center gap-6">
                <div className="p-5 border border-white/30 rounded-2xl">
                  <Fingerprint size={50} className="text-[#C6A87C]" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white uppercase">
                    تایید هوش مصنوعی
                  </p>
                  <p className="text-2xl text-gray-500">
                    پردازش شده در سرورهای آینه
                  </p>
                </div>
              </div>
              <p className="text-3xl text-[#C6A87C] tracking-[0.5em] uppercase">
                AYNEH.IR
              </p>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl flex flex-col items-center gap-10"
          >
            <div className="text-center space-y-4">
              <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#C6A87C] via-white to-[#C6A87C] font-serif">
                استودیو ناخن هوشمند
              </h1>
              <p className="text-gray-400 text-lg font-light tracking-wide">
                پیشنهاد فرم و رنگ لاک، متناسب با آناتومی دست شما
              </p>
            </div>

            <div className="relative w-full aspect-[3/4] md:aspect-video bg-[#111] rounded-[3rem] overflow-hidden border-2 border-white/10 shadow-[0_0_60px_rgba(0,0,0,0.6)] group">
              {!webcamRunning && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-[url('/images/grid.png')] bg-cover opacity-80 backdrop-blur-sm">
                  <div className="w-32 h-32 border-2 border-[#C6A87C] rounded-full flex items-center justify-center mb-8 relative">
                    <div className="absolute inset-0 rounded-full border-2 border-dashed border-white/20 animate-spin-slow"></div>
                    <Hand size={48} className="text-[#C6A87C]" />
                  </div>
                  <button
                    onClick={enableCam}
                    className="bg-white text-black px-10 py-4 rounded-full font-bold text-lg hover:bg-[#C6A87C] transition-all flex items-center gap-3 shadow-xl hover:shadow-[0_0_30px_rgba(198,168,124,0.5)]"
                  >
                    <Camera size={22} /> روشن کردن دوربین
                  </button>
                </div>
              )}

              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover transform scale-x-[-1] transition-all duration-700 ${
                  !webcamRunning
                    ? "opacity-0 scale-110"
                    : "opacity-100 scale-100"
                }`}
              />

              {webcamRunning && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  {isLowLight && (
                    <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 px-6 py-2 rounded-full flex items-center gap-2 backdrop-blur-md animate-pulse z-20">
                      <AlertTriangle size={16} />
                      <span className="text-xs font-bold">نور محیط کم است</span>
                    </div>
                  )}
                  <div
                    className={`w-[280px] h-[400px] border-2 rounded-[3rem] transition-colors duration-300 relative ${
                      landmarks.length > 0
                        ? "border-green-500/50 shadow-[0_0_50px_rgba(34,197,94,0.2)]"
                        : "border-white/20 border-dashed"
                    }`}
                  >
                    {landmarks.length > 0 && (
                      <motion.div
                        initial={{ top: "0%" }}
                        animate={{ top: "100%" }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute left-0 right-0 h-[2px] bg-green-400 shadow-[0_0_20px_#4ade80]"
                      />
                    )}

                    <div
                      className={`absolute -bottom-14 left-1/2 -translate-x-1/2 px-6 py-2 rounded-full border backdrop-blur-md flex items-center gap-2 transition-all w-max ${
                        landmarks.length > 0
                          ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : "bg-black/50 text-gray-400 border-white/10"
                      }`}
                    >
                      {landmarks.length > 0 ? (
                        <>
                          <Check size={16} /> دست شناسایی شد
                        </>
                      ) : (
                        <>
                          <Scan size={16} /> دست را در کادر تنظیم کنید
                        </>
                      )}
                    </div>

                    <p className="absolute top-full mt-16 left-1/2 -translate-x-1/2 text-sm text-gray-400 whitespace-nowrap text-center opacity-80">
                      لطفاً دست خود را دقیقاً درون کادر تنظیم کنید تا خطوط سبز
                      شوند
                    </p>
                  </div>
                </div>
              )}
            </div>

            {webcamRunning && (
              <button
                onClick={analyzeHand}
                disabled={landmarks.length === 0}
                className="w-full max-w-sm py-5 bg-gradient-to-r from-[#C6A87C] to-[#b0936a] text-black rounded-2xl font-black text-xl hover:shadow-[0_0_40px_rgba(198,168,124,0.4)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
              >
                <Sparkles size={24} /> شروع آنالیز دست
              </button>
            )}
          </motion.div>
        )}

        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center fixed inset-0 bg-[#050505] z-50"
          >
            <div className="relative w-72 h-72">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-t-2 border-[#C6A87C] rounded-full shadow-[0_0_40px_#C6A87C]"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-b-2 border-white/20 rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Hand size={80} className="text-white/80 animate-pulse" />
              </div>
            </div>

            <div className="mt-16 w-64 space-y-4">
              <motion.div
                animate={{
                  opacity: scanStep >= 1 ? 1 : 0.3,
                  x: scanStep >= 1 ? 0 : -20,
                }}
                className="flex items-center gap-4 text-[#C6A87C] font-bold"
              >
                <Check size={18} /> اندازه‌گیری انگشتان
              </motion.div>
              <motion.div
                animate={{
                  opacity: scanStep >= 2 ? 1 : 0.3,
                  x: scanStep >= 2 ? 0 : -20,
                }}
                className="flex items-center gap-4 text-[#C6A87C] font-bold"
              >
                <Check size={18} /> آنالیز رنگ پوست
              </motion.div>
              <motion.div
                animate={{
                  opacity: scanStep >= 3 ? 1 : 0.3,
                  x: scanStep >= 3 ? 0 : -20,
                }}
                className="flex items-center gap-4 text-[#C6A87C] font-bold"
              >
                <Check size={18} /> تولید گزارش لوکس
              </motion.div>
            </div>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 py-10 px-4"
          >
            <div className="bg-[#111] border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group hover:border-[#C6A87C]/50 transition-all duration-500 shadow-2xl">
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#C6A87C]/10 rounded-full blur-[60px] pointer-events-none"></div>
              <div className="flex items-start justify-between mb-8">
                <div className="w-20 h-20 bg-[#C6A87C] rounded-2xl flex items-center justify-center text-4xl shadow-[0_10px_30px_rgba(198,168,124,0.3)]">
                  {getShapeIcon(result.shape.id)}
                </div>
                <span className="px-4 py-1 rounded-full border border-white/10 text-gray-400 text-xs font-bold uppercase tracking-widest bg-white/5">
                  Shape Analysis
                </span>
              </div>
              <h2 className="text-4xl font-black text-white mb-4 leading-tight">
                {result.shape.title}
              </h2>
              <p className="text-gray-400 leading-loose text-sm mb-8 border-l-2 border-[#C6A87C] pl-4">
                {result.shape.desc}
              </p>
              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/5 flex items-center justify-between">
                <div>
                  <span className="text-gray-500 text-xs block mb-1 uppercase tracking-wider">
                    مدل پیشنهادی
                  </span>
                  <span className="text-white font-bold text-xl">
                    {result.shape.shape}
                  </span>
                </div>
                <Fingerprint className="text-[#C6A87C] opacity-50" size={32} />
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex-1 bg-[#111] border border-white/10 rounded-[3rem] p-10 relative overflow-hidden group hover:border-[#C6A87C]/50 transition-all duration-500 shadow-2xl">
                <div className="flex items-center gap-4 mb-8">
                  <Palette className="text-[#C6A87C]" size={28} />
                  <h3 className="text-2xl font-bold text-white">
                    پالت {result.tone.title}
                  </h3>
                </div>
                <p className="text-gray-400 text-sm mb-8">{result.tone.desc}</p>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  {result.tone.colors.map((c: string, idx: number) => (
                    <div
                      key={idx}
                      className="group/color relative cursor-pointer shrink-0"
                    >
                      <div
                        className="w-14 h-14 rounded-full border-2 border-white/10 shadow-lg transform group-hover/color:scale-125 transition-all duration-300"
                        style={{ backgroundColor: c }}
                      ></div>
                      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-gray-500 opacity-0 group-hover/color:opacity-100 transition-opacity uppercase">
                        {c}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex-1 py-5 bg-[#C6A87C] text-black rounded-[2rem] font-bold flex items-center justify-center gap-2 hover:bg-white hover:scale-[1.02] transition-all shadow-[0_10px_30px_rgba(198,168,124,0.2)]"
                >
                  {isDownloading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      <Download size={20} /> دانلود نتیجه
                    </>
                  )}
                </button>
                <button
                  onClick={reset}
                  className="flex-1 py-5 border border-white/10 text-gray-400 rounded-[2rem] font-bold flex items-center justify-center gap-2 hover:bg-white/5 hover:text-white transition-all"
                >
                  <RefreshCw size={20} /> تست مجدد
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
