"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function AdminTransitions({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const reduce = useReducedMotion();

  const [wipeKey, setWipeKey] = useState(0);
  const [showWipe, setShowWipe] = useState(false);

  useEffect(() => {
    if (reduce) return;
    setShowWipe(true);
    setWipeKey((k) => k + 1);

    const t = setTimeout(() => setShowWipe(false), 900);
    return () => clearTimeout(t);
  }, [pathname, reduce]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <div className="relative">
      {/* پرده (روی کل صفحه، ولی فقط ~0.9 ثانیه و بعد حذف می‌شود) */}
      <AnimatePresence initial={false}>
        {showWipe && !reduce && (
          <motion.div
            key={wipeKey}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-[9999]"
            initial={{ x: "110%", skewX: -6 }}
            animate={{ x: "-110%", skewX: -6 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease }}
            style={{
              background:
                "linear-gradient(180deg, rgba(8,8,8,0.92) 0%, rgba(4,4,4,0.92) 55%, rgba(8,8,8,0.92) 100%)",
              willChange: "transform",
            }}
          >
            {/* لبه‌ی نرم (مدرن) */}
            <div
              className="absolute inset-y-0 left-0 w-24"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.06) 55%, rgba(0,0,0,0) 100%)",
                filter: "blur(6px)",
                opacity: 0.7,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* محتوای صفحه (نرم و شیک، بدون فریم و بدون خط) */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={pathname}
          initial={reduce ? { opacity: 1 } : { opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={reduce ? { opacity: 1 } : { opacity: 0, y: -8, filter: "blur(8px)" }}
          transition={{ duration: reduce ? 0.01 : 0.28, ease }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
