"use client";

import { Instagram, Phone, MapPin, ArrowUp, Mail } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // مخفی کردن footer در پنل‌های ادمین و سوپرادمین
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/superadmin")) {
    return null;
  }

  return (
    <footer className="bg-black text-white pt-32 pb-10 px-6 relative overflow-hidden border-t border-white/5">
      
      {/* 1. واترمارک عظیم پس‌زمینه (Signature) */}
      <div className="absolute bottom-[-5%] left-0 w-full flex justify-center pointer-events-none select-none opacity-[0.04]">
        <h1 className="text-[30vw] font-black font-serif text-white leading-none tracking-tighter">
          AYNEH
        </h1>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* 2. بخش اصلی: دعوت به رزرو */}
        <div className="flex flex-col lg:flex-row justify-between items-start mb-32 gap-20">
          
          <div className="max-w-xl">
            <span className="text-brand-gold text-xs tracking-widest uppercase mb-4 block">Let's Create Magic</span>
            <h2 className="text-5xl md:text-7xl font-serif mb-10 text-white leading-tight">
              آماده تغییر <br/> <span className="text-brand-gold italic font-light">هستید؟</span>
            </h2>
            <button 
              onClick={() => window.open("https://wa.me/989170000000", "_blank")}
              className="group flex items-center gap-4 bg-white text-black px-8 py-4 md:px-10 md:py-5 rounded-full font-bold text-sm md:text-lg hover:bg-brand-gold transition-all duration-300 transform hover:scale-105"
            >
              <span>رزرو آنلاین نوبت</span>
              <div className="w-2 h-2 bg-black rounded-full group-hover:bg-white transition-colors"></div>
            </button>
          </div>

          {/* 3. اطلاعات تماس و لینک‌ها */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 text-sm font-light text-gray-400 w-full lg:w-auto">
            
            <div className="space-y-6">
              <h4 className="text-white font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-2 inline-block">تماس</h4>
              <a href="tel:+989170000000" className="flex items-center gap-4 hover:text-brand-gold transition-colors group">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-gold transition-colors">
                   <Phone size={16} />
                </div>
                <p dir="ltr" className="font-mono text-lg">+98 917 000 0000</p>
              </a>
              <a href="mailto:hi@ayneh.com" className="flex items-center gap-4 hover:text-brand-gold transition-colors group">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-brand-gold transition-colors">
                   <Mail size={16} />
                </div>
                <p className="font-mono text-lg">hi@ayneh.com</p>
              </a>
            </div>

            <div className="space-y-6">
              <h4 className="text-white font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-2 inline-block">سوشال</h4>
              <div className="flex gap-4">
                 <Link href="#" className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-gold hover:text-black transition-all duration-300">
                    <Instagram size={20} />
                 </Link>
                 {/* آیکون‌های بیشتر اگر خواستی */}
              </div>
              <p className="leading-relaxed">
                شیراز، قصرالدشت، خیابان وکلا،<br/>کوچه باغ بهشت، پلاک ۱۰
              </p>
            </div>

          </div>

        </div>

        {/* 4. کپی‌رایت و دکمه بالا */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] md:text-xs text-gray-600 uppercase tracking-widest font-mono">
          <p>© 2025 AYNEH BEAUTY LOUNGE. ALL RIGHTS RESERVED.</p>
          
          <div className="flex items-center gap-8">
             <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
             <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
             
             <button onClick={scrollToTop} className="flex items-center gap-2 text-white hover:text-brand-gold transition-colors ml-4 group">
               Back to Top 
               <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center group-hover:-translate-y-1 transition-transform">
                 <ArrowUp size={12} />
               </div>
             </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
