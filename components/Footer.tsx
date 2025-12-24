// components/Footer.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { Instagram, Send, Mail, Phone, MapPin, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRef } from "react";
import { cn } from "@/lib/utils";

const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1], // Smooth easing
    },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export default function Footer() {
  const pathname = usePathname();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Hide footer in admin panels
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/superadmin") || pathname?.startsWith("/salon") || pathname?.startsWith("/platform")){
    return null;
  }

  return (
    <footer ref={ref} className="relative bg-gradient-to-b from-brand-dark via-black to-black text-white overflow-hidden">
      
      {/* Ambient Glow Effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand-gold/5 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-[0.02]">
        <motion.div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, #C6A87C 1px, transparent 1px),
              linear-gradient(to bottom, #C6A87C 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
          animate={{
            backgroundPosition: ['0px 0px', '80px 80px'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      <motion.div 
        className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12"
        variants={staggerContainer}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        
        {/* Main CTA Section */}
        <div className="pt-32 pb-20 border-b border-white/5">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left: Emotional Hook */}
            <motion.div variants={fadeInUp} custom={0} className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10">
                <Sparkles className="w-4 h-4 text-brand-gold" />
                <span className="text-xs tracking-wider text-gray-400 uppercase font-mono">
                  Let's Transform Together
                </span>
              </div>

              <h2 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold leading-[1.1] tracking-tight">
                <span className="block text-white mb-2">
                  آماده برای
                </span>
                <span className="block bg-gradient-to-l from-brand-gold via-luxury-gold-light to-brand-gold bg-clip-text text-transparent">
                  زیبایی بی‌نظیر
                </span>
                <span className="block text-white/60 text-4xl sm:text-5xl lg:text-6xl mt-4 font-light">
                  هستید؟
                </span>
              </h2>

              <p className="text-lg text-gray-400 leading-relaxed max-w-md font-light">
                تجربه‌ای لوکس که ارزش وقت شما را می‌داند. با بهترین متخصصان و پیشرفته‌ترین تکنیک‌ها.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <motion.button
                  onClick={() => window.open("https://wa.me/989170000000", "_blank")}
                  className="group relative px-8 py-5 bg-white text-black rounded-full font-semibold text-base overflow-hidden"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative z-10 flex items-center justify-center gap-3">
                    <span>رزرو نوبت آنلاین</span>
                    <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-brand-gold to-luxury-gold-light"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.button>

                <motion.a
                  href="tel:+989170000000"
                  className="group px-8 py-5 border-2 border-white/10 text-white rounded-full font-semibold text-base hover:border-brand-gold transition-all duration-300 flex items-center justify-center gap-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Phone className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
                  <span>تماس مستقیم</span>
                </motion.a>
              </div>
            </motion.div>

            {/* Right: Contact Info */}
            <motion.div variants={fadeInUp} custom={1} className="space-y-12">
              
              {/* Contact Methods */}
              <div className="grid gap-6">
                
                {/* Phone */}
                <motion.a
                  href="tel:+989170000000"
                  className="group flex items-center gap-5 p-6 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/5 hover:border-brand-gold/30 hover:bg-white/[0.04] transition-all duration-500"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold/10 to-transparent border border-brand-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Phone className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-mono">Phone</p>
                    <p dir="ltr" className="text-xl font-mono text-white group-hover:text-brand-gold transition-colors">
                      +98 917 000 0000
                    </p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-brand-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </motion.a>

                {/* Email */}
                <motion.a
                  href="mailto:hi@ayneh.beauty"
                  className="group flex items-center gap-5 p-6 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/5 hover:border-brand-gold/30 hover:bg-white/[0.04] transition-all duration-500"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold/10 to-transparent border border-brand-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Mail className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-mono">Email</p>
                    <p className="text-xl font-mono text-white group-hover:text-brand-gold transition-colors">
                      hi@ayneh.beauty
                    </p>
                  </div>
                  <ArrowUpRight className="w-5 h-5 text-gray-600 group-hover:text-brand-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </motion.a>

                {/* Address */}
                <motion.div
                  className="group flex items-start gap-5 p-6 rounded-2xl bg-white/[0.02] backdrop-blur-sm border border-white/5"
                  whileHover={{ x: 4 }}
                >
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-gold/10 to-transparent border border-brand-gold/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <MapPin className="w-6 h-6 text-brand-gold" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1 font-mono">Location</p>
                    <p className="text-base text-white/80 leading-relaxed">
                      شیراز، قصرالدشت، خیابان وکلا<br/>
                      کوچه باغ بهشت، پلاک ۱۰
                    </p>
                  </div>
                </motion.div>

              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                <motion.a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-all duration-300 group"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Instagram className="w-5 h-5 text-white group-hover:text-black transition-colors" />
                </motion.a>
                <motion.a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-gold hover:border-brand-gold transition-all duration-300 group"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send className="w-5 h-5 text-white group-hover:text-black transition-colors" />
                </motion.a>
              </div>

            </motion.div>

          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          variants={fadeInUp} 
          custom={2}
          className="py-10 flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          
          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-sm">
            <p className="text-gray-600 font-mono text-xs tracking-wider">
              © 2025 AYNEH BEAUTY. ALL RIGHTS RESERVED.
            </p>
            
            {/* Powered by Ayneh Platform */}
            <Link
              href="/platform"
              className="group relative flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-brand-gold/10 via-transparent to-transparent border border-brand-gold/20 hover:border-brand-gold/40 hover:bg-brand-gold/[0.07] transition-all duration-500 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-brand-gold/10 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <Sparkles className="w-4 h-4 text-brand-gold animate-pulse relative z-10" />
              <span className="text-xs font-medium text-gray-400 group-hover:text-brand-gold transition-colors relative z-10 tracking-wide">
                Powered by Ayneh Platform
              </span>
              <ArrowUpRight className="w-3.5 h-3.5 text-brand-gold/60 group-hover:text-brand-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 relative z-10" />
            </Link>
          </div>

          {/* Links */}
          <div className="flex items-center gap-8 text-xs">
            <Link href="#" className="text-gray-600 hover:text-brand-gold transition-colors font-mono tracking-wider">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-brand-gold transition-colors font-mono tracking-wider">
              Terms of Service
            </Link>
            <motion.button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2 text-gray-600 hover:text-brand-gold transition-colors group font-mono tracking-wider"
              whileHover={{ y: -2 }}
            >
              <span>Back to Top</span>
              <div className="w-6 h-6 rounded-full border border-gray-800 group-hover:border-brand-gold flex items-center justify-center">
                <ArrowUpRight className="w-3 h-3 -rotate-45" />
              </div>
            </motion.button>
          </div>

        </motion.div>

      </motion.div>

      {/* Signature Watermark */}
      <div className="absolute bottom-0 left-0 w-full flex justify-center pointer-events-none select-none opacity-[0.015] overflow-hidden">
        <motion.h1 
          className="text-[28vw] font-black font-serif text-white leading-none tracking-tighter whitespace-nowrap"
          initial={{ x: '-10%' }}
          animate={{ x: '10%' }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "linear"
          }}
        >
          AYNEH BEAUTY
        </motion.h1>
      </div>

    </footer>
  );
}
