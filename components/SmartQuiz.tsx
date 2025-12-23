"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, Scissors, PenTool, 
  Wind, CircleDashed, CheckCircle2, 
  Moon, Sun, 
  Minimize2, Maximize2, Brush, 
  Fingerprint, ShieldCheck 
} from "lucide-react";
import Image from "next/image";
import { QUIZ_DATA, RECOMMENDATIONS, RecommendationType } from "@/app/constants/quiz";

// مپ کردن آیکون‌ها
const ICON_MAP: Record<string, any> = {
  dry: Wind, boring: CircleDashed, healthy: CheckCircle2,
  sleep: Moon, style: Sun, break: Minimize2,
  ok: Fingerprint, strong: ShieldCheck, long: Maximize2,
  minimal: CircleDashed, art: Brush,
};

type Category = "hair" | "nail" | null;
type Scores = { [key: string]: number };

export function SmartQuiz() { // نیازی به onClose نیست چون در ویجت هندل میشه
  const [category, setCategory] = useState<Category>(null);
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Scores>({});
  const [result, setResult] = useState<RecommendationType | null>(null);

  const handleCategorySelect = (cat: "hair" | "nail") => {
    setCategory(cat);
    setStep(0);
    setScores({});
  };

  const handleOptionClick = (optionScores: Partial<Scores>) => {
    if (!category) return;

    const newScores = { ...scores };
    Object.keys(optionScores).forEach((key) => {
      newScores[key] = (newScores[key] || 0) + (optionScores[key] || 0);
    });
    setScores(newScores);

    const questions = QUIZ_DATA[category];
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      calculateResult(newScores);
    }
  };

  const calculateResult = (finalScores: Scores) => {
    // پیدا کردن بیشترین امتیاز (لاجیک ساده)
    const keys = Object.keys(finalScores);
    let winnerKey = "default";
    
    if (keys.length > 0) {
       winnerKey = keys.reduce((a, b) => finalScores[a] > finalScores[b] ? a : b);
    }

    setResult(RECOMMENDATIONS[winnerKey] || RECOMMENDATIONS["default"]);
  };

  const currentQuestions = category ? QUIZ_DATA[category] : [];

  return (
    // 👇 کانتینر اصلی اصلاح شده (دیگه فیکس نیست)
    <div className="w-full h-full flex flex-col items-center p-2 text-white overflow-y-auto custom-scrollbar pb-20">
      
      <div className="w-full max-w-2xl relative">
        
        {/* --- مرحله انتخاب دسته --- */}
        {!category && (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center space-y-8 mt-4"
          >
            <h2 className="text-2xl md:text-3xl font-black mb-4">
              در کدام بخش نیاز به <span className="text-[#C6A87C]">مشاوره</span> دارید؟
            </h2>
            <div className="flex flex-col gap-4">
              <button 
                onClick={() => handleCategorySelect("hair")}
                className="group flex items-center gap-6 p-6 rounded-2xl border border-white/10 hover:border-[#C6A87C] bg-white/5 hover:bg-white/10 transition-all w-full"
              >
                <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-[#C6A87C] group-hover:scale-110 transition-transform">
                    <Scissors size={32} />
                </div>
                <div className="text-right">
                    <span className="text-xl font-bold block text-white">خدمات مو</span>
                    <span className="text-xs text-gray-400">رنگ، کراتین، کوتاهی</span>
                </div>
              </button>
              
              <button 
                onClick={() => handleCategorySelect("nail")}
                className="group flex items-center gap-6 p-6 rounded-2xl border border-white/10 hover:border-[#C6A87C] bg-white/5 hover:bg-white/10 transition-all w-full"
              >
                <div className="w-16 h-16 rounded-full bg-black flex items-center justify-center text-[#C6A87C] group-hover:scale-110 transition-transform">
                    <PenTool size={32} />
                </div>
                <div className="text-right">
                    <span className="text-xl font-bold block text-white">خدمات ناخن</span>
                    <span className="text-xs text-gray-400">کاشت، ژلیش، طراحی</span>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* --- مرحله سوالات --- */}
        {category && !result && currentQuestions[step] && (
          <div className="flex flex-col items-center text-center w-full">
            {/* نوار پیشرفت */}
            <div className="w-full h-1 bg-white/10 rounded-full mb-8 overflow-hidden">
              <motion.div 
                className="h-full bg-[#C6A87C]"
                initial={{ width: 0 }}
                animate={{ width: `${((step + 1) / currentQuestions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${category}-${step}`}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="w-full"
              >
                <span className="text-[#C6A87C] text-xs tracking-[0.2em] uppercase mb-4 block">
                  سوال {step + 1} از {currentQuestions.length}
                </span>
                <h2 className="text-xl md:text-2xl font-bold text-white mb-8 leading-relaxed">
                  {currentQuestions[step].question}
                </h2>

                <div className="grid grid-cols-1 gap-3">
                  {currentQuestions[step].options.map((option: any, idx: number) => {
                    const IconComponent = ICON_MAP[option.icon] || Sparkles;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => handleOptionClick(option.score)}
                        className="group flex items-center justify-between p-4 rounded-xl border border-white/10 hover:border-[#C6A87C] hover:bg-white/[0.05] transition-all text-right"
                      >
                        <span className="text-sm md:text-base text-gray-300 group-hover:text-white transition-colors font-medium">
                          {option.text}
                        </span>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#C6A87C]/70 group-hover:text-[#C6A87C] group-hover:scale-110 transition-all">
                           <IconComponent size={20} />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        {/* --- مرحله نتیجه --- */}
        {result && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#1a1a1a] border border-white/10 rounded-3xl overflow-hidden shadow-2xl w-full"
          >
            <div className="relative h-48 w-full">
                <Image 
                  src={result.image} 
                  alt={result.title} 
                  fill 
                  className="object-cover opacity-60" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent"></div>
                <div className="absolute bottom-4 right-4 left-4">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#C6A87C] text-black text-[10px] font-bold tracking-widest uppercase mb-2">
                        <Sparkles size={12} /> پیشنهاد هوشمند
                    </div>
                    <h2 className="text-2xl font-black text-white">{result.title}</h2>
                </div>
            </div>
            
            <div className="p-6 text-right space-y-6">
              <p className="text-gray-300 text-sm leading-relaxed">
                {result.description}
              </p>

              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <div>
                  <span className="text-gray-500 text-[10px] uppercase tracking-widest block">هزینه حدودی</span>
                  <span className="text-lg font-bold text-[#C6A87C] font-mono">{result.priceRange}</span>
                </div>
                
                <button 
                  onClick={() => window.open(`https://wa.me/989170000000?text=سلام، آزمون استایل رو انجام دادم و "${result.title}" بهم پیشنهاد شد.`, "_blank")}
                  className="bg-[#C6A87C] text-black px-6 py-2 rounded-xl font-bold text-sm hover:bg-white transition-colors shadow-lg"
                >
                  مشاوره رایگان
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}