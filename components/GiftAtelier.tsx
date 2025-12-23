"use client";

import { useState, useRef } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  Download,
  Share2,
  Check,
  Gift,
  Sparkles,
  Loader2,
  Scissors,
  X,
} from "lucide-react";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";

const THEMES = [
  {
    id: "black",
    name: "مشکی کلاسیک",
    bg: "bg-[#0f0f0f]",
    text: "text-white",
    accent: "text-[#C6A87C]",
    border: "border-white/10",
    printBg: "#0f0f0f",
    printText: "#ffffff", // ✅ رنگ سفید صریح
    printAccent: "#C6A87C",
    printBorder: "rgba(255,255,255,0.1)",
  },
  {
    id: "gold",
    name: "طلایی رویال",
    bg: "bg-gradient-to-br from-[#C6A87C] to-[#8A6C3E]",
    text: "text-black",
    accent: "text-white",
    border: "border-black/10",
    printBg: "#C6A87C",
    printText: "#000000", // ✅ رنگ سیاه صریح
    printAccent: "#ffffff",
    printBorder: "rgba(0,0,0,0.1)",
  },
  {
    id: "white",
    name: "سفید مینیمال",
    bg: "bg-[#F5F5F0]",
    text: "text-black",
    accent: "text-[#C6A87C]",
    border: "border-black/5",
    printBg: "#F5F5F0",
    printText: "#000000", // ✅ رنگ سیاه صریح
    printAccent: "#C6A87C",
    printBorder: "rgba(0,0,0,0.05)",
  },
];

const AMOUNTS = ["۱.۰۰۰.۰۰۰", "۲.۰۰۰.۰۰۰", "۵.۰۰۰.۰۰۰", "۱۰.۰۰۰.۰۰۰"];

// --- 1. طرح کارت (نسخه نمایشی) ---
const GiftCardDisplay = ({ theme, amount, recipient, message }: any) => (
  <div
    className={`relative w-full aspect-[1.6/1] ${theme.bg} rounded-[1.5rem] p-6 md:p-8 flex flex-col justify-between overflow-hidden border-2 ${theme.border} shadow-2xl`}
  >
    <div className="flex justify-between items-start z-10">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-current flex items-center justify-center ${theme.text}`}
        >
          <Gift size={20} />
        </div>
        <div>
          <h3
            className={`font-bold text-lg md:text-xl leading-none ${theme.text} font-serif`}
          >
            GIFT CARD
          </h3>
          <p
            className={`text-[9px] md:text-[10px] opacity-60 font-sans tracking-[0.2em] mt-1 ${theme.text}`}
          >
            AYNEH BEAUTY
          </p>
        </div>
      </div>
      <div
        className={`text-xl md:text-3xl font-black font-mono ${theme.accent}`}
      >
        {amount}
      </div>
    </div>
    <div className="z-10 py-2">
      <p
        className={`text-2xl md:text-4xl font-sans font-bold mb-2 ${theme.text}`}
      >
        {recipient || "نام گیرنده"}
      </p>
      <p
        className={`text-xs md:text-sm font-light leading-relaxed opacity-80 ${theme.text} line-clamp-2`}
      >
        {message || "زیبایی، هدیه‌ای است که هرگز فراموش نمی‌شود..."}
      </p>
    </div>
    <div className="flex justify-between items-end z-10 border-t border-current/10 pt-4 md:pt-6">
      <div>
        <span
          className={`text-[8px] md:text-[10px] uppercase tracking-widest opacity-50 block mb-1 ${theme.text}`}
        >
          Valid Until
        </span>
        <span className={`font-mono text-sm md:text-base ${theme.text}`}>
          Dec 2025
        </span>
      </div>
      <div
        className={`w-10 h-6 md:w-12 md:h-8 rounded border border-current/20 flex items-center justify-center opacity-50 ${theme.text}`}
      >
        <Sparkles size={14} />
      </div>
    </div>
    <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
      <Sparkles size={150} className={theme.text} />
    </div>
  </div>
);

// --- 2. طرح A4 برای چاپ (با استایل‌های خطی و امن) ---
const PrintLayout = ({ themeId, amount, recipient, message }: any) => {
  const theme = THEMES.find((t) => t.id === themeId)!;
  const style = theme;

  // رنگ متنی که باید در کارت چاپ شود (مشکی/سفید)
  const cardTextColor = style.printText;
  const cardAccentColor = style.printAccent;

  return (
    <div
      className="relative flex flex-col items-center justify-between font-sans overflow-hidden box-border"
      style={{
        width: "794px",
        height: "1123px",
        backgroundColor: "#050505",
        padding: "60px",
        color: "white",
      }}
    >
      {/* قاب دور صفحه */}
      <div
        style={{
          position: "absolute",
          inset: "20px",
          border: "2px solid #C6A87C",
          borderRadius: "30px",
          opacity: 0.5,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "30px",
          border: "1px dashed rgba(255,255,255,0.1)",
          borderRadius: "24px",
          pointerEvents: "none",
        }}
      />

      {/* هدر */}
      <div style={{ textAlign: "center", marginTop: "60px", zIndex: 10 }}>
        <div
          style={{
            width: "100px",
            height: "100px",
            backgroundColor: "#C6A87C",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
            boxShadow: "0 0 40px rgba(198,168,124,0.3)",
          }}
        >
          <Scissors size={48} color="#000000" strokeWidth={1.5} />
        </div>
        <h1
          style={{
            fontSize: "64px",
            fontWeight: "900",
            letterSpacing: "-2px",
            marginBottom: "8px",
            color: "white",
          }}
        >
          AYNEH
        </h1>
        <p
          style={{
            color: "#C6A87C",
            fontSize: "14px",
            letterSpacing: "8px",
            textTransform: "uppercase",
          }}
        >
          Luxury Beauty Lounge
        </p>
      </div>

      {/* کارت هدیه در مرکز (با رنگ صریح) */}
      <div className="w-[85%] aspect-[1.6/1] z-10 transform scale-110">
        <div
          style={{
            width: "100%",
            height: "100%",
            background: style.printBg.includes("gradient")
              ? "linear-gradient(135deg, #C6A87C, #A6885C)"
              : style.printBg, // حل مشکل گرادینت
            color: cardTextColor, // رنگ اصلی متن کارت
            borderRadius: "30px",
            padding: "40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: `4px solid ${style.printBorder}`,
          }}
        >
          {/* هدر کارت */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  border: "2px solid currentColor",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Gift size={30} style={{ color: cardTextColor }} />
              </div>
              <div>
                <h3
                  style={{
                    fontWeight: "bold",
                    fontSize: "28px",
                    lineHeight: 1,
                    color: cardTextColor,
                  }}
                >
                  GIFT CARD
                </h3>
                <p
                  style={{
                    fontSize: "12px",
                    opacity: 0.6,
                    marginTop: "5px",
                    letterSpacing: "2px",
                    color: cardTextColor,
                  }}
                >
                  AYNEH CLUB
                </p>
              </div>
            </div>
            <div
              style={{
                fontSize: "36px",
                fontWeight: "900",
                fontFamily: "monospace",
                color: cardAccentColor,
              }}
            >
              {amount}
            </div>
          </div>

          {/* بدنه کارت */}
          <div style={{ padding: "20px 0" }}>
            <p
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                marginBottom: "15px",
                color: cardTextColor,
              }}
            >
              {recipient}
            </p>
            <p
              style={{
                fontSize: "20px",
                opacity: 0.8,
                lineHeight: 1.6,
                color: cardTextColor,
              }}
            >
              {message}
            </p>
          </div>

          {/* فوتر کارت */}
          <div
            style={{
              borderTop: "1px solid rgba(255,255,255,0.2)",
              paddingTop: "20px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              color: cardTextColor,
            }}
          >
            <div>
              <p
                style={{
                  fontSize: "12px",
                  opacity: 0.6,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                }}
              >
                VALID UNTIL
              </p>
              <p style={{ fontSize: "24px", fontFamily: "monospace" }}>
                Dec 2025
              </p>
            </div>
            <Sparkles size={40} style={{ opacity: 0.5 }} />
          </div>
        </div>
      </div>

      {/* فوتر و قوانین */}
      <div className="w-full max-w-2xl text-center space-y-8 mb-16 z-10">
        <div
          style={{
            height: "1px",
            width: "100%",
            backgroundColor: "rgba(255,255,255,0.2)",
          }}
        />
        <div className="space-y-3">
          <h4
            style={{
              color: "#C6A87C",
              fontWeight: "bold",
              fontSize: "16px",
              letterSpacing: "2px",
              marginBottom: "10px",
            }}
          >
            شرایط و قوانین
          </h4>
          <p
            style={{
              color: "#9CA3AF",
              fontSize: "14px",
              lineHeight: "2",
              fontWeight: "300",
            }}
          >
            این کارت هدیه تا تاریخ درج شده دارای اعتبار است و پس از آن منقضی
            می‌گردد. <br />
            لطفاً جهت رزرو وقت با کد درج شده، حداقل ۳ روز قبل با سالن تماس
            بگیرید.
          </p>
        </div>
        <div className="pt-8">
          <p
            style={{
              color: "white",
              fontSize: "24px",
              fontWeight: "bold",
              letterSpacing: "2px",
              fontFamily: "monospace",
            }}
          >
            +98 917 000 0000
          </p>
          <p style={{ color: "#666", fontSize: "12px", marginTop: "5px" }}>
            Shiraz, Ghasrodasht St, Ayneh Lounge
          </p>
        </div>
      </div>
    </div>
  );
};

export default function GiftAtelier() {
  const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
  const [amount, setAmount] = useState(AMOUNTS[1]);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);

  const printRef = useRef<HTMLDivElement>(null);

  // انیمیشن کارت
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });
  const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = (e.clientX - rect.left) * 32.5;
    const mouseY = (e.clientY - rect.top) * 32.5;
    const rX = (mouseY / height - 32.5 / 2) * -1;
    const rY = mouseX / width - 32.5 / 2;
    x.set(rX);
    y.set(rY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const handleSendGift = () => {
    const text = `سلام! 🎁\nیک کارت هدیه از طرف "${
      recipient || "دوست شما"
    }" برای شما طراحی شده.\nمبلغ: ${amount} تومان\n\nلطفاً فایل پیوست را مشاهده کنید.`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  // 🖨️ تابع دانلود PDF
  const handleDownloadPDF = async () => {
    setIsDownloading(true);

    setTimeout(async () => {
      try {
        const element = document.getElementById("print-layout");
        if (!element) throw new Error("قالب چاپ پیدا نشد!");

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#080808",
          logging: false,
          width: 794,
          height: 1123,
          scrollX: 0,
          scrollY: 0,
        });

        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
        });

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Ayneh-Gift-${recipient || "Card"}.pdf`);
      } catch (error: any) {
        console.error("Download Error:", error);
        alert(`دانلود ناموفق بود: ${error.message}`);
      } finally {
        setIsDownloading(false);
      }
    }, 1000);
  };

  return (
    <section className="py-12 md:py-24 px-6 relative overflow-hidden font-sans">
      <div className="absolute inset-0 opacity-[0.03] bg-[url('/images/noise.png')] pointer-events-none" />

      {/* ✅ مودال چاپ */}
      {isDownloading && (
        <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4">
          <div className="relative transform scale-[0.4] md:scale-50 origin-top">
            <div className="absolute -top-24 left-0 w-full text-center text-white flex flex-col items-center justify-center gap-4 animate-pulse text-2xl">
              <Loader2 size={32} className="animate-spin text-brand-gold" />
              <span className="text-xl font-bold">
                در حال تولید کارت هدیه...
              </span>
            </div>

            <div id="print-layout" ref={printRef}>
              <PrintLayout
                themeId={selectedTheme.id}
                amount={amount}
                recipient={recipient}
                message={message}
              />
            </div>
          </div>
        </div>
      )}

      {/* بقیه صفحه */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
        {/* پنل تنظیمات */}
        <div className="order-2 lg:order-1 space-y-10">
          <div>
            <span className="text-brand-gold text-xs tracking-[0.3em] uppercase mb-4 block font-bold">
              Gift Atelier
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              هدیه‌ای از جنس{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-white">
                زیبایی
              </span>
            </h2>
            <p className="text-gray-400 text-lg font-light leading-relaxed">
              یک کارت هدیه دیجیتال و شخصی‌سازی شده طراحی کنید.
            </p>
          </div>

          <div className="space-y-6 bg-white/5 border border-white/5 p-8 rounded-[2rem]">
            {/* انتخاب‌ها */}
            <div>
              <label className="text-xs text-gray-500 block mb-3 font-bold">
                انتخاب استایل
              </label>
              <div className="flex gap-3">
                {THEMES.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center ${
                      theme.bg
                    } ${
                      selectedTheme.id === theme.id
                        ? "border-brand-gold scale-110"
                        : "border-transparent opacity-50 hover:opacity-100"
                    }`}
                  >
                    {selectedTheme.id === theme.id && (
                      <Check size={16} className={theme.text} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs text-gray-500 block mb-3 font-bold">
                مبلغ (تومان)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setAmount(amt)}
                    className={`py-2 px-3 rounded-xl text-sm font-mono border transition-all ${
                      amount === amt
                        ? "bg-brand-gold text-black border-brand-gold font-bold"
                        : "bg-black/20 border-white/10 text-gray-400 hover:border-white/30"
                    }`}
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="نام گیرنده (مثلاً سارا)"
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-brand-gold outline-none"
              />
              <textarea
                rows={2}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="پیام محبت‌آمیز شما..."
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white focus:border-brand-gold outline-none resize-none"
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button
                onClick={handleSendGift}
                className="flex-1 bg-white/5 text-white border border-white/10 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-colors"
              >
                <Share2 size={20} /> اشتراک‌گذاری
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex-[2] bg-brand-gold text-black py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-white transition-colors disabled:opacity-70"
              >
                {isDownloading ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <>
                    <Download size={20} /> دانلود PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* پیش‌نمایش کارت */}
        <div className="order-1 lg:order-2 flex justify-center perspective-1000">
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: "preserve-3d", transform }}
            className="w-full max-w-md aspect-[1.6/1] shadow-2xl cursor-grab active:cursor-grabbing"
          >
            <GiftCardDisplay
              theme={selectedTheme}
              amount={amount}
              recipient={recipient}
              message={message}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
