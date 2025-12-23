"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const services = [
  { id: 1, title: "Haircut", sub: "Signature Cuts", img: "/images/service-haircut.png", col: "md:col-span-1 md:row-span-2" },
  { id: 2, title: "Color", sub: "Balayage & Lights", img: "/images/service-color.png", col: "md:col-span-2 md:row-span-1" },
  { id: 3, title: "Therapy", sub: "Scalp & Hair Spa", img: "/images/service-spa.png", col: "md:col-span-1 md:row-span-1" },
  { id: 4, title: "Bridal", sub: "Royal Package", img: "/images/service-bridal.png", col: "md:col-span-1 md:row-span-1" },
];

export default function BentoServices() {
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  };

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-16">
        <h2 className="text-4xl md:text-6xl font-serif text-white">خدماتِ ما</h2>
        <span className="text-brand-gold text-xs tracking-widest uppercase border-b border-brand-gold pb-1">
          مشاهده منوی کامل
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
        {services.map((s) => (
          <motion.div
            key={s.id}
            className={`${s.col} group relative rounded-[2rem] overflow-hidden border border-white/10 bg-[#111] hover:border-brand-gold/30 transition-colors duration-500`}
            onMouseMove={handleMouseMove}
            whileHover={{ scale: 0.99 }}
          >
            {/* Spotlight Glow Effect */}
            <div 
              className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30"
              style={{ background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(198, 168, 124, 0.15), transparent 40%)` }}
            />

            <Image 
              src={s.img} 
              alt={s.title} 
              fill 
              className="object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-700 grayscale group-hover:grayscale-0"
            />
            
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90" />

            <div className="absolute bottom-0 left-0 w-full p-8 z-20 flex justify-between items-end">
              <div>
                <h3 className="text-3xl font-serif text-white mb-1">{s.title}</h3>
                <p className="text-gray-400 text-sm">{s.sub}</p>
              </div>
              <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-black group-hover:border-brand-gold transition-all">
                <ArrowUpRight size={18} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}