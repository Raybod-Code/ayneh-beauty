"use client";

import { motion } from "framer-motion";

export default function TenantsSkeleton() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.05 }}
          className="relative h-[380px] bg-[#111] border border-white/5 rounded-[2.5rem] p-7 overflow-hidden"
        >
          {/* Shimmer Effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          <div className="flex items-start justify-between mb-6">
            <div className="w-14 h-14 bg-white/5 rounded-2xl animate-pulse" />
            <div className="w-20 h-8 bg-white/5 rounded-xl animate-pulse" />
          </div>

          <div className="space-y-3 mb-6">
            <div className="h-6 bg-white/5 rounded-lg w-3/4 animate-pulse" />
            <div className="h-4 bg-white/5 rounded-lg w-1/2 animate-pulse" />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="h-16 bg-white/5 rounded-xl animate-pulse" />
            <div className="h-16 bg-white/5 rounded-xl animate-pulse" />
          </div>

          <div className="absolute bottom-7 left-7 right-7">
            <div className="flex gap-2">
              <div className="flex-1 h-10 bg-white/5 rounded-xl animate-pulse" />
              <div className="flex-1 h-10 bg-white/5 rounded-xl animate-pulse" />
            </div>
          </div>
        </motion.div>
      ))}

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
