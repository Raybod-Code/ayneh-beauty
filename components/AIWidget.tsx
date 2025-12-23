"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanFace, X, Sparkles, ChevronRight, Camera, Palette } from "lucide-react";
import  FaceAnalyzer  from "./FaceAnalyzer";
import { SmartQuiz } from "./SmartQuiz";

export default function AIWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'menu' | 'scan' | 'quiz'>('menu');

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => setMode('menu'), 300);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-[90] w-14 h-14 md:w-16 md:h-16 bg-[#C6A87C] text-black rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(198,168,124,0.6)] border-2 border-white/20 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-20"></div>
        <ScanFace size={28} strokeWidth={2} className="relative z-10 group-hover:rotate-12 transition-transform" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              // 👇 تغییر مهم: عرض مودال داینامیک شد
              className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111] border border-white/10 rounded-[2rem] shadow-2xl z-[101] overflow-hidden flex flex-col transition-all duration-500
                ${mode === 'menu' ? 'w-[90%] max-w-sm' : 'w-[95%] max-w-2xl h-[80vh]'} 
              `}
            >
              <div className="flex justify-between items-center p-4 md:p-5 border-b border-white/10 bg-[#1a1a1a] shrink-0">
                <div className="flex items-center gap-2 text-[#C6A87C]">
                  <Sparkles size={18} />
                  <span className="font-bold text-xs md:text-sm tracking-wider uppercase">
                    {mode === 'menu' ? 'دستیار هوشمند' : mode === 'scan' ? 'آنالیز چهره' : 'آزمون استایل'}
                  </span>
                </div>
                <button 
                  onClick={handleClose}
                  className="p-2 bg-white/5 rounded-full hover:bg-red-500/20 hover:text-red-500 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar relative">
                
                {mode === 'menu' && (
                  <div className="space-y-3">
                    <div className="text-center mb-6">
                      <h2 className="text-xl font-bold text-white mb-2">چطور کمکت کنم؟</h2>
                      <p className="text-gray-400 text-xs leading-relaxed">برای دریافت مشاوره تخصصی، یکی از ابزارهای زیر را انتخاب کنید.</p>
                    </div>

                    <button
                      onClick={() => setMode('scan')}
                      className="w-full bg-[#1a1a1a] hover:bg-[#222] border border-white/5 p-4 rounded-xl flex items-center gap-4 transition-all group text-right"
                    >
                      <div className="w-10 h-10 bg-[#000] rounded-full flex items-center justify-center text-[#C6A87C] border border-white/10 group-hover:border-[#C6A87C]">
                        <Camera size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-white">آنالیز چهره</h3>
                        <p className="text-[10px] text-gray-400 mt-1">پیشنهاد مدل مو بر اساس فرم صورت</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-600 group-hover:text-white" />
                    </button>

                    <button
                      onClick={() => setMode('quiz')}
                      className="w-full bg-[#1a1a1a] hover:bg-[#222] border border-white/5 p-4 rounded-xl flex items-center gap-4 transition-all group text-right"
                    >
                      <div className="w-10 h-10 bg-[#000] rounded-full flex items-center justify-center text-[#C6A87C] border border-white/10 group-hover:border-[#C6A87C]">
                        <Palette size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-white">آزمون استایل</h3>
                        <p className="text-[10px] text-gray-400 mt-1">شناخت سلیقه و پیشنهاد رنگ مو</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-600 group-hover:text-white" />
                    </button>
                  </div>
                )}

                {(mode === 'scan' || mode === 'quiz') && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                    <button 
                      onClick={() => setMode('menu')} 
                      className="mb-4 text-xs text-gray-500 hover:text-white flex items-center gap-1 w-fit px-3 py-1 rounded-full bg-white/5"
                    >
                      <ChevronRight size={14} className="rotate-180" /> بازگشت به منو
                    </button>
                    
                    <div className="flex-1 overflow-y-auto">
                      {mode === 'scan' ? <FaceAnalyzer /> : <SmartQuiz />}
                    </div>
                  </motion.div>
                )}

              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}