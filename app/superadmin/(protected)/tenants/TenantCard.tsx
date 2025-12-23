"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import {
  Building2,
  Users,
  Calendar,
  Power,
  ExternalLink,
  Loader2,
  Crown,
  Trash2,
  MoreVertical,
  Eye,
  Sparkles,
} from "lucide-react";
import { toggleTenantStatus, deleteTenant } from "./actions";
import { toast } from "sonner";

export default function TenantCard({ tenant, index }: { tenant: any; index: number }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(tenant.status);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isActive = status === "active";

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set((e.clientX - centerX) / 10);
    mouseY.set((e.clientY - centerY) / 10);
  };

  const handleToggle = async () => {
    setLoading(true);
    const oldStatus = status;
    setStatus(isActive ? "suspended" : "active");
    
    const result = await toggleTenantStatus(tenant.id, oldStatus);

    if (result.success) {
      toast.success(result.newStatus === "active" ? "✅ سالن فعال شد" : "⏸️ سالن تعلیق شد");
    } else {
      setStatus(oldStatus);
      toast.error("خطا: " + result.error);
    }

    setLoading(false);
  };

  const handleDelete = async () => {
    const result = await deleteTenant(tenant.id);
    if (result.success) {
      toast.success("🗑️ سالن حذف شد");
      setShowDeleteModal(false);
    } else {
      toast.error("خطا: " + result.error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          delay: index * 0.08,
          duration: 0.7,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="group relative h-full"
        style={{ perspective: "1000px" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          mouseX.set(0);
          mouseY.set(0);
        }}
      >
        {/* Dynamic Glow - More Intense */}
        <motion.div
          className={`absolute -inset-2 rounded-[3rem] opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700 ${
            isActive
              ? "bg-gradient-to-br from-brand-gold/30 via-green-500/20 to-brand-gold/30"
              : "bg-gradient-to-br from-red-500/30 via-orange-500/20 to-red-500/30"
          }`}
          animate={{
            scale: [1, 1.05, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Main Card with 3D Transform */}
        <motion.div
          style={{
            rotateX,
            rotateY,
            transformStyle: "preserve-3d",
          }}
          className="relative h-full bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/10 rounded-[3rem] p-8 overflow-hidden hover:border-brand-gold/30 transition-all duration-700"
        >
          {/* Noise Texture */}
          <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
          }} />

          {/* Animated Top Gradient */}
          <motion.div
            className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, 90, 0],
              opacity: [0.03, 0.08, 0.03],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${isActive ? "from-brand-gold" : "from-red-500"} to-transparent rounded-full blur-3xl`} />
          </motion.div>

          <div className="relative z-10 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              {/* 3D Icon */}
              <motion.div
                whileHover={{ scale: 1.1, rotateZ: 5 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative"
                style={{ transformStyle: "preserve-3d", transform: "translateZ(20px)" }}
              >
                <div className="absolute inset-0 bg-brand-gold/40 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative w-16 h-16 bg-gradient-to-br from-brand-gold/20 to-brand-gold/5 rounded-[22px] flex items-center justify-center border border-brand-gold/30 backdrop-blur-sm shadow-2xl shadow-brand-gold/20">
                  <div className="absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/10 to-transparent" />
                  <Building2 className="w-8 h-8 text-brand-gold relative z-10" strokeWidth={2.5} />
                </div>
              </motion.div>

              <div className="flex items-center gap-2">
                {/* Status Badge */}
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className={`relative px-4 py-2.5 rounded-[18px] text-xs font-black backdrop-blur-xl border overflow-hidden ${
                    isActive
                      ? "bg-green-500/10 text-green-300 border-green-500/30 shadow-lg shadow-green-500/20"
                      : "bg-red-500/10 text-red-300 border-red-500/30 shadow-lg shadow-red-500/20"
                  }`}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <span className="relative z-10">{isActive ? "فعال" : "تعلیق"}</span>
                </motion.div>

                {/* More Menu */}
                <div className="relative">
                  <motion.button
                    onClick={() => setShowMenu(!showMenu)}
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-11 h-11 rounded-[18px] bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center transition-all backdrop-blur-sm"
                  >
                    <MoreVertical className="w-4 h-4 text-brand-gray" strokeWidth={2.5} />
                  </motion.button>

                  <AnimatePresence>
                    {showMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute left-0 top-full mt-2 w-52 bg-brand-dark/95 border border-white/10 rounded-[24px] p-2 shadow-2xl shadow-black/50 z-50 backdrop-blur-2xl"
                      >
                        <Link
                          href={`/superadmin/tenants/${tenant.id}`}
                          className="flex items-center gap-3 px-4 py-3 rounded-[18px] hover:bg-white/5 text-sm font-bold text-white transition-all group/item"
                        >
                          <Eye className="w-4 h-4 text-brand-gray group-hover/item:text-brand-gold transition-colors" strokeWidth={2.5} />
                          مشاهده جزئیات
                        </Link>
                        <button
                          onClick={() => {
                            setShowDeleteModal(true);
                            setShowMenu(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-[18px] hover:bg-red-500/10 text-sm font-bold text-red-400 transition-all group/item"
                        >
                          <Trash2 className="w-4 h-4 group-hover/item:scale-110 transition-transform" strokeWidth={2.5} />
                          حذف سالن
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Title */}
            <Link href={`/superadmin/tenants/${tenant.id}`}>
              <motion.h3
                whileHover={{ x: 4 }}
                className="text-3xl font-black mb-3 text-white group-hover:text-brand-gold transition-colors cursor-pointer leading-tight"
                style={{
                  textShadow: "0 0 30px rgba(198, 168, 124, 0.2)",
                }}
              >
                {tenant.name}
              </motion.h3>
            </Link>

            {/* Domain */}
            <div className="flex items-center gap-2 mb-8">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-brand-gold shadow-lg shadow-brand-gold/50"
              />
              <p className="text-sm text-brand-gray font-mono">
                {tenant.slug}.ayneh.com
              </p>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-3 mb-8">
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex-1 relative group/stat"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent rounded-[20px] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center gap-3 px-4 py-4 bg-white/[0.03] rounded-[20px] border border-white/5 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-[14px] bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs text-brand-gray font-bold">اعضا</p>
                    <p className="text-lg font-black text-white">{tenant.members?.[0]?.count || 0}</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                className="flex-1 relative group/stat"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent rounded-[20px] opacity-0 group-hover/stat:opacity-100 transition-opacity duration-500" />
                <div className="relative flex items-center gap-3 px-4 py-4 bg-white/[0.03] rounded-[20px] border border-white/5 backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-[14px] bg-brand-gold/10 border border-brand-gold/20 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs text-brand-gray font-bold uppercase">{tenant.plan || "Basic"}</p>
                    <p className="text-xs text-brand-gray font-mono">
                      {new Date(tenant.created_at).toLocaleDateString("fa-IR", { month: "short", day: "numeric" })}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Actions - Push to bottom */}
            <div className="mt-auto pt-6 border-t border-white/5">
              <div className="flex items-center gap-2">
                <Link
                  href={`/superadmin/tenants/${tenant.id}`}
                  className="flex-1"
                >
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="group/link relative overflow-hidden flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 rounded-[18px] py-4 text-sm font-bold text-white transition-all backdrop-blur-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-gold/10 to-transparent opacity-0 group-hover/link:opacity-100 transition-opacity duration-500" />
                    <span className="relative z-10">جزئیات</span>
                    <ExternalLink className="w-4 h-4 relative z-10 group-hover/link:translate-x-[-2px] group-hover/link:translate-y-[-2px] transition-transform" strokeWidth={2.5} />
                  </motion.div>
                </Link>

                <motion.button
                  onClick={handleToggle}
                  disabled={loading}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className={`flex-1 relative overflow-hidden flex items-center justify-center gap-2 rounded-[18px] py-4 text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed backdrop-blur-sm ${
                    isActive
                      ? "bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30"
                      : "bg-green-500/15 hover:bg-green-500/25 text-green-300 border border-green-500/30"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${isActive ? "from-red-500/20" : "from-green-500/20"} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin relative z-10" strokeWidth={2.5} />
                  ) : (
                    <Power className="w-4 h-4 relative z-10" strokeWidth={2.5} />
                  )}
                  <span className="relative z-10">{isActive ? "تعلیق" : "فعال‌سازی"}</span>
                </motion.button>
              </div>
            </div>

            {/* Bottom Shine */}
            <motion.div
              className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-brand-gold to-transparent opacity-0 group-hover:opacity-100"
              animate={{
                x: ["-100%", "100%"],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          </div>
        </motion.div>
      </motion.div>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-md w-full bg-gradient-to-br from-[#1a1a1a] to-[#111] border border-white/10 rounded-[2.5rem] p-10 shadow-2xl"
            >
              <div className="text-center">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                  className="w-20 h-20 mx-auto mb-6 rounded-[24px] bg-red-500/10 border border-red-500/20 flex items-center justify-center"
                >
                  <Trash2 className="w-10 h-10 text-red-400" strokeWidth={2.5} />
                </motion.div>
                <h3 className="text-3xl font-black text-white mb-3">حذف سالن</h3>
                <p className="text-brand-gray text-base mb-8 leading-relaxed">
                  آیا از حذف <span className="text-white font-bold">{tenant.name}</span> اطمینان دارید؟
                  <br />
                  <span className="text-sm text-red-400">این عمل غیرقابل بازگشت است.</span>
                </p>

                <div className="flex gap-3">
                  <motion.button
                    onClick={() => setShowDeleteModal(false)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-6 py-4 bg-white/5 hover:bg-white/10 rounded-[20px] font-bold text-white transition-all backdrop-blur-sm"
                  >
                    انصراف
                  </motion.button>
                  <motion.button
                    onClick={handleDelete}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-[20px] font-bold text-white transition-all shadow-lg shadow-red-500/30"
                  >
                    حذف کن
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
