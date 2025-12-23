"use client";

import { motion } from "framer-motion";
import { Sparkles, Coffee, Moon, Scissors, ArrowLeft } from "lucide-react";

const SERVICES = [
  {
    id: "style",
    title: "استایل و کوتاهی",
    enTitle: "Hair Styling",
    desc: "طراحی مو بر اساس فرم صورت و شخصیت شما. ما فقط کوتاه نمی‌کنیم، ما خلق می‌کنیم.",
    icon: Scissors,
    // فعلا عکس‌های دمو (بعدا عکس‌های خودت رو بذار)
    image: "https://images.pexels.com/photos/3993444/pexels-photo-3993444.jpeg?auto=compress&cs=tinysrgb&w=800",
    color: "bg-[#F9F5F3]", // کرم خیلی روشن
  },
  {
    id: "spa",
    title: "اسپا و تراپی",
    enTitle: "Scalp Therapy",
    desc: "یک ساعت آرامش مطلق. ماساژ سر، پاکسازی پوست سر و احیای موهای آسیب‌دیده.",
    icon: Moon,
    image: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800",
    color: "bg-[#F0F4F8]", // آبی یخی
  },
  {
    id: "color",
    title: "رنگ و لایت",
    enTitle: "Color & Light",
    desc: "تکنیک‌های مدرن آمبره، بالیاژ و سامبره با بهترین متریال‌های ایتالیایی.",
    icon: Sparkles,
    image: "https://images.pexels.com/photos/3993313/pexels-photo-3993313.jpeg?auto=compress&cs=tinysrgb&w=800",
    color: "bg-[#FFFBF0]", // طلایی روشن
  },
  {
    id: "daily",
    title: "مراقبت روزانه",
    enTitle: "Daily Care",
    desc: "براشینگ، مانیکور و پدیکور VIP برای اینکه هر روز درخشان باشید.",
    icon: Coffee,
    image: "https://images.pexels.com/photos/457701/pexels-photo-457701.jpeg?auto=compress&cs=tinysrgb&w=800",
    color: "bg-[#F5F9F5]", // سبز روشن
  },
];

export default function ServicesSticky() {
  
  // تابع رزرو واتس‌اپ
  const handleBooking = (serviceName: string) => {
    const message = `سلام! 🌸 من می‌خوام برای خدمات "${serviceName}" وقت رزرو کنم.`;
    window.open(`https://wa.me/989170000000?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <section className="relative w-full bg-white py-24 lg:py-40 font-sans text-right" dir="rtl">
      <div className="container mx-auto px-6">
        
        {/* در حالت دسکتاپ (lg) فلکس میشه، در موبایل ستونی */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
          
          {/* --- ستون سمت راست (ثابت / Sticky) --- */}
          <div className="lg:w-1/3">
            <div className="lg:sticky lg:top-40">
              <motion.span 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-4 block font-serif"
              >
                Our Services
              </motion.span>
              
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight"
                style={{ fontFamily: 'var(--font-doran)' }}
              >
                هنرِ <br/>
                <span className="font-serif italic text-gray-400 font-light">زیبایی شناسی</span>
              </motion.h2>

              <p className="text-gray-500 text-lg leading-loose font-light mb-10 text-justify max-w-md">
                در آینه، هر خدمت یک مراسم است. ما ترکیبی از تکنیک‌های مدرن و حس آرامش‌بخش اسپا را گردآوری کرده‌ایم تا تجربه‌ای فراتر از یک سالن زیبایی داشته باشید.
              </p>

              {/* دکمه دسکتاپ */}
              <button 
                onClick={() => handleBooking("مشاوره کلی")}
                className="hidden lg:flex items-center gap-3 text-sm font-bold border-b border-black pb-1 hover:text-gray-600 transition-colors uppercase tracking-widest cursor-pointer"
              >
                مشاهده کامل منو
                <ArrowLeft size={16} className="rotate-180" /> {/* چرخش فلش برای فارسی */}
              </button>
            </div>
          </div>

          {/* --- ستون سمت چپ (کارت‌های اسکرولی) --- */}
          <div className="lg:w-2/3 flex flex-col gap-8 lg:gap-12 pb-20">
            {SERVICES.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`group relative min-h-[400px] lg:min-h-[500px] rounded-[3rem] p-8 lg:p-12 overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-2xl ${service.color}`}
                onClick={() => handleBooking(service.title)}
              >
                {/* عکس پس‌زمینه (با افکت محو) */}
                <div className="absolute left-0 top-0 w-full lg:w-1/2 h-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 mix-blend-multiply">
                    <img 
                      src={service.image} 
                      alt={service.title} 
                      className="w-full h-full object-cover mask-image-linear" 
                      style={{ maskImage: 'linear-gradient(to right, black, transparent)' }} 
                    />
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="w-16 h-16 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-900 shadow-sm group-hover:scale-110 transition-transform duration-500">
                      <service.icon size={28} strokeWidth={1.5} />
                    </div>
                    <span className="font-serif text-2xl font-bold opacity-10 group-hover:opacity-100 group-hover:translate-x-[10px] transition-all duration-500">
                      0{index + 1}
                    </span>
                  </div>

                  <div className="mt-8">
                    <h3 
                      className="text-3xl lg:text-5xl font-bold mb-4 font-sans text-gray-900 group-hover:translate-x-[-8px] transition-transform duration-500"
                      style={{ fontFamily: 'var(--font-doran)' }}
                    >
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-lg lg:text-xl font-light max-w-lg leading-relaxed group-hover:text-gray-800">
                      {service.desc}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="text-sm font-bold border-b border-gray-900 pb-1">رزرو این خدمت</span>
                    <ArrowLeft size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}