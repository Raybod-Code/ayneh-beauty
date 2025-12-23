"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";
import LuxuryButton from "@/components/LuxuryButton";

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // پارالاکس عکس و متن
  const yText = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const yImage = useTransform(scrollYProgress, [0, 1], [-50, 50]);
  const rotateImage = useTransform(scrollYProgress, [0.2, 0.8], [5, -5]);

  return (
    <section
      ref={containerRef}
      className="py-32 md:py-48 bg-[#080808] relative overflow-hidden"
    >
      {/* پترن پس‌زمینه (نویز یا خطوط) */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/noise.png')] mix-blend-overlay"></div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        {/* ستون متن (راست) - در فارسی راست میشه */}
        <motion.div
          style={{ y: yText }}
          className="order-2 lg:order-1 text-right relative z-10"
        >
          <span className="text-brand-gold text-xs tracking-[0.4em] uppercase font-bold mb-6 block">
            The Vision
          </span>

          <h2
            className="text-5xl md:text-7xl font-black text-white mb-10 leading-[1.1]"
            style={{ fontFamily: "var(--font-doran)" }}
          >
            داستانِ <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-white font-serif italic font-light px-2">
              یک رویا
            </span>
          </h2>

          <div className="space-y-6 text-gray-400 text-lg font-light leading-loose pl-0 lg:pl-20">
            <p>
              "آیـنـه" فقط یک سالن زیبایی نیست؛ پناهگاهی است برای بازیافتن خودِ
              واقعی‌تان. ما معتقدیم زیبایی، لایه‌ای نیست که اضافه می‌شود، بلکه
              حقیقتی است که باید آشکار شود.
            </p>
            <p>
              در اینجا، زمان می‌ایستد. صدای قیچی با موسیقی جاز می‌آمیزد و هر
              خدمت، به یک مراسمِ آیینی تبدیل می‌شود. ما اینجا هستیم تا امضای
              شخصی شما را خلق کنیم، نه کپی‌برداری از ترندهای گذرا.
            </p>
          </div>

          <div className="mt-12 flex gap-6 items-center">
            <div className="flex -space-x-4 flex-row-reverse space-x-reverse">
              {/* آواتارهای تیم (دکوری) */}
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="w-12 h-12 rounded-full border-2 border-[#080808] bg-gray-800 relative overflow-hidden"
                >
                  <Image
                    src={`/images/service-haircut.png`}
                    alt="Team"
                    fill
                    className="object-cover grayscale"
                  />
                </div>
              ))}
            </div>
            <div className="h-[1px] w-20 bg-white/20"></div>
            <span className="text-xs uppercase tracking-widest text-white/50">
              Expert Team
            </span>
          </div>
        </motion.div>

        {/* ستون عکس (چپ) */}
        <div className="order-1 lg:order-2 relative flex justify-center lg:justify-end">
          <motion.div
            style={{ y: yImage, rotate: rotateImage }}
            className="relative w-full max-w-[350px] h-[450px] md:max-w-[500px] md:h-[650px]"
          >
            {/* قاب عکس دفرمه (Organic Shape) */}
            <div className="absolute inset-0 border border-brand-gold/30 rounded-[100px_0_100px_0] translate-x-4 translate-y-4 z-0 transition-transform duration-1000 group-hover:translate-x-6 group-hover:translate-y-6"></div>

            <div className="absolute inset-0 rounded-[100px_0_100px_0] overflow-hidden z-10 grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl">
              <Image
                src="/images/service-bridal.png" // عکس پرتره هنری
                alt="Founder"
                fill
                className="object-cover"
              />

              {/* لایه گرادینت روی عکس */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
            </div>

            {/* بج/نشان چرخان */}
            <div className="absolute -bottom-10 -left-10 md:-left-16 z-20">
              <div className="w-32 h-32 md:w-40 md:h-40 bg-black rounded-full flex items-center justify-center border border-white/10 backdrop-blur-md animate-spin-slow">
                <svg
                  viewBox="0 0 100 100"
                  className="w-24 h-24 md:w-32 md:h-32 fill-white/80"
                >
                  <path
                    id="curve"
                    d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                    fill="transparent"
                  />
                  <text className="text-[12px] font-bold uppercase tracking-[0.25em]">
                    <textPath href="#curve">
                      • Since 2025 • Premium Quality
                    </textPath>
                  </text>
                </svg>
                <span className="absolute text-brand-gold text-2xl font-serif">
                  A
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
