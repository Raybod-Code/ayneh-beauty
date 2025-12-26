// components/platform/PlatformFooter.tsx
"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import {
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import NoiseTexture from "@/components/ui/NoiseTexture";
import { useEffect, memo } from "react";

const footerLinks = {
  product: [
    { label: "ویژگی‌ها", href: "#features" },
    { label: "قیمت‌گذاری", href: "#pricing" },
    { label: "نظرات مشتریان", href: "#testimonials" },
    { label: "سوالات متداول", href: "#faq" },
  ],
  company: [
    { label: "درباره ما", href: "/about" },
    { label: "تماس با ما", href: "/contact" },
    { label: "وبلاگ", href: "/blog" },
    { label: "فرصت‌های شغلی", href: "/careers" },
  ],
  legal: [
    { label: "حریم خصوصی", href: "/privacy" },
    { label: "شرایط و قوانین", href: "/terms" },
    { label: "قوانین کوکی", href: "/cookies" },
  ],
  resources: [
    { label: "مستندات API", href: "/docs" },
    { label: "راهنمای شروع", href: "/guide" },
    { label: "ویدیوهای آموزشی", href: "/videos" },
    { label: "پشتیبانی", href: "/support" },
  ],
};

const socialLinks = [
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

// Cursor glow (shared)
const CustomCursorGlow = memo(() => {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };
    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, [cursorX, cursorY]);

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 w-8 h-8 rounded-full z-40 mix-blend-screen"
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        translateX: "-50%",
        translateY: "-50%",
        background:
          "radial-gradient(circle, hsl(43, 74%, 66%) 0%, transparent 70%)",
        filter: "blur(8px)",
      }}
    />
  );
});
CustomCursorGlow.displayName = "CustomCursorGlow";

export default function PlatformFooter() {
  return (
    <footer className="relative bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-t border-white/10 overflow-hidden">
      {/* Cursor Glow */}
      <CustomCursorGlow />

      {/* Noise Texture */}
      <NoiseTexture />

      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-gold/5 rounded-full blur-[80px]" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {/* Top Section */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/platform">
              <motion.div
                className="flex items-center gap-3 mb-6 group cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-gold to-luxury-gold-light flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-brand-gold to-luxury-gold-light bg-clip-text text-transparent">
                    آینه
                  </h3>
                  <p className="text-xs text-gray-500">Beauty Platform</p>
                </div>
              </motion.div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              اولین و بهترین پلتفرم مدیریت جامع سالن‌های زیبایی در ایران.
              با آینه، کسب‌وکار خود را دیجیتال کنید.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:info@ayneh.beauty"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Mail className="w-4 h-4" />
                </div>
                <span>info@ayneh.beauty</span>
              </a>

              <a
                href="tel:+982112345678"
                className="flex items-center gap-3 text-sm text-gray-400 hover:text-white transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <Phone className="w-4 h-4" />
                </div>
                <span dir="ltr">+98 21 1234 5678</span>
              </a>

              <div className="flex items-center gap-3 text-sm text-gray-400">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>تهران، ایران</span>
              </div>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-semibold mb-4">محصول</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">شرکت</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">منابع</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} آینه. تمامی حقوق محفوظ است.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-brand-gold/30 transition-all group"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              {footerLinks.legal.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-gray-500 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
