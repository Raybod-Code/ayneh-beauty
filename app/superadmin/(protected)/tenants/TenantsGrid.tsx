"use client";

import { motion } from "framer-motion";
import { Building2, Sparkles } from "lucide-react";
import TenantCard from "./TenantCard";
import Link from "next/link";

export default function TenantsGrid({ tenants }: { tenants: any[] }) {
  if (tenants.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative"
      >
        {/* Glow Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#C8A951]/5 via-transparent to-purple-500/5 rounded-[3rem] blur-3xl" />
        
        <div className="relative text-center py-32 px-6">
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative w-32 h-32 mx-auto mb-8"
          >
            <div className="absolute inset-0 bg-[#C8A951]/10 rounded-[2rem] blur-2xl animate-pulse" />
            <div className="relative w-full h-full bg-gradient-to-br from-[#111] to-[#1a1a1a] rounded-[2rem] border border-white/10 flex items-center justify-center">
              <Building2 className="w-16 h-16 text-gray-700" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-3xl font-black text-white mb-3">
              هنوز سالنی ثبت نشده
            </h3>
            <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              اولین قدم را بردارید و سالن زیبایی خود را به سیستم اضافه کنید
            </p>

            <Link
              href="/superadmin/tenants/new"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#C8A951] to-[#D4B56A] text-black rounded-2xl font-bold hover:shadow-2xl hover:shadow-[#C8A951]/40 transition-all duration-300 hover:scale-105"
            >
              <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              افزودن اولین سالن
            </Link>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-10 left-10 w-20 h-20 border border-white/5 rounded-full opacity-30" />
          <div className="absolute bottom-10 right-10 w-32 h-32 border border-white/5 rounded-full opacity-20" />
        </div>
      </motion.div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tenants.map((tenant, idx) => (
        <TenantCard key={tenant.id} tenant={tenant} index={idx} />
      ))}
    </div>
  );
}
