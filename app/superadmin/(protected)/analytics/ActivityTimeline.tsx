"use client";

import { motion } from "framer-motion";
import { Activity, Building2, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

interface ActivityTimelineProps {
  activities: any[];
}

export default function ActivityTimeline({ activities }: ActivityTimelineProps) {
  return (
    <div className="group relative">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-gold/10 via-transparent to-brand-gold/10 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-700" />

      <div className="relative bg-[#111] border border-white/5 rounded-2xl p-6 overflow-hidden hover:border-brand-gold/20 transition-all">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' /%3E%3C/svg%3E\")"
        }} />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-gold/10 border border-brand-gold/20 rounded-xl flex items-center justify-center">
                <Activity className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-black text-white">فعالیت‌های اخیر</h3>
                <p className="text-xs text-brand-gray">10 رویداد آخر</p>
              </div>
            </div>

            <Link
              href="/superadmin/tenants"
              className="text-xs text-brand-gold hover:text-white transition-colors font-bold"
            >
              مشاهده همه →
            </Link>
          </div>

          {/* Timeline */}
          {activities.length > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              {activities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="relative group/item"
                >
                  {/* Timeline Line */}
                  {index < activities.length - 1 && (
                    <div className="absolute right-[19px] top-10 w-px h-full bg-white/5" />
                  )}

                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-brand-gold/20 blur-lg opacity-0 group-hover/item:opacity-100 transition-opacity" />
                      <div className="relative w-10 h-10 bg-brand-gold/10 border border-brand-gold/20 rounded-xl flex items-center justify-center group-hover/item:scale-110 transition-transform">
                        <Building2 className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pb-4">
                      <Link
                        href={`/superadmin/tenants/${activity.id}`}
                        className="block group/link"
                      >
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-bold text-white group-hover/link:text-brand-gold transition-colors truncate">
                              {activity.name}
                            </h4>
                            <p className="text-xs text-brand-gray truncate">
                              {activity.slug}.ayneh.com
                            </p>
                          </div>

                          <span
                            className={`flex-shrink-0 px-2 py-1 rounded-lg text-[10px] font-bold ${
                              activity.status === "active"
                                ? "bg-green-400/10 text-green-400"
                                : "bg-red-400/10 text-red-400"
                            }`}
                          >
                            {activity.status === "active" ? "فعال" : "تعلیق"}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-brand-gray">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" strokeWidth={2.5} />
                            <span className="font-mono">
                              {new Date(activity.created_at).toLocaleDateString("fa-IR", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" strokeWidth={2.5} />
                            <span className="capitalize">{activity.plan || "Basic"}</span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Activity className="w-12 h-12 mx-auto mb-3 text-gray-700" />
              <p className="text-brand-gray text-sm">فعالیتی ثبت نشده</p>
            </div>
          )}
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(198, 168, 124, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(198, 168, 124, 0.5);
        }
      `}</style>
    </div>
  );
}
