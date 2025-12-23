"use client";

import { useState, useRef, useCallback } from "react";
import { GripVertical, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function BeforeAfterSlider() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = useCallback((clientX: number) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      let newX = clientX - rect.left;
      newX = Math.max(0, Math.min(newX, rect.width));
      const percentage = (newX / rect.width) * 100;
      setSliderPosition(percentage);
    }
  }, []);

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6 text-center mb-16 relative z-10">
         <span className="text-[#C6A87C] text-xs tracking-[0.3em] uppercase mb-4 block font-bold">Transformation</span>
         <h2 className="text-4xl md:text-6xl font-black text-white font-serif">
            جادوی تغییر در آینه
         </h2>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <div 
          ref={containerRef}
          onMouseMove={(e) => isDragging && handleMove(e.clientX)}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden select-none cursor-grab active:cursor-grabbing shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
        >
          
          {/* تصویر Before (لایه زیرین) */}
          <div className="absolute inset-0">
            <img 
              src="/images/service-haircut.png" 
              alt="Before"
              className="w-full h-full object-cover grayscale-[0.5]"
            />
            <div className="absolute top-6 left-6 bg-black/50 backdrop-blur-md px-4 py-1 rounded-full border border-white/10 text-white text-xs tracking-widest uppercase">
                Before
            </div>
          </div>

          {/* تصویر After (لایه رویی با برش داینامیک) */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
          >
            <img 
              src="/images/service-color.png" 
              alt="After"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 right-6 bg-[#C6A87C] px-4 py-1 rounded-full text-black text-xs font-bold tracking-widest uppercase">
                After
            </div>
          </div>

          {/* خط جداکننده و هندل درگ */}
          <div 
            className="absolute top-0 bottom-0 z-20 w-1 bg-white/20 backdrop-blur-sm pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-ew-resize border-4 border-[#050505]">
                <GripVertical size={20} className="text-black" />
            </div>
          </div>
        </div>
        
        <div className="mt-8 flex justify-center items-center gap-4 text-gray-500 text-sm">
            <span className="w-8 h-[1px] bg-white/10"></span>
            برای مقایسه، نوار وسط را بکشید
            <span className="w-8 h-[1px] bg-white/10"></span>
        </div>
      </div>

      {/* دکوراسیون پس‌زمینه */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-5 pointer-events-none">
          <Sparkles size={400} />
      </div>
    </section>
  );
}