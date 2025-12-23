"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X, Smartphone } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Don't show immediately, wait a bit
      setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for successful install
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    // Don't show again for 7 days
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString());
  };

  // Don't show if already installed or dismissed recently
  useEffect(() => {
    const dismissed = localStorage.getItem('pwa-prompt-dismissed');
    if (dismissed) {
      const dismissedTime = parseInt(dismissed);
      const daysSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60 * 24);
      if (daysSinceDismissed < 7) {
        setShowPrompt(false);
      }
    }
  }, []);

  if (isInstalled || !deferredPrompt) return null;

  return (
    <AnimatePresence>
      {showPrompt && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
        >
          <div className="relative rounded-3xl bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-white/10 shadow-2xl overflow-hidden">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/10 via-transparent to-purple-500/10 pointer-events-none" />
            
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDismiss}
              className="absolute top-4 left-4 w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all z-10"
            >
              <X className="w-4 h-4 text-white" strokeWidth={2.5} />
            </motion.button>

            <div className="relative p-6">
              {/* Icon */}
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-gold to-yellow-600 flex items-center justify-center shadow-lg shadow-brand-gold/30"
              >
                <Smartphone className="w-8 h-8 text-white" strokeWidth={2.5} />
              </motion.div>

              {/* Content */}
              <h3 className="text-xl font-black text-white text-center mb-2">
                نصب سالن من
              </h3>
              <p className="text-sm text-brand-gray text-center mb-6">
                برای دسترسی سریع‌تر و تجربه بهتر، اپلیکیشن را روی دستگاه خود نصب کنید
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  "دسترسی آفلاین",
                  "سرعت بیشتر",
                  "اعلان‌های فوری",
                  "تجربه App-like",
                ].map((feature) => (
                  <div
                    key={feature}
                    className="flex items-center gap-2 text-xs text-white bg-white/5 rounded-xl px-3 py-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-gold" />
                    {feature}
                  </div>
                ))}
              </div>

              {/* Install Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInstall}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-brand-gold to-yellow-600 text-black font-black text-lg flex items-center justify-center gap-2 shadow-lg shadow-brand-gold/30 hover:shadow-brand-gold/50 transition-all"
              >
                <Download className="w-5 h-5" strokeWidth={2.5} />
                نصب اپلیکیشن
              </motion.button>

              <button
                onClick={handleDismiss}
                className="w-full mt-3 text-sm text-brand-gray hover:text-white transition-colors"
              >
                شاید بعداً
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
