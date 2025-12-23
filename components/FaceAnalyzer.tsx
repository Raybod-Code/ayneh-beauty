"use client";

import { useState, useRef, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useColor } from "@/app/context/ColorContext";
import { analyzeFaceGeometry } from "@/app/utils/faceLogic";
import {
  analyzeSeason,
  extractRegionColor,
  Season,
} from "@/app/utils/colorAnalysis";
import { SEASON_PALETTES } from "@/app/constants/colors";
import { PRODUCTS } from "@/app/utils/faceDatabase";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas-pro";
import {
  Check,
  Sparkles,
  Palette,
  Scissors,
  RefreshCw,
  Download,
  UserCheck,
  ScanFace,
  Loader2,
  Fingerprint,
  Aperture,
  X,
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";
import Image from "next/image";
import Link from "next/link";

export default function FaceAnalyzer() {
  const { addToCart } = useCart();
  const { setSeason } = useColor();

  // --- Refs & State ---
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);
  const requestRef = useRef<number | null>(null);

  const [landmarker, setLandmarker] = useState<FaceLandmarker | null>(null);
  const [webcamRunning, setWebcamRunning] = useState(false);
  const [landmarks, setLandmarks] = useState<any[]>([]);
  const [result, setResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [addedId, setAddedId] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLowLight, setIsLowLight] = useState(false);
  const [flash, setFlash] = useState(false);

  // 1️⃣ Load AI Model
  useEffect(() => {
    const loadModel = async () => {
      try {
        const filesetResolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
        );
        const faceLandmarker = await FaceLandmarker.createFromOptions(
          filesetResolver,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU",
            },
            outputFaceBlendshapes: true,
            runningMode: "VIDEO",
            numFaces: 1,
          }
        );
        setLandmarker(faceLandmarker);
      } catch (err) {
        console.error("AI Load Error:", err);
        setErrorMsg("خطا در بارگذاری هوش مصنوعی. لطفاً صفحه را رفرش کنید.");
      }
    };
    loadModel();
  }, []);

  // 2️⃣ Toggle Camera
  const stopStream = () => {
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
      videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  const enableCam = async () => {
    if (!landmarker) return;

    if (webcamRunning) {
      setWebcamRunning(false);
      stopStream();
      return;
    }

    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    const constraints: MediaStreamConstraints = {
      video: {
        width: isMobile ? 720 : 1280,
        height: isMobile ? 1280 : 720,
        facingMode: "user",
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
      setErrorMsg(
        "دسترسی به دوربین مسدود است. لطفاً از تنظیمات مرورگر اجازه دهید."
      );
    }
  };

  // 3️⃣ AI Loop & Lighting Check
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
          const detections = landmarker.detectForVideo(video, startTimeMs);

          if (detections.faceLandmarks && detections.faceLandmarks.length > 0) {
            setLandmarks(detections.faceLandmarks[0]);
          } else {
            setLandmarks([]);
          }
          lastVideoTime = video.currentTime;

          // Lighting Check (هر 30 فریم)
          if (frameCount++ % 30 === 0 && ctx) {
            canvas.width = 100;
            canvas.height = 100;
            ctx.drawImage(video, 0, 0, 100, 100);
            const frame = ctx.getImageData(0, 0, 100, 100).data;

            let totalBrightness = 0;
            for (let i = 0; i < frame.length; i += 4) {
              totalBrightness += (frame[i] + frame[i + 1] + frame[i + 2]) / 3;
            }
            const avgBrightness = totalBrightness / (frame.length / 4);
            setIsLowLight(avgBrightness < 50);
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

  // 4️⃣ Analyze Logic
  const captureAndAnalyze = () => {
    if (landmarks.length === 0) {
      setErrorMsg("لطفاً صورت خود را در کادر قرار دهید!");
      setTimeout(() => setErrorMsg(null), 3000);
      return;
    }

    setFlash(true);
    setTimeout(() => setFlash(false), 300);

    setIsAnalyzing(true);
    setWebcamRunning(false);
    stopStream();

    setTimeout(() => setScanStep(1), 1000);
    setTimeout(() => setScanStep(2), 2500);
    setTimeout(() => setScanStep(3), 4000);

    let detectedSeason: Season = "Winter";

    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          const w = canvas.width;
          const h = canvas.height;

          const skinPoints = [
            { x: landmarks[4].x * w, y: landmarks[4].y * h },
            { x: landmarks[234].x * w, y: landmarks[234].y * h },
            { x: landmarks[454].x * w, y: landmarks[454].y * h },
          ];

          const hairY = Math.max(0, (landmarks[10].y - 0.15) * h);
          const hairPoints = [{ x: landmarks[10].x * w, y: hairY }];

          const skinColor = extractRegionColor(ctx, skinPoints);

          const hairRegion = [
            { x: hairPoints[0].x - 10, y: hairPoints[0].y - 10 },
            { x: hairPoints[0].x + 10, y: hairPoints[0].y + 10 },
          ];
          const hairColor = extractRegionColor(ctx, hairRegion);

          const season = analyzeSeason(skinColor, hairColor);
          if (season) detectedSeason = season;
        } catch (e) {
          console.error(e);
        }

        setSeason(detectedSeason);
      }
    }

    setTimeout(() => {
      const geometryData = analyzeFaceGeometry(landmarks);
      setResult({ ...geometryData, season: detectedSeason });
      setIsAnalyzing(false);
      setScanStep(0);
    }, 5500);
  };

  // 5️⃣ Download System – Luxury + font-safe
  const pickFirstFont = (fontFamily: string) => {
    // "Doran", ui-sans-serif, ...
    const first = fontFamily.split(",")[0]?.trim() || "Doran";
    return first.replace(/^["']|["']$/g, "");
  };

  const handleDownload = async () => {
    if (!resultCardRef.current) return;

    setIsDownloading(true);

    const element = resultCardRef.current;
    const computedFontFamily = window.getComputedStyle(element).fontFamily;
    const firstFont = pickFirstFont(computedFontFamily);

    try {
      // صبر برای لود واقعی فونت (بخصوص برای canvas capture)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const fonts = (document as any).fonts;
      if (fonts?.load) {
        await fonts.load(`16px ${firstFont}`);
        await fonts.ready;
      }

      // clone بساز و داخل viewport بگذار (ولی زیر یک overlay که کاربر نبینه)
      const clone = element.cloneNode(true) as HTMLElement;

      clone.style.position = "fixed";
      clone.style.left = "0";
      clone.style.top = "0";
      clone.style.width = "1080px";
      clone.style.height = "1920px";
      clone.style.zIndex = "2147483646";
      clone.style.opacity = "1";
      clone.style.pointerEvents = "none";

      // فونت را روی کل subtree قفل کن (اسم واقعی resolve شده)
      clone.style.fontFamily = computedFontFamily;
      clone.querySelectorAll<HTMLElement>("*").forEach((n) => {
        n.style.fontFamily = computedFontFamily;
      });

      document.body.appendChild(clone);

      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: "#050505",
        useCORS: true,
        logging: false,
        windowWidth: 1080,
        windowHeight: 1920,
      });

      document.body.removeChild(clone);

      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        window.open(dataUrl, "_blank");
      } else {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `Ayneh-Face-Report-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Download failed:", err);
      setErrorMsg("خطا در دانلود. لطفاً مجدد تلاش کنید.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleSaveToProfile = () => {
    if (!result) return;
    localStorage.setItem("ayneh-face-analysis", JSON.stringify(result));
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setResult(null);
    setLandmarks([]);
    setSeason("Winter");
    enableCam();
  };

  const handleAddToCart = (prodId: string) => {
    const product = PRODUCTS.find((p) => p.id === prodId);
    if (product) {
      addToCart(product);
      setAddedId(prodId);
      setTimeout(() => setAddedId(null), 2000);
    }
  };

  return (
    <div className="w-full min-h-screen relative flex flex-col items-center justify-start p-4 lg:p-10 bg-[#050505] z-[100] overflow-x-hidden">
      <canvas ref={canvasRef} className="hidden" />

      {/* Flash */}
      {flash && (
        <div className="fixed inset-0 bg-white z-[200] animate-[flash_0.3s_ease-out] pointer-events-none" />
      )}

      {/* Error */}
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

      {/* --- 💌 Wedding-invite Luxury Download Card (1080x1920) --- */}
      {result && (
        <div className="fixed -left-[9999px] top-0">
          <div
            ref={resultCardRef}
            dir="rtl"
            className="w-[1080px] h-[1920px] relative overflow-hidden"
            style={{
              fontFamily:
                "var(--font-doran), ui-sans-serif, system-ui, sans-serif",
              backgroundColor: "#050505",
            }}
          >
            {/* black base + vignette */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(circle at 50% 20%, rgba(198,168,124,0.10) 0%, rgba(5,5,5,1) 55%)",
              }}
            />
            {/* noise */}
            <div className="absolute inset-0 opacity-[0.08] bg-[url('/images/noise.png')]" />

            {/* frames */}
            <div
              className="absolute"
              style={{
                inset: 34,
                borderRadius: 64,
                border: "2px solid rgba(198,168,124,0.55)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.05) inset",
              }}
            />
            <div
              className="absolute"
              style={{
                inset: 56,
                borderRadius: 54,
                border: "1px solid rgba(255,255,255,0.10)",
              }}
            />

            {/* ivory paper */}
            <div
              className="absolute"
              style={{
                inset: 78,
                borderRadius: 46,
                background:
                  "linear-gradient(180deg, rgba(255,251,245,0.98) 0%, rgba(252,245,235,0.98) 55%, rgba(248,238,224,0.98) 100%)",
                boxShadow:
                  "0 25px 90px rgba(0,0,0,0.55), 0 0 0 1px rgba(198,168,124,0.22) inset",
              }}
            />

            {/* ornaments top */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ top: 110, width: 820, height: 120 }}
            >
              <svg
                width="820"
                height="120"
                viewBox="0 0 820 120"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M110 60 C190 20, 290 20, 370 60 C450 100, 550 100, 630 60 C710 20, 760 25, 790 60"
                  fill="none"
                  stroke="rgba(198,168,124,0.55)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <path
                  d="M90 60 L160 60 M660 60 L730 60"
                  stroke="rgba(17,17,17,0.35)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle cx="410" cy="60" r="6" fill="rgba(198,168,124,0.70)" />
                <circle
                  cx="410"
                  cy="60"
                  r="16"
                  fill="none"
                  stroke="rgba(198,168,124,0.28)"
                  strokeWidth="2"
                />
              </svg>
            </div>

            {/* header */}
            <div
              className="absolute left-0 right-0 text-center"
              style={{ top: 250, padding: "0 120px" }}
            >
              <div
                className="mx-auto flex items-center justify-center"
                style={{
                  width: 120,
                  height: 120,
                  borderRadius: 999,
                  background:
                    "linear-gradient(135deg, rgba(198,168,124,0.92) 0%, rgba(255,255,255,0.18) 55%, rgba(198,168,124,0.78) 100%)",
                  boxShadow:
                    "0 18px 45px rgba(0,0,0,0.25), 0 0 0 2px rgba(198,168,124,0.45) inset",
                }}
              >
                <div
                  style={{
                    width: 92,
                    height: 92,
                    borderRadius: 999,
                    backgroundColor: "rgba(30,20,12,0.60)",
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.18) inset",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      color: "rgba(255,255,255,0.92)",
                      fontWeight: 900,
                      fontSize: 34,
                      letterSpacing: "0.08em",
                    }}
                  >
                    AY
                  </span>
                </div>
              </div>

              <h1
                className="mt-8"
                style={{
                  fontSize: 96,
                  fontWeight: 900,
                  color: "#111",
                  letterSpacing: "-0.02em",
                }}
              >
                آینه
              </h1>

              <div
                className="mt-4 flex items-center justify-center gap-3"
                style={{
                  color: "rgba(17,17,17,0.60)",
                  fontSize: 22,
                  letterSpacing: "0.28em",
                }}
              >
                <span style={{ fontWeight: 800 }}>INVITATION</span>
                <span style={{ color: "rgba(198,168,124,0.9)" }}>•</span>
                <span style={{ fontWeight: 800 }}>FACE AI REPORT</span>
              </div>
            </div>

            {/* main */}
            <div
              className="absolute left-0 right-0"
              style={{ top: 560, padding: "0 140px", textAlign: "center" }}
            >
              <div
                className="mx-auto"
                style={{
                  width: 280,
                  height: 280,
                  borderRadius: 999,
                  background: "rgba(17,17,17,0.92)",
                  boxShadow:
                    "0 25px 70px rgba(0,0,0,0.28), 0 0 0 3px rgba(198,168,124,0.55) inset",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: 240,
                    height: 240,
                    borderRadius: 999,
                    background:
                      "radial-gradient(circle at 30% 25%, rgba(198,168,124,0.35) 0%, rgba(17,17,17,1) 65%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span
                    style={{
                      fontSize: 140,
                      filter: "drop-shadow(0 18px 20px rgba(0,0,0,0.45))",
                    }}
                  >
                    {result.season ? SEASON_PALETTES[result.season].icon : "💎"}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 44 }}>
                <div
                  className="mx-auto inline-flex items-center gap-2"
                  style={{
                    padding: "14px 22px",
                    borderRadius: 999,
                    backgroundColor: "rgba(198,168,124,0.14)",
                    border: "1px solid rgba(198,168,124,0.35)",
                    color: "rgba(17,17,17,0.85)",
                    fontWeight: 900,
                    fontSize: 22,
                    letterSpacing: "0.16em",
                  }}
                >
                  <span>فصل رنگی شما</span>
                  <Sparkles size={18} color="rgba(198,168,124,0.95)" />
                </div>

                <h2
                  className="mt-8"
                  style={{
                    marginTop: 26,
                    fontSize: 92,
                    fontWeight: 950,
                    color: "#111",
                    lineHeight: 1,
                  }}
                >
                  {result.season
                    ? SEASON_PALETTES[result.season].title
                    : result.title}
                </h2>

                <p
                  className="mt-8"
                  style={{
                    marginTop: 28,
                    fontSize: 30,
                    lineHeight: 1.9,
                    color: "rgba(17,17,17,0.68)",
                  }}
                >
                  {result.season
                    ? SEASON_PALETTES[result.season].description
                    : result.description}
                </p>
              </div>

              {result.season && (
                <div
                  style={{
                    marginTop: 56,
                    padding: "26px 28px",
                    borderRadius: 36,
                    backgroundColor: "rgba(17,17,17,0.05)",
                    border: "1px solid rgba(17,17,17,0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 18,
                      padding: "0 6px",
                    }}
                  >
                    {SEASON_PALETTES[result.season].colors
                      .slice(0, 6)
                      .map((c: string, i: number) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            height: 120,
                            borderRadius: 999,
                            backgroundColor: c,
                            border: "2px solid rgba(255,255,255,0.65)",
                            boxShadow: "0 18px 40px rgba(0,0,0,0.18)",
                          }}
                        />
                      ))}
                  </div>
                  <div
                    style={{
                      marginTop: 16,
                      fontSize: 18,
                      letterSpacing: "0.32em",
                      color: "rgba(17,17,17,0.45)",
                      fontWeight: 800,
                    }}
                  >
                    PERSONAL PALETTE
                  </div>
                </div>
              )}
            </div>

            {/* footer */}
            <div
              className="absolute left-0 right-0"
              style={{ bottom: 120, padding: "0 140px" }}
            >
              <div
                style={{
                  height: 1,
                  width: "100%",
                  background:
                    "linear-gradient(90deg, rgba(198,168,124,0) 0%, rgba(198,168,124,0.55) 50%, rgba(198,168,124,0) 100%)",
                  marginBottom: 28,
                }}
              />
              <div
                className="flex items-center justify-between"
                style={{ color: "rgba(17,17,17,0.55)" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Fingerprint size={22} color="rgba(198,168,124,0.95)" />
                  <span
                    style={{
                      fontWeight: 900,
                      letterSpacing: "0.18em",
                      fontSize: 18,
                    }}
                  >
                    AYNEH CERTIFIED
                  </span>
                </div>
                <div
                  style={{
                    fontWeight: 900,
                    letterSpacing: "0.28em",
                    fontSize: 18,
                  }}
                >
                  AYNEH.IR
                </div>
              </div>
            </div>

            {/* ornaments bottom */}
            <div
              className="absolute left-1/2 -translate-x-1/2"
              style={{ bottom: 70, width: 820, height: 120 }}
            >
              <svg
                width="820"
                height="120"
                viewBox="0 0 820 120"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M30 60 C60 95, 140 100, 200 60 C260 20, 320 20, 410 60 C500 100, 560 100, 620 60 C680 20, 760 25, 790 60"
                  fill="none"
                  stroke="rgba(198,168,124,0.45)"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
                <circle cx="410" cy="60" r="5" fill="rgba(198,168,124,0.70)" />
              </svg>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* --- 1. Standby & Camera --- */}
        {!result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="w-full max-w-4xl flex flex-col items-center gap-8 py-10"
          >
            {isLowLight && (
              <div className="w-full flex justify-center md:hidden">
                <div className="bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 px-4 py-2 rounded-full text-xs font-bold">
                  نور محیط کم است، رو به نور بایستید
                </div>
              </div>
            )}

            <div className="w-full flex flex-col gap-4">
              <div className="relative w-full aspect-video md:aspect-[16/9] bg-[#050505] rounded-[2rem] md:rounded-[3rem] overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.6)] group">
                {!webcamRunning && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[url('/images/grid.png')] bg-cover opacity-60 z-10 backdrop-blur-sm">
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="w-32 h-32 md:w-40 md:h-40 border-[1px] border-[#C6A87C]/50 rounded-full flex items-center justify-center relative"
                    >
                      <div className="absolute inset-0 border-[1px] border-white/10 rounded-full scale-125 border-dashed animate-[spin_20s_linear_infinite]" />
                      <ScanFace
                        size={48}
                        className="md:w-16 md:h-16 text-[#C6A87C]"
                      />
                    </motion.div>
                    <button
                      onClick={enableCam}
                      className="mt-8 md:mt-12 bg-white text-black px-8 md:px-12 py-4 md:py-5 rounded-full font-black text-base md:text-lg hover:bg-[#C6A87C] transition-all flex items-center gap-3 shadow-2xl hover:shadow-[0_0_40px_rgba(198,168,124,0.6)]"
                    >
                      <Aperture size={20} className="md:w-6 md:h-6" /> فعال‌سازی
                      آینه هوشمند
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
                      ? "scale-110 blur-xl opacity-0"
                      : "scale-100 blur-0 opacity-100"
                  }`}
                />

                {webcamRunning && (
                  <div className="hidden md:block absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(198,168,124,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(198,168,124,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

                    {isLowLight && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-yellow-500/20 text-yellow-300 border border-yellow-500/50 px-6 py-2 rounded-full flex items-center gap-2 backdrop-blur-md animate-pulse z-20">
                        <AlertTriangle size={16} />
                        <span className="text-xs font-bold">
                          نور محیط کم است، رو به نور بایستید
                        </span>
                      </div>
                    )}

                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[380px] border border-white/10 rounded-[45%] shadow-[0_0_100px_rgba(0,0,0,0.8)_inset]">
                      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#C6A87C] rounded-tl-2xl" />
                      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#C6A87C] rounded-tr-2xl" />
                      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#C6A87C] rounded-bl-2xl" />
                      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#C6A87C] rounded-br-2xl" />
                      {landmarks.length > 0 && (
                        <motion.div
                          initial={{ top: "0%" }}
                          animate={{ top: "100%" }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#C6A87C] to-transparent shadow-[0_0_20px_#C6A87C]"
                        />
                      )}
                    </div>

                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/80 backdrop-blur-xl px-8 py-3 rounded-full border border-white/10 shadow-2xl">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          landmarks.length > 0
                            ? "bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"
                            : "bg-red-500"
                        }`}
                      />
                      <span className="text-sm font-bold text-white tracking-wider">
                        {landmarks.length > 0
                          ? "چهره شناسایی شد"
                          : "در جستجوی چهره..."}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {webcamRunning && (
                <div className="md:hidden flex items-center justify-center gap-2 text-xs text-white">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      landmarks.length > 0 ? "bg-green-500" : "bg-red-500"
                    }`}
                  />
                  <span>
                    {landmarks.length > 0
                      ? "چهره شناسایی شد"
                      : "در جستجوی چهره..."}
                  </span>
                </div>
              )}
            </div>

            {webcamRunning && (
              <button
                onClick={captureAndAnalyze}
                disabled={landmarks.length === 0}
                className="w-full max-w-sm py-4 md:py-6 bg-gradient-to-r from-[#C6A87C] to-[#b0936a] text-black rounded-2xl md:rounded-3xl font-black text-lg md:text-xl hover:shadow-[0_0_50px_rgba(198,168,124,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale disabled:hover:translate-y-0"
              >
                <Sparkles size={22} className="md:w-6 md:h-6" /> شروع اسکن
                جادویی
              </button>
            )}
          </motion.div>
        )}

        {/* --- 2. Processing --- */}
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center fixed inset-0 bg-[#050505] z-50 px-6"
          >
            <div className="relative flex flex-col items-center">
              <div className="w-48 h-48 md:w-80 md:h-80 border-[1px] border-white/5 rounded-full flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[#C6A87C]/5 animate-pulse" />
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-t-2 border-[#C6A87C] rounded-full shadow-[0_0_30px_#C6A87C]"
                />
                <ScanFace
                  size={64}
                  className="md:w-24 md:h-24 text-white/80 animate-pulse"
                />
              </div>

              <div className="mt-6 md:mt-0 md:absolute md:-right-44 md:top-1/2 md:-translate-y-1/2 flex flex-col gap-4 text-xs md:text-sm font-bold text-[#C6A87C] text-right w-52">
                <motion.div
                  animate={{
                    opacity: scanStep >= 1 ? 1 : 0.2,
                    x: scanStep >= 1 ? 0 : -10,
                  }}
                  className="flex items-center gap-2"
                >
                  <Check size={14} /> آنالیز هندسه
                </motion.div>
                <motion.div
                  animate={{
                    opacity: scanStep >= 2 ? 1 : 0.2,
                    x: scanStep >= 2 ? 0 : -10,
                  }}
                  className="flex items-center gap-2"
                >
                  <Check size={14} /> تشخیص تناژ پوست
                </motion.div>
                <motion.div
                  animate={{
                    opacity: scanStep >= 3 ? 1 : 0.2,
                    x: scanStep >= 3 ? 0 : -10,
                  }}
                  className="flex items-center gap-2"
                >
                  <Check size={14} /> ساخت پالت رنگی
                </motion.div>
              </div>
            </div>

            <div className="mt-10 text-center space-y-3">
              <h3 className="text-2xl md:text-3xl font-black text-white tracking-[0.2em] animate-pulse">
                در حال پردازش...
              </h3>
              <p className="text-gray-500 text-xs md:text-sm font-mono">
                لطفاً تا پایان تولید شناسنامه زیبایی صبر کنید
              </p>
            </div>
          </motion.div>
        )}

        {/* --- 3. Result --- */}
        {result && !isAnalyzing && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="w-full max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 py-10"
          >
            {/* Magazine Card */}
            <div className="relative group perspective-1000 h-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-[#C6A87C] to-[#333] rounded-[3.5rem] blur opacity-40 group-hover:opacity-70 transition duration-1000 animate-pulse" />
              <div className="relative h-full bg-[#111] border border-white/10 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden flex flex-col shadow-2xl min-h-[520px]">
                <div className="absolute top-0 left-0 p-10 opacity-10">
                  <Fingerprint size={120} className="text-white" />
                </div>

                <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="p-8 md:p-10 relative z-10 flex-1 flex flex-col justify-center items-center text-center">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-white/10 to-black rounded-full flex items-center justify-center text-5xl md:text-7xl shadow-[0_0_60px_rgba(255,255,255,0.2)] mb-6 md:mb-8 border border-white/20 backdrop-blur-md"
                  >
                    {result.season ? SEASON_PALETTES[result.season].icon : "💎"}
                  </motion.div>

                  <span className="px-4 md:px-5 py-2 rounded-full border border-[#C6A87C] text-[#C6A87C] text-[0.6rem] md:text-xs font-black tracking-[0.2em] uppercase mb-4 md:mb-6 bg-[#C6A87C]/5">
                    Ayneh Certified
                  </span>

                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white font-serif leading-tight mb-4 md:mb-6 drop-shadow-xl">
                    {result.season
                      ? SEASON_PALETTES[result.season].title
                      : result.title}
                  </h1>

                  <p className="text-gray-400 leading-relaxed max-w-sm mx-auto text-sm md:text-base font-medium">
                    {result.season
                      ? SEASON_PALETTES[result.season].description
                      : result.description}
                  </p>

                  {result.season && (
                    <div className="mt-8 md:mt-12 flex gap-3 md:gap-4 p-3 bg-white/5 rounded-2xl md:rounded-3xl border border-white/5 backdrop-blur-sm shadow-inner justify-center flex-wrap">
                      {SEASON_PALETTES[result.season].colors.map(
                        (c: string, idx: number) => (
                          <div
                            key={idx}
                            className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/20 shadow-lg cursor-pointer hover:scale-125 transition-transform duration-300"
                            style={{ backgroundColor: c }}
                            title={c}
                          />
                        )
                      )}
                    </div>
                  )}
                </div>

                <div className="p-5 md:p-6 bg-[#080808] border-t border-white/5 grid grid-cols-2 gap-3 md:gap-4 relative z-20">
                  <button
                    onClick={handleSaveToProfile}
                    className={`py-3 md:py-4 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all ${
                      isSaved
                        ? "text-green-400 bg-green-900/20 border border-green-500/30"
                        : "text-white bg-white/5 hover:bg-white/10 border border-white/5"
                    }`}
                  >
                    {isSaved ? <Check size={18} /> : <UserCheck size={18} />}
                    {isSaved ? "ذخیره شد" : "ذخیره در پروفایل"}
                  </button>

                  <button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-[#C6A87C] text-black py-3 md:py-4 rounded-2xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 hover:bg-white transition-all shadow-[0_0_30px_rgba(198,168,124,0.3)] hover:shadow-[0_0_50px_rgba(198,168,124,0.5)] disabled:opacity-60"
                  >
                    {isDownloading ? (
                      <>
                        <Loader2 className="animate-spin" size={18} /> در حال
                        آماده‌سازی...
                      </>
                    ) : (
                      <>
                        <Download size={18} /> دانلود کارت
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Recommendations & CTA */}
            <div className="flex flex-col gap-6 h-full justify-between">
              {/* Hero Product Recommendation */}
              {(() => {
                const product = PRODUCTS.find((p) => p.id === result.productId);
                if (!product) return null;

                return (
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-black rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-8 lg:p-10 border border-white/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 md:gap-10 group shadow-2xl">
                    <div className="absolute left-0 top-0 w-2/3 h-full bg-[#C6A87C]/5 rounded-full blur-[120px] pointer-events-none group-hover:bg-[#C6A87C]/10 transition-all duration-1000" />
                    <div className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 bg-white rounded-[1.8rem] md:rounded-[2rem] p-2 rotate-3 group-hover:rotate-0 transition-all duration-700 shadow-[0_20px_50px_rgba(0,0,0,0.5)] shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover rounded-[1.4rem] md:rounded-[1.5rem]"
                      />
                    </div>

                    <div className="flex-1 text-center md:text-right z-10 w-full">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-3 md:mb-4">
                        <Sparkles className="text-[#C6A87C]" size={18} />
                        <span className="text-[#C6A87C] text-xs font-black uppercase tracking-[0.2em]">
                          پیشنهاد هوشمند
                        </span>
                      </div>

                      <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                        {product.name}
                      </h2>

                      <p className="text-gray-400 text-xs md:text-sm mb-4 md:mb-6 leading-relaxed">
                        این محصول با توجه به پالت رنگی{" "}
                        {result.season
                          ? SEASON_PALETTES[result.season].title
                          : "شما"}{" "}
                        انتخاب شده است.
                      </p>

                      <div className="flex gap-4 justify-center md:justify-start">
                        <button
                          onClick={() => handleAddToCart(product.id)}
                          className={`px-6 md:px-8 py-3 rounded-xl font-bold transition-all shadow-lg text-xs md:text-sm flex items-center justify-center gap-2 ${
                            addedId === product.id
                              ? "bg-green-600 text-white"
                              : "bg-white text-black hover:bg-[#C6A87C] hover:scale-105"
                          }`}
                        >
                          {addedId === product.id ? (
                            <>
                              <Check size={16} /> به سبد اضافه شد
                            </>
                          ) : (
                            `خرید - ${product.price.toLocaleString()} تومان`
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Advice Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-1">
                <div className="bg-[#111] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/10 flex flex-col justify-between hover:border-[#C6A87C]/50 transition-colors cursor-default group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#C6A87C]/10 rounded-xl flex items-center justify-center text-[#C6A87C] mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                    <Scissors size={22} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-gray-500 text-[0.6rem] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-2">
                      مدل مو
                    </h4>
                    <p className="text-base md:text-lg text-white font-medium">
                      {result.hair}
                    </p>
                  </div>
                </div>

                <div className="bg-[#111] rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-8 border border-white/10 flex flex-col justify-between hover:border-[#C6A87C]/50 transition-colors cursor-default group">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#C6A87C]/10 rounded-xl flex items-center justify-center text-[#C6A87C] mb-3 md:mb-4 group-hover:scale-110 transition-transform">
                    <Palette size={22} className="md:w-6 md:h-6" />
                  </div>
                  <div>
                    <h4 className="text-gray-500 text-[0.6rem] md:text-xs font-bold uppercase tracking-widest mb-1 md:mb-2">
                      سبک میکاپ
                    </h4>
                    <p className="text-base md:text-lg text-white font-medium">
                      {result.makeup}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shop link */}
              {result.season && (
                <Link
                  href="/shop"
                  className="w-full py-4 md:py-5 bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2rem] text-white hover:bg-[#C6A87C] hover:text-black transition-all flex items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-bold tracking-wide group"
                >
                  مشاهده کالکشن {SEASON_PALETTES[result.season].title}
                  <ArrowLeft
                    size={18}
                    className="group-hover:-translate-x-1 transition-transform"
                  />
                </Link>
              )}

              <button
                onClick={handleReset}
                className="w-full py-4 md:py-5 rounded-[1.5rem] md:rounded-[2rem] border border-white/10 text-xs md:text-sm text-gray-400 md:text-gray-500 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 md:gap-3 font-bold tracking-wide"
              >
                <RefreshCw size={18} /> انجام تست مجدد
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
