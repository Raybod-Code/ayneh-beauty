// components/platform/PlatformFooter.tsx
"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Instagram, 
  Send, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin,
  ArrowUpRight,
  Heart
} from "lucide-react";
import Link from "next/link";

const footerLinks = {
  product: {
    title: "محصول",
    links: [
      { label: "امکانات", href: "/platform#features" },
      { label: "تعرفه‌ها", href: "/platform#pricing" },
      { label: "نمونه کار زنده", href: "/" },
      { label: "مشاهده دمو", href: "/platform/demo" },
    ]
  },
  resources: {
    title: "منابع",
    links: [
      { label: "مستندات", href: "/docs" },
      { label: "راهنمای شروع", href: "/guide" },
      { label: "وبلاگ", href: "/blog" },
      { label: "پشتیبانی", href: "/support" },
    ]
  },
  company: {
    title: "شرکت",
    links: [
      { label: "درباره ما", href: "/about" },
      { label: "تماس با ما", href: "/contact" },
      { label: "فرصت‌های شغلی", href: "/careers" },
      { label: "شرکا", href: "/partners" },
    ]
  },
  legal: {
    title: "قوانین",
    links: [
      { label: "حریم خصوصی", href: "/privacy" },
      { label: "شرایط استفاده", href: "/terms" },
      { label: "قوانین کوکی", href: "/cookies" },
      { label: "سیاست بازپرداخت", href: "/refund" },
    ]
  },
};

const socialLinks = [
  { 
    icon: Instagram, 
    href: "https://instagram.com/ayneh.beauty", 
    label: "Instagram",
    color: "from-purple-500 to-pink-500"
  },
  { 
    icon: Send, 
    href: "https://t.me/ayneh_beauty", 
    label: "Telegram",
    color: "from-blue-400 to-blue-600"
  },
  { 
    icon: MessageCircle, 
    href: "https://wa.me/989170000000", 
    label: "WhatsApp",
    color: "from-green-400 to-green-600"
  },
];

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function PlatformFooter() {
  return (
    <footer className="relative bg-gradient-to-b from-brand-dark via-black to-black text-white overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-brand-gold/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 opacity-[0.02]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `
                linear-gradient(to right, #C6A87C 1px, transparent 1px),
                linear-gradient(to bottom, #C6A87C 1px, transparent 1px)
              `,
              backgroundSize: '60px 60px',
            }}
          />
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Main Content */}
        <div className="py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand Column */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            custom={0}
            className="lg:col-span-4"
          >
            {/* Logo */}
            <Link href="/platform" className="inline-flex items-center gap-3 group mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-gold/20 blur-xl rounded-full animate-pulse-slow" />
                <Sparkles className="relative w-10 h-10 text-brand-gold" />
              </div>
              <div className="flex flex-col">
                <span className="font-serif text-3xl font-bold bg-gradient-to-l from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
                  پلتفرم آینه
                </span>
                <span className="text-xs text-gray-500 -mt-1">
                  Ayneh Platform
                </span>
              </div>
            </Link>

            <p className="text-gray-400 leading-relaxed mb-8 max-w-sm">
              بهترین پلتفرم مدیریت سالن‌های زیبایی در ایران و خاورمیانه. 
              تجربه‌ای لوکس برای کسب‌وکار شما.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden transition-all duration-300 hover:border-brand-gold/30"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors relative z-10" />
                  <div className={`absolute inset-0 bg-gradient-to-br ${social.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Links Columns */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8 lg:gap-12">
            {Object.values(footerLinks).map((section, sectionIndex) => (
              <motion.div
                key={sectionIndex}
                variants={fadeInUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={sectionIndex + 1}
              >
                <h3 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-2 text-sm text-gray-400 hover:text-brand-gold transition-colors duration-300"
                      >
                        <span>{link.label}</span>
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 group-hover:translate-x-0.5 transition-all duration-300" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Contact Bar */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={5}
          className="py-8 border-y border-white/5"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Email */}
            <a
              href="mailto:info@ayneh.beauty"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-gold/30 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Mail className="w-5 h-5 text-brand-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-500 mb-1">Email</p>
                <p className="text-sm text-white truncate group-hover:text-brand-gold transition-colors">
                  info@ayneh.beauty
                </p>
              </div>
            </a>

            {/* Phone */}
            <a
              href="tel:+982188888888"
              className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-brand-gold/30 hover:bg-white/[0.04] transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Phone className="w-5 h-5 text-brand-gold" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Phone</p>
                <p dir="ltr" className="text-sm text-white group-hover:text-brand-gold transition-colors">
                  +98 21 8888 8888
                </p>
              </div>
            </a>

            {/* Address */}
            <div className="group flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/5">
              <div className="w-12 h-12 rounded-xl bg-brand-gold/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-brand-gold" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-500 mb-1">Address</p>
                <p className="text-sm text-white">
                  تهران، میدان ونک
                </p>
              </div>
            </div>

          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          custom={6}
          className="py-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          
          {/* Copyright */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-sm text-gray-500">
            <p className="font-mono text-xs tracking-wider">
              © 2025 AYNEH PLATFORM. ALL RIGHTS RESERVED.
            </p>
            <div className="hidden sm:block w-px h-4 bg-white/10" />
            <p className="flex items-center gap-2 text-xs">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-luxury-rose-500 fill-current animate-pulse" />
              <span>in Iran</span>
            </p>
          </div>

          {/* Back to Main Site */}
          <Link
            href="/"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-brand-gold/30 hover:bg-brand-gold/10 transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span className="text-sm text-gray-400 group-hover:text-brand-gold transition-colors">
              مشاهده نمونه کار زنده
            </span>
            <ArrowUpRight className="w-4 h-4 text-brand-gold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
          </Link>

        </motion.div>

      </div>

      {/* Decorative Bottom Glow */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/50 to-transparent" />
      
    </footer>
  );
}
