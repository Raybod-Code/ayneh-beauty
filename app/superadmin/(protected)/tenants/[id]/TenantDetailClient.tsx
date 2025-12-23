"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Building2,
  ArrowRight,
  Users,
  Crown,
  Calendar,
  Globe,
  Settings,
  Trash2,
  Power,
  Edit,
  ExternalLink,
  Mail,
  User,
  Shield,
  Clock,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { toggleTenantStatus, deleteTenant } from "../actions";
import { toast } from "sonner";

export default function TenantDetailClient({ tenant }: { tenant: any }) {
  const router = useRouter();
  const [status, setStatus] = useState(tenant.status);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const isActive = status === "active";

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
      router.push("/superadmin/tenants");
    } else {
      toast.error("خطا: " + result.error);
    }
  };

  const owner = tenant.members?.find((m: any) => m.role === "owner");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-brand-gold/[0.02] rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/[0.015] rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "2s" }} />
        
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(198, 168, 124, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(198, 168, 124, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '80px 80px'
          }}
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.7)_100%)]" />
      </div>

      <div className="relative z-10 p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link
            href="/superadmin/tenants"
            className="inline-flex items-center gap-2 text-sm text-brand-gray hover:text-brand-gold transition-colors mb-6"
          >
            <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            بازگشت به لیست سالن‌ها
          </Link>

          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-brand-gold/40 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-gold to-brand-gold/80 flex items-center justify-center shadow-2xl shadow-brand-gold/30">
                  <Building2 className="w-8 h-8 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black text-white">{tenant.name}</h1>
                <p className="text-brand-gray text-sm mt-1 flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  <span className="font-mono">{tenant.slug}.ayneh.com</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`px-4 py-2 rounded-xl text-sm font-bold backdrop-blur-sm border ${
                  isActive
                    ? "bg-green-400/10 text-green-300 border-green-400/30"
                    : "bg-red-400/10 text-red-300 border-red-400/30"
                }`}
              >
                {isActive ? "فعال" : "تعلیق"}
              </span>

              <motion.button
                onClick={handleToggle}
                disabled={loading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold transition-all ${
                  isActive
                    ? "bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30"
                    : "bg-green-500/15 hover:bg-green-500/25 text-green-300 border border-green-500/30"
                }`}
              >
                <Power className="w-4 h-4" strokeWidth={2.5} />
                {isActive ? "تعلیق" : "فعال‌سازی"}
              </motion.button>

              <motion.button
                onClick={() => setShowDeleteModal(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-5 py-2 bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/30 rounded-xl font-bold transition-all"
              >
                <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                حذف
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Grid Layout */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Info - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid md:grid-cols-3 gap-4"
            >
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
                <div className="relative bg-[#111] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-blue-400/10 border border-blue-400/20 rounded-xl flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xs text-brand-gray mb-1">اعضا</p>
                  <p className="text-3xl font-black text-white">{tenant.members?.length || 0}</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-brand-gold/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
                <div className="relative bg-[#111] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-brand-gold/10 border border-brand-gold/20 rounded-xl flex items-center justify-center">
                      <Crown className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xs text-brand-gray mb-1">پلن</p>
                  <p className="text-2xl font-black text-white capitalize">{tenant.plan || "Basic"}</p>
                </div>
              </div>

              <div className="relative group">
                <div className="absolute -inset-0.5 bg-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
                <div className="relative bg-[#111] border border-white/5 rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 bg-purple-400/10 border border-purple-400/20 rounded-xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
                    </div>
                  </div>
                  <p className="text-xs text-brand-gray mb-1">تاریخ ثبت</p>
                  <p className="text-sm font-bold text-white">
                    {new Date(tenant.created_at).toLocaleDateString("fa-IR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Description */}
            {tenant.description && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold/10 via-transparent to-brand-gold/10 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
                <div className="relative bg-[#111] border border-white/5 rounded-2xl p-6">
                  <h3 className="text-lg font-black text-white mb-3 flex items-center gap-2">
                    <Edit className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                    توضیحات
                  </h3>
                  <p className="text-brand-gray leading-relaxed">{tenant.description}</p>
                </div>
              </motion.div>
            )}

            {/* Members List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/10 via-transparent to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
              <div className="relative bg-[#111] border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-purple-400" strokeWidth={2.5} />
                  اعضای سالن
                </h3>

                {tenant.members && tenant.members.length > 0 ? (
                  <div className="space-y-3">
                    {tenant.members.map((member: any) => (
                      <div
                        key={member.id}
                        className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-xl hover:bg-white/[0.04] transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-brand-gold/10 rounded-lg flex items-center justify-center border border-brand-gold/20">
                            <User className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                          </div>
                          <div>
                            <h4 className="font-bold text-sm text-white">
                              {member.profile?.full_name || "بدون نام"}
                            </h4>
                            <p className="text-xs text-brand-gray">{member.profile?.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`px-3 py-1 rounded-lg text-xs font-bold ${
                              member.role === "owner"
                                ? "bg-brand-gold/10 text-brand-gold border border-brand-gold/20"
                                : "bg-blue-400/10 text-blue-400 border border-blue-400/20"
                            }`}
                          >
                            {member.role === "owner" ? "مالک" : member.role}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <User className="w-12 h-12 mx-auto mb-3 text-gray-700" />
                    <p className="text-brand-gray text-sm">هنوز عضوی ندارد</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Owner Info */}
            {owner && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-brand-gold/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
                <div className="relative bg-[#111] border border-white/5 rounded-2xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Crown className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                    <h3 className="text-lg font-black text-white">مالک سالن</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-brand-gold/10 rounded-xl flex items-center justify-center border border-brand-gold/20">
                        <User className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          {owner.profile?.full_name || "بدون نام"}
                        </p>
                        <p className="text-xs text-brand-gray">{owner.profile?.email}</p>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-white/5">
                      <div className="flex items-center gap-2 text-xs text-brand-gray">
                        <Clock className="w-3 h-3" />
                        عضو از: {new Date(owner.created_at).toLocaleDateString("fa-IR", { month: "short", day: "numeric" })}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative group"
              >
              <div className="absolute -inset-0.5 bg-blue-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
              <div className="relative bg-[#111] border border-white/5 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Settings className="w-5 h-5 text-blue-400" strokeWidth={2.5} />
                  <h3 className="text-lg font-black text-white">تنظیمات</h3>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-brand-gray">زبان</span>
                    <span className="text-sm font-bold text-white">
                      {tenant.settings?.language === "fa" ? "فارسی" : "English"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-brand-gray">منطقه زمانی</span>
                    <span className="text-sm font-bold text-white font-mono">
                      {tenant.settings?.timezone || "Asia/Tehran"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-brand-gray">ارز</span>
                    <span className="text-sm font-bold text-white">
                      {tenant.settings?.currency || "IRR"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="relative group"
            >
              <div className="absolute -inset-0.5 bg-purple-500/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity" />
              <div className="relative bg-[#111] border border-white/5 rounded-2xl p-6">
                <h3 className="text-lg font-black text-white mb-4">عملیات سریع</h3>

                <div className="space-y-2">
                  <a
                    href={`https://${tenant.slug}.ayneh.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl transition-all group/link"
                  >
                    <span className="text-sm font-bold text-white">بازدید از سایت</span>
                    <ExternalLink className="w-4 h-4 text-brand-gray group-hover/link:text-brand-gold transition-colors" strokeWidth={2.5} />
                  </a>

                  <button className="w-full flex items-center justify-between p-3 bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-xl transition-all group/link">
                    <span className="text-sm font-bold text-white">ارسال ایمیل</span>
                    <Mail className="w-4 h-4 text-brand-gray group-hover/link:text-brand-gold transition-colors" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6"
          onClick={() => setShowDeleteModal(false)}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-md w-full bg-[#111] border border-white/10 rounded-2xl p-8"
          >
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <Trash2 className="w-7 h-7 text-red-400" strokeWidth={2.5} />
              </div>
              <h3 className="text-xl font-black text-white mb-2">حذف سالن</h3>
              <p className="text-brand-gray text-sm mb-6">
                آیا از حذف <span className="text-white font-bold">{tenant.name}</span> اطمینان دارید؟
                <br />
                <span className="text-red-400">این عمل غیرقابل بازگشت است.</span>
              </p>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold text-white transition-colors"
                >
                  انصراف
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-bold text-white transition-colors"
                >
                  حذف کن
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
