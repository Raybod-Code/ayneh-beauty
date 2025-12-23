"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomCursor from "@/components/CustomCursor";
import GiftAtelier from "@/components/GiftAtelier";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function GiftPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-brand-gold selection:text-black">
      <CustomCursor />
      <Navbar />

      <div className="pt-32 pb-20">
        
        {/* دکمه بازگشت (شناور بالا) */}
        <div className="container mx-auto px-6 mb-8">
           <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors border border-white/10 px-4 py-2 rounded-full text-sm font-sans">
             <ArrowLeft size={16} /> بازگشت به داشبورد
           </Link>
        </div>

        {/* لود کردن کامپوننت آتلیه */}
        {/* نکته: پدینگ بالا رو کم کردم چون توی صفحه داخلی هستیم */}
        <div className="-mt-20">
           <GiftAtelier />
        </div>

      </div>
      
      <Footer />
    </main>
  );
}