"use client";

import { motion, useTransform, useScroll } from "framer-motion";
import { useRef } from "react";

const CARDS = [
  {
    id: 1,
    title: "The Art of Cut",
    subtitle: "کوتاهی ژورنالی",
    img: "https://images.pexels.com/photos/3993444/pexels-photo-3993444.jpeg?auto=compress&cs=tinysrgb&w=800",
    metaphor: "قیچی، قلم‌موی ماست",
  },
  {
    id: 2,
    title: "Color Psychology",
    subtitle: "رنگ و لایت",
    img: "https://images.pexels.com/photos/3993313/pexels-photo-3993313.jpeg?auto=compress&cs=tinysrgb&w=800",
    metaphor: "رنگ‌ها حرف می‌زنند",
  },
  {
    id: 3,
    title: "Therapy & Soul",
    subtitle: "تراپی مو",
    img: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800",
    metaphor: "احیا، بازگشت به ریشه",
  },
  {
    id: 4,
    title: "Bridal Vision",
    subtitle: "میکاپ عروس",
    img: "https://images.pexels.com/photos/457701/pexels-photo-457701.jpeg?auto=compress&cs=tinysrgb&w=800",
    metaphor: "درخشش در ابدیت",
  },
];

export default function HorizontalScroll() {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // اسکرول عمودی رو تبدیل می‌کنیم به افقی
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  // محتوا به سمت چپ حرکت می‌کنه (x: "-100%")
  // توجه: بسته به تعداد کارت‌ها ممکنه نیاز باشه درصد رو تغییر بدی (مثلاً -75%)
  const x = useTransform(scrollYProgress, [0, 1], ["1%", "-75%"]);

  return (
    // ارتفاع 300vh یعنی کاربر باید 3 برابر ارتفاع صفحه اسکرول کنه تا این بخش تموم شه
    <section ref={targetRef} className="relative h-[300vh] bg-brand-dark">
      
      {/* این کانتینر چسبنده (Sticky) هست و تکون نمی‌خوره */}
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        
        {/* این بخش حرکت می‌کنه */}
        <motion.div style={{ x }} className="flex gap-20 px-20">
          
          {/* عنوان شروع بخش (معرفی) */}
          <div className="flex h-[70vh] w-[80vw] flex-col justify-center shrink-0">
            <h2 className="text-8xl font-black text-white leading-tight font-serif">
              NOT JUST <br/> 
              <span className="text-brand-gold italic">BEAUTY.</span> <br/>
              IT'S ART.
            </h2>
            <p className="mt-8 text-xl text-gray-400 max-w-lg font-sans">
              ورق بزنید تا ببینید چطور استانداردهای زیبایی را بازتعریف می‌کنیم.
            </p>
          </div>

          {/* کارت‌های افقی */}
          {CARDS.map((card) => (
            <div key={card.id} className="relative h-[70vh] w-[45vw] shrink-0 overflow-hidden rounded-[3rem] group cursor-none">
              <img 
                src={card.img} 
                alt={card.title} 
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
              
              {/* لایه رویی (Overlay) */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10">
                <span className="text-brand-gold font-serif text-xl mb-2">{card.subtitle}</span>
                <h3 className="text-5xl font-bold text-white mb-4 uppercase font-sans">{card.title}</h3>
                <p className="text-gray-300 font-light opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                  {card.metaphor}
                </p>
              </div>
            </div>
          ))}

          {/* پایان بخش */}
          <div className="flex h-[70vh] w-[50vw] items-center justify-center shrink-0">
             <div className="w-full h-[1px] bg-white/20 relative">
                <span className="absolute left-0 -top-3 text-white font-serif italic text-2xl">پایانِ فصل اول</span>
             </div>
          </div>

        </motion.div>
      </div>
    </section>
  );
}