"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Download,
  Clock,
  User,
  Phone,
  DollarSign,
  Crown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronDown,
  LayoutGrid,
  LayoutList,
  CalendarDays,
  X,
  Edit2,
  Trash2,
  MoreHorizontal,
  Sparkles,
  TrendingUp,
  ArrowUpDown,
  Eye,
  MessageSquare,
  Mail,
} from "lucide-react";
import Link from "next/link";

// Helper function
function getTenantSlug(): string {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('localhost:')) {
    return 'localhost-fallback';
  }
  if (parts.length >= 2) return parts[0];
  return '';
}

// Status config
const statusConfig = {
  pending: {
    label: "در انتظار",
    color: "luxury-amber-400",
    bg: "bg-luxury-amber-400/10",
    border: "border-luxury-amber-400/30",
    dot: "bg-luxury-amber-400",
    icon: AlertCircle,
  },
  confirmed: {
    label: "تایید شده",
    color: "luxury-emerald-400",
    bg: "bg-luxury-emerald-400/10",
    border: "border-luxury-emerald-400/30",
    dot: "bg-luxury-emerald-400",
    icon: CheckCircle2,
  },
  "in-progress": {
    label: "در حال انجام",
    color: "luxury-sky-400",
    bg: "bg-luxury-sky-400/10",
    border: "border-luxury-sky-400/30",
    dot: "bg-luxury-sky-400",
    icon: Clock,
  },
  completed: {
    label: "انجام شده",
    color: "luxury-slate-400",
    bg: "bg-luxury-slate-400/10",
    border: "border-luxury-slate-400/30",
    dot: "bg-luxury-slate-400",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "لغو شده",
    color: "luxury-rose-400",
    bg: "bg-luxury-rose-400/10",
    border: "border-luxury-rose-400/30",
    dot: "bg-luxury-rose-400",
    icon: XCircle,
  },
};

type ViewMode = "grid" | "table" | "compact";

export default function BookingsClient() {
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  
  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>("compact");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "price" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [showSidebar, setShowSidebar] = useState(false);

  // Stats
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      total: bookings.length,
      today: bookings.filter(b => b.booking_date === today).length,
      pending: bookings.filter(b => b.status === 'pending').length,
      confirmed: bookings.filter(b => b.status === 'confirmed').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      revenue: bookings.reduce((sum, b) => sum + Number(b.price || 0), 0),
    };
  }, [bookings]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        let slug = getTenantSlug();
        
        let tenantData: any = null;
        
        if (slug === 'localhost-fallback') {
          const response = await supabase.from("tenants").select("*").eq("status", "active").limit(1);
          tenantData = response.data;
          if (tenantData && tenantData.length > 0) slug = tenantData[0].slug;
        } else {
          const response = await supabase.from("tenants").select("*").eq("slug", slug).eq("status", "active").limit(1);
          tenantData = response.data;
        }

        if (!tenantData || tenantData.length === 0) {
          setLoading(false);
          return;
        }

        const currentTenant = tenantData[0];
        setTenant(currentTenant);

        const { data: bookingsData } = await supabase
          .from("bookings")
          .select("*")
          .eq("tenant_id", currentTenant.id)
          .order("booking_date", { ascending: false })
          .order("booking_time", { ascending: false });

        if (bookingsData) {
          setBookings(bookingsData);
          setFilteredBookings(bookingsData);
        }

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter & Sort
  useEffect(() => {
    let filtered = [...bookings];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (b) =>
          b.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.customer_phone?.includes(searchQuery)
      );
    }

    // Status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((b) => b.status === selectedStatus);
    }

    // Date
    const today = new Date().toISOString().split("T")[0];
    if (selectedDate === "today") {
      filtered = filtered.filter((b) => b.booking_date === today);
    } else if (selectedDate === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      filtered = filtered.filter((b) => new Date(b.booking_date) >= weekAgo);
    } else if (selectedDate === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      filtered = filtered.filter((b) => new Date(b.booking_date) >= monthAgo);
    }

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === "date") {
        const dateA = new Date(`${a.booking_date} ${a.booking_time}`);
        const dateB = new Date(`${b.booking_date} ${b.booking_time}`);
        compareValue = dateB.getTime() - dateA.getTime();
      } else if (sortBy === "price") {
        compareValue = Number(b.price || 0) - Number(a.price || 0);
      } else if (sortBy === "name") {
        compareValue = (a.customer_name || "").localeCompare(b.customer_name || "");
      }
      
      return sortOrder === "desc" ? compareValue : -compareValue;
    });

    setFilteredBookings(filtered);
  }, [searchQuery, selectedStatus, selectedDate, sortBy, sortOrder, bookings]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!tenant) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-6 py-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Calendar className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
                مدیریت رزروها
              </h1>
              <p className="text-xs text-brand-gray mt-0.5">{tenant.name}</p>
            </div>

            <div className="flex items-center gap-3">
              {/* Calendar Button */}
         <Link href="/salon/bookings/calendar">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.02] border border-white/10 text-white font-bold hover:border-brand-gold/50 transition-all"
  >
    <CalendarDays className="w-4 h-4" strokeWidth={2.5} />
    <span className="text-sm">نمای تقویم</span>
  </motion.button>
</Link>

              {/* New Booking */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-gold to-luxury-amber-500 text-black font-bold shadow-lg shadow-brand-gold/30"
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
                <span className="text-sm">رزرو جدید</span>
              </motion.button>
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <div className="w-2 h-2 rounded-full bg-luxury-sky-400 animate-pulse" />
              <span className="text-xs font-bold text-white">{stats.today}</span>
              <span className="text-xs text-brand-gray">امروز</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <AlertCircle className="w-3.5 h-3.5 text-luxury-amber-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-luxury-amber-400">{stats.pending}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <CheckCircle2 className="w-3.5 h-3.5 text-luxury-emerald-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-luxury-emerald-400">{stats.confirmed}</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <DollarSign className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2.5} />
              <span className="text-xs font-bold text-brand-gold">{(stats.revenue / 1000000).toFixed(1)}M</span>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="جستجو با نام یا شماره تماس..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-10 py-2 text-sm text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
            >
              <option value="all" className="bg-[#1a1a1a]">همه وضعیت‌ها</option>
              <option value="pending" className="bg-[#1a1a1a]">در انتظار</option>
              <option value="confirmed" className="bg-[#1a1a1a]">تایید شده</option>
              <option value="in-progress" className="bg-[#1a1a1a]">در حال انجام</option>
              <option value="completed" className="bg-[#1a1a1a]">انجام شده</option>
              <option value="cancelled" className="bg-[#1a1a1a]">لغو شده</option>
            </select>

            {/* Date Filter */}
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
            >
              <option value="all" className="bg-[#1a1a1a]">همه تاریخ‌ها</option>
              <option value="today" className="bg-[#1a1a1a]">امروز</option>
              <option value="week" className="bg-[#1a1a1a]">هفته اخیر</option>
              <option value="month" className="bg-[#1a1a1a]">ماه اخیر</option>
            </select>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
              >
                <option value="date" className="bg-[#1a1a1a]">تاریخ</option>
                <option value="price" className="bg-[#1a1a1a]">قیمت</option>
                <option value="name" className="bg-[#1a1a1a]">نام</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-brand-gold/50 transition-all"
              >
                <ArrowUpDown className={`w-4 h-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/10 rounded-lg">
              {[
                { id: "compact" as ViewMode, icon: LayoutList },
                { id: "grid" as ViewMode, icon: LayoutGrid },
                { id: "table" as ViewMode, icon: LayoutList },
              ].map((view) => {
                const Icon = view.icon;
                return (
                  <motion.button
                    key={view.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode(view.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      viewMode === view.id
                        ? "bg-brand-gold text-black"
                        : "text-brand-gray hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2.5} />
                  </motion.button>
                );
              })}
            </div>

            {/* Export */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 hover:border-brand-gold/50 transition-all"
            >
              <Download className="w-4 h-4" strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className={`transition-all duration-300 ${showSidebar ? 'mr-96' : ''}`}>
          {/* Compact View */}
          {viewMode === "compact" && (
            <div className="space-y-2">
              {filteredBookings.length === 0 ? (
                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                  <Calendar className="w-20 h-20 mx-auto mb-4 text-brand-gray opacity-20" strokeWidth={1.5} />
                  <p className="text-xl font-bold text-white mb-2">رزروی یافت نشد</p>
                  <p className="text-brand-gray">فیلترها رو تغییر بده یا رزرو جدید ایجاد کن</p>
                </div>
              ) : (
                filteredBookings.map((booking, index) => {
                  const config = statusConfig[booking.status as keyof typeof statusConfig];
                  const StatusIcon = config.icon;
                  
                  return (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.005, x: 4 }}
                      className="relative group cursor-pointer"
                      onClick={() => {
                        setSelectedBooking(booking);
                        setShowSidebar(true);
                      }}
                    >
                      {booking.priority === "vip" && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-brand-gold to-luxury-amber-500 flex items-center justify-center z-10">
                          <Crown className="w-3 h-3 text-white" strokeWidth={2.5} />
                        </div>
                      )}

                      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-3 hover:bg-white/[0.04] hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3">
                          {/* Date */}
                          <div className="flex-shrink-0 w-16 text-center">
                            <p className="text-lg font-black text-white">
                              {new Date(booking.booking_date).toLocaleDateString("fa-IR", { day: "numeric" })}
                            </p>
                            <p className="text-[10px] text-brand-gray">
                              {new Date(booking.booking_date).toLocaleDateString("fa-IR", { month: "short" })}
                            </p>
                          </div>

                          {/* Time */}
                          <div className="flex-shrink-0">
                            <div className="px-2 py-1 rounded-lg bg-luxury-sky-400/10 border border-luxury-sky-400/30">
                              <p className="text-xs font-bold text-luxury-sky-400">{booking.booking_time}</p>
                            </div>
                          </div>

                          {/* Status Dot */}
                          <div className={`w-2 h-2 rounded-full ${config.dot} flex-shrink-0 ${booking.status === 'in-progress' ? 'animate-pulse' : ''}`} />

                          {/* Customer */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{booking.customer_name}</p>
                            <p className="text-xs text-brand-gray truncate">{booking.customer_phone}</p>
                          </div>

                          {/* Duration */}
                          {booking.duration && (
                            <div className="hidden md:flex items-center gap-1 px-2 py-1 rounded-lg bg-white/[0.02]">
                              <Clock className="w-3 h-3 text-brand-gray" strokeWidth={2.5} />
                              <span className="text-xs text-brand-gray">{booking.duration}د</span>
                            </div>
                          )}

                          {/* Status Badge */}
                          <div className={`${config.bg} border ${config.border} px-3 py-1 rounded-lg flex items-center gap-1.5 flex-shrink-0`}>
                            <StatusIcon className={`w-3 h-3 text-${config.color}`} strokeWidth={2.5} />
                            <span className={`text-xs font-bold text-${config.color}`}>{config.label}</span>
                          </div>

                          {/* Price */}
                          <div className="text-right flex-shrink-0 w-24">
                            <p className="text-sm font-black text-brand-gold">{(Number(booking.price) / 1000).toFixed(0)}K</p>
                            <p className="text-[10px] text-brand-gray">تومان</p>
                          </div>

                          {/* Actions */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all flex-shrink-0"
                          >
                            <MoreHorizontal className="w-4 h-4" strokeWidth={2.5} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          )}

          {/* Grid View */}
          {viewMode === "grid" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredBookings.map((booking, index) => {
                const config = statusConfig[booking.status as keyof typeof statusConfig];
                const StatusIcon = config.icon;
                
                return (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.02 }}
                    whileHover={{ scale: 1.02, y: -4 }}
                    onClick={() => {
                      setSelectedBooking(booking);
                      setShowSidebar(true);
                    }}
                    className="relative group cursor-pointer"
                  >
                    {booking.priority === "vip" && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br from-brand-gold to-luxury-amber-500 flex items-center justify-center z-10 shadow-lg">
                        <Crown className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                      </div>
                    )}

                    <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all">
                      {/* Status Badge */}
                      <div className={`${config.bg} border ${config.border} px-3 py-1.5 rounded-lg flex items-center gap-2 mb-4`}>
                        <StatusIcon className={`w-4 h-4 text-${config.color}`} strokeWidth={2.5} />
                        <span className={`text-xs font-bold text-${config.color}`}>{config.label}</span>
                      </div>

                      {/* Customer */}
                      <div className="mb-4">
                        <p className="text-lg font-bold text-white mb-1 truncate">{booking.customer_name}</p>
                        <div className="flex items-center gap-2 text-xs text-brand-gray">
                          <Phone className="w-3 h-3" strokeWidth={2.5} />
                          {booking.customer_phone}
                        </div>
                      </div>

                      {/* Date & Time */}
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4 text-luxury-slate-400" strokeWidth={2.5} />
                          <span className="text-white font-bold">
                            {new Date(booking.booking_date).toLocaleDateString("fa-IR", { day: "numeric", month: "short" })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-luxury-sky-400" strokeWidth={2.5} />
                          <span className="text-white font-bold">{booking.booking_time}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-brand-gray">هزینه:</span>
                        <span className="text-xl font-black text-brand-gold">
                          {(Number(booking.price) / 1000).toFixed(0)}K
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Table View */}
          {viewMode === "table" && (
            <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-right px-4 py-3 text-xs font-bold text-brand-gray">تاریخ</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-brand-gray">ساعت</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-brand-gray">مشتری</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-brand-gray">تلفن</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-brand-gray">وضعیت</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-brand-gray">مدت</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-brand-gray">قیمت</th>
                    <th className="text-right px-4 py-3 text-xs font-bold text-brand-gray">عملیات</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking, index) => {
                    const config = statusConfig[booking.status as keyof typeof statusConfig];
                    const StatusIcon = config.icon;
                    
                    return (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-all cursor-pointer"
                        onClick={() => {
                          setSelectedBooking(booking);
                          setShowSidebar(true);
                        }}
                      >
                        <td className="px-4 py-3 text-sm text-white">
                          {new Date(booking.booking_date).toLocaleDateString("fa-IR", { day: "numeric", month: "short" })}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-luxury-sky-400">{booking.booking_time}</td>
                        <td className="px-4 py-3 text-sm text-white">
                          <div className="flex items-center gap-2">
                            {booking.priority === "vip" && (
                              <Crown className="w-3 h-3 text-brand-gold" strokeWidth={2.5} />
                            )}
                            {booking.customer_name}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-brand-gray">{booking.customer_phone}</td>
                        <td className="px-4 py-3">
                          <div className={`${config.bg} border ${config.border} px-2 py-1 rounded-lg flex items-center gap-1.5 inline-flex`}>
                            <StatusIcon className={`w-3 h-3 text-${config.color}`} strokeWidth={2.5} />
                            <span className={`text-xs font-bold text-${config.color}`}>{config.label}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-brand-gray">{booking.duration}د</td>
                        <td className="px-4 py-3 text-sm font-bold text-brand-gold">
                          {Number(booking.price).toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedBooking(booking);
                              setShowSidebar(true);
                            }}
                            className="w-7 h-7 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-brand-gold/50 transition-all"
                          >
                            <Eye className="w-4 h-4" strokeWidth={2.5} />
                          </motion.button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Details */}
      <AnimatePresence>
        {showSidebar && selectedBooking && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: -400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed left-0 top-0 w-96 h-screen bg-[#0a0a0a] border-r border-white/10 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10 p-6 z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-black text-white">جزئیات رزرو</h3>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowSidebar(false)}
                    className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-luxury-rose-400/50 transition-all"
                  >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </motion.button>
                </div>

                {/* Status */}
                {(() => {
                  const config = statusConfig[selectedBooking.status as keyof typeof statusConfig];
                  const StatusIcon = config.icon;
                  return (
                    <div className={`${config.bg} border ${config.border} rounded-xl p-4 flex items-center gap-3`}>
                      <StatusIcon className={`w-5 h-5 text-${config.color}`} strokeWidth={2.5} />
                      <div>
                        <p className={`text-sm font-bold text-${config.color}`}>{config.label}</p>
                        <p className="text-xs text-brand-gray">وضعیت فعلی</p>
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-brand-gray">اطلاعات مشتری</h4>
                  
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luxury-slate-400 to-luxury-sky-400 flex items-center justify-center text-white font-black">
                        {selectedBooking.customer_name?.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white">{selectedBooking.customer_name}</p>
                        {selectedBooking.priority === "vip" && (
                          <div className="flex items-center gap-1 mt-1">
                            <Crown className="w-3 h-3 text-brand-gold" strokeWidth={2.5} />
                            <span className="text-xs font-bold text-brand-gold">مشتری VIP</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-luxury-sky-400" strokeWidth={2.5} />
                        <span className="text-brand-gray">تلفن:</span>
                        <span className="text-white font-bold">{selectedBooking.customer_phone}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Booking Details */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold text-brand-gray">جزئیات رزرو</h4>
                  
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-luxury-slate-400" strokeWidth={2.5} />
                        <span className="text-sm text-brand-gray">تاریخ</span>
                      </div>
                      <span className="text-sm font-bold text-white">
                        {new Date(selectedBooking.booking_date).toLocaleDateString("fa-IR")}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-luxury-sky-400" strokeWidth={2.5} />
                        <span className="text-sm text-brand-gray">ساعت</span>
                      </div>
                      <span className="text-sm font-bold text-white">{selectedBooking.booking_time}</span>
                    </div>

                    {selectedBooking.duration && (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-luxury-amber-400" strokeWidth={2.5} />
                          <span className="text-sm text-brand-gray">مدت زمان</span>
                        </div>
                        <span className="text-sm font-bold text-white">{selectedBooking.duration} دقیقه</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-brand-gold" strokeWidth={2.5} />
                        <span className="text-sm text-brand-gray">هزینه</span>
                      </div>
                      <span className="text-lg font-black text-brand-gold">
                        {Number(selectedBooking.price).toLocaleString()} تومان
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-luxury-emerald-400/10 border border-luxury-emerald-400/30 text-luxury-emerald-400 font-bold hover:bg-luxury-emerald-400/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />
                    تایید رزرو
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-luxury-sky-400/10 border border-luxury-sky-400/30 text-luxury-sky-400 font-bold hover:bg-luxury-sky-400/20 transition-all"
                  >
                    <Edit2 className="w-4 h-4" strokeWidth={2.5} />
                    ویرایش
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-luxury-rose-400/10 border border-luxury-rose-400/30 text-luxury-rose-400 font-bold hover:bg-luxury-rose-400/20 transition-all"
                  >
                    <Trash2 className="w-4 h-4" strokeWidth={2.5} />
                    لغو رزرو
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
