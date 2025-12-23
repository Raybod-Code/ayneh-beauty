"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Clock,
  Phone,
  DollarSign,
  Crown,
  CheckCircle2,
  XCircle,
  AlertCircle,
  X,
  Edit2,
  Trash2,
  ArrowLeft,
  LayoutList,
  Grid3x3,
  Columns3,
  MessageSquare,
  Mail,
} from "lucide-react";

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

type CalendarView = "month" | "week" | "day";

export default function CalendarClient() {
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  
  // UI State
  const [calendarView, setCalendarView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
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
          .order("booking_date", { ascending: true })
          .order("booking_time", { ascending: true });

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

  // Filter
  useEffect(() => {
    let filtered = [...bookings];

    if (searchQuery) {
      filtered = filtered.filter(
        (b) =>
          b.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          b.customer_phone?.includes(searchQuery)
      );
    }

    if (selectedStatus !== "all") {
      filtered = filtered.filter((b) => b.status === selectedStatus);
    }

    setFilteredBookings(filtered);
  }, [searchQuery, selectedStatus, bookings]);

  // Calendar helpers
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false,
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  const getWeekDays = (date: Date) => {
    const dayOfWeek = date.getDay();
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - dayOfWeek);
    
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      days.push(day);
    }
    
    return days;
  };

  const getBookingsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredBookings.filter(b => b.booking_date === dateStr);
  };

  const getBookingsForHour = (date: Date, hour: number) => {
    const dateStr = date.toISOString().split("T")[0];
    return filteredBookings.filter(b => {
      if (b.booking_date !== dateStr) return false;
      const bookingHour = parseInt(b.booking_time?.split(":")[0] || "0");
      return bookingHour === hour;
    });
  };

  // Navigation
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (calendarView === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (calendarView === "week") {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (calendarView === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (calendarView === "week") {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

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

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-6 py-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Back Button */}
              <Link href="/salon/bookings">
                <motion.button
                  whileHover={{ scale: 1.05, x: 2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-brand-gold/50 transition-all"
                >
                  <ArrowLeft className="w-4 h-4" strokeWidth={2.5} />
                </motion.button>
              </Link>

              <div>
                <h1 className="text-2xl font-black text-white flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
                  تقویم رزروها
                </h1>
                <p className="text-xs text-brand-gray mt-0.5">{tenant.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
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

          {/* Stats & Controls */}
          <div className="flex items-center justify-between">
            {/* Stats */}
            <div className="flex items-center gap-3">
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
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" strokeWidth={2.5} />
                <input
                  type="text"
                  placeholder="جستجو..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 bg-white/[0.02] border border-white/10 rounded-xl px-10 py-2 text-sm text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                />
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
              >
                <option value="all" className="bg-[#1a1a1a]">همه</option>
                <option value="pending" className="bg-[#1a1a1a]">در انتظار</option>
                <option value="confirmed" className="bg-[#1a1a1a]">تایید شده</option>
                <option value="in-progress" className="bg-[#1a1a1a]">در حال انجام</option>
                <option value="completed" className="bg-[#1a1a1a]">انجام شده</option>
              </select>

              {/* View Switcher */}
              <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/10 rounded-lg">
                {[
                  { id: "month" as CalendarView, icon: Grid3x3, label: "ماه" },
                  { id: "week" as CalendarView, icon: Columns3, label: "هفته" },
                  { id: "day" as CalendarView, icon: LayoutList, label: "روز" },
                ].map((view) => {
                  const Icon = view.icon;
                  return (
                    <motion.button
                      key={view.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setCalendarView(view.id)}
                      className={`px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${
                        calendarView === view.id
                          ? "bg-brand-gold text-black"
                          : "text-brand-gray hover:text-white"
                      }`}
                    >
                      {view.label}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="px-6 py-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToPrevious}
              className="w-9 h-9 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-brand-gold/50 transition-all"
            >
              <ChevronRight className="w-5 h-5" strokeWidth={2.5} />
            </motion.button>
            
            <h2 className="text-xl font-black text-white min-w-[250px] text-center">
              {calendarView === "month" && currentDate.toLocaleDateString("fa-IR", { year: "numeric", month: "long" })}
              {calendarView === "week" && `هفته ${currentDate.toLocaleDateString("fa-IR", { day: "numeric", month: "short", year: "numeric" })}`}
              {calendarView === "day" && currentDate.toLocaleDateString("fa-IR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </h2>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={goToNext}
              className="w-9 h-9 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-brand-gold/50 transition-all"
            >
              <ChevronLeft className="w-5 h-5" strokeWidth={2.5} />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold hover:border-brand-gold/50 transition-all"
            >
              امروز
            </motion.button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6">
        <div className={`transition-all duration-300 ${showSidebar ? 'ml-96' : ''}`}>
          {/* Month View */}
          {calendarView === "month" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
            >
              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-px bg-white/5">
                {["شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"].map((day) => (
                  <div key={day} className="bg-[#0a0a0a] py-3 text-center">
                    <span className="text-sm font-bold text-brand-gray">{day}</span>
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-px bg-white/5">
                {getMonthDays(currentDate).map((day, index) => {
                  const dayBookings = getBookingsForDate(day.date);
                  const isToday = day.date.toISOString().split("T")[0] === today;
                  
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.01 }}
                      className={`bg-[#0a0a0a] min-h-[140px] p-3 cursor-pointer transition-all ${
                        !day.isCurrentMonth ? "opacity-30" : ""
                      } ${isToday ? "ring-2 ring-inset ring-brand-gold" : ""} hover:bg-white/[0.02]`}
                      onClick={() => {
                        if (dayBookings.length > 0) {
                          setSelectedBooking(dayBookings[0]);
                          setShowSidebar(true);
                        }
                      }}
                    >
                      {/* Date */}
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-bold ${
                          isToday 
                            ? "w-7 h-7 rounded-lg bg-brand-gold text-black flex items-center justify-center" 
                            : day.isCurrentMonth 
                            ? "text-white" 
                            : "text-brand-gray"
                        }`}>
                          {day.date.toLocaleDateString("fa-IR", { day: "numeric" })}
                        </span>
                        {dayBookings.length > 0 && (
                          <span className="text-xs font-bold text-brand-gold px-2 py-0.5 rounded-full bg-brand-gold/10">
                            {dayBookings.length}
                          </span>
                        )}
                      </div>

                      {/* Bookings */}
                      <div className="space-y-1">
                        {dayBookings.slice(0, 3).map((booking) => {
                          const config = statusConfig[booking.status as keyof typeof statusConfig];
                          return (
                            <motion.div
                              key={booking.id}
                              whileHover={{ scale: 1.02 }}
                              className={`${config.bg} border ${config.border} rounded-lg px-2 py-1.5 cursor-pointer`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedBooking(booking);
                                setShowSidebar(true);
                              }}
                            >
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${config.dot} ${booking.status === 'in-progress' ? 'animate-pulse' : ''}`} />
                                <span className="text-xs font-bold text-white truncate">
                                  {booking.booking_time}
                                </span>
                                {booking.priority === "vip" && (
                                  <Crown className="w-3 h-3 text-brand-gold flex-shrink-0" strokeWidth={2.5} />
                                )}
                              </div>
                              <p className="text-[10px] text-brand-gray truncate">
                                {booking.customer_name}
                              </p>
                            </motion.div>
                          );
                        })}
                        {dayBookings.length > 3 && (
                          <div className="text-[10px] text-brand-gray text-center py-1">
                            +{dayBookings.length - 3} مورد دیگر
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Week View */}
          {calendarView === "week" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
            >
              {/* Week Headers */}
              <div className="grid grid-cols-8 gap-px bg-white/5">
                <div className="bg-[#0a0a0a] py-3 px-4">
                  <span className="text-sm font-bold text-brand-gray">ساعت</span>
                </div>
                {getWeekDays(currentDate).map((day, index) => {
                  const isToday = day.toISOString().split("T")[0] === today;
                  return (
                    <div key={index} className={`bg-[#0a0a0a] py-3 text-center ${isToday ? 'ring-2 ring-inset ring-brand-gold' : ''}`}>
                      <p className={`text-xs font-bold ${isToday ? 'text-brand-gold' : 'text-brand-gray'}`}>
                        {day.toLocaleDateString("fa-IR", { weekday: "short" })}
                      </p>
                      <p className={`text-lg font-black ${isToday ? 'text-brand-gold' : 'text-white'} mt-1`}>
                        {day.toLocaleDateString("fa-IR", { day: "numeric" })}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Time Slots */}
              <div className="max-h-[600px] overflow-y-auto">
                {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => (
                  <div key={hour} className="grid grid-cols-8 gap-px bg-white/5 min-h-[80px]">
                    <div className="bg-[#0a0a0a] py-3 px-4 flex items-start justify-end">
                      <span className="text-sm font-bold text-brand-gray">{hour}:00</span>
                    </div>
                    {getWeekDays(currentDate).map((day, dayIndex) => {
                      const hourBookings = getBookingsForHour(day, hour);
                      return (
                        <div key={dayIndex} className="bg-[#0a0a0a] p-2 hover:bg-white/[0.02] transition-all cursor-pointer">
                          {hourBookings.map((booking) => {
                            const config = statusConfig[booking.status as keyof typeof statusConfig];
                            return (
                              <motion.div
                                key={booking.id}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowSidebar(true);
                                }}
                                className={`${config.bg} border ${config.border} rounded-lg p-2 mb-1 cursor-pointer`}
                              >
                                <div className="flex items-center gap-1 mb-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
                                  <span className="text-xs font-bold text-white truncate">{booking.booking_time}</span>
                                </div>
                                <p className="text-[10px] text-brand-gray truncate">{booking.customer_name}</p>
                                <p className="text-[9px] text-brand-gold mt-0.5">{(Number(booking.price) / 1000).toFixed(0)}K</p>
                              </motion.div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Day View */}
          {calendarView === "day" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
            >
              <div className="max-h-[700px] overflow-y-auto">
                {Array.from({ length: 14 }, (_, i) => i + 8).map((hour) => {
                  const hourBookings = getBookingsForHour(currentDate, hour);
                  return (
                    <div key={hour} className="flex gap-4 border-b border-white/5 p-4 hover:bg-white/[0.02] transition-all">
                      <div className="w-20 flex-shrink-0 text-right">
                        <span className="text-lg font-bold text-white">{hour}:00</span>
                        <p className="text-xs text-brand-gray">تا {hour + 1}:00</p>
                      </div>
                      <div className="flex-1 space-y-2">
                        {hourBookings.length === 0 ? (
                          <div className="text-center py-4 text-brand-gray text-sm">
                            رزروی وجود ندارد
                          </div>
                        ) : (
                          hourBookings.map((booking) => {
                            const config = statusConfig[booking.status as keyof typeof statusConfig];
                            const StatusIcon = config.icon;
                            return (
                              <motion.div
                                key={booking.id}
                                whileHover={{ scale: 1.01, x: 4 }}
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setShowSidebar(true);
                                }}
                                className="relative group cursor-pointer"
                              >
                                {booking.priority === "vip" && (
                                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-br from-brand-gold to-luxury-amber-500 flex items-center justify-center z-10">
                                    <Crown className="w-3 h-3 text-white" strokeWidth={2.5} />
                                  </div>
                                )}

                                <div className={`${config.bg} border ${config.border} rounded-xl p-4 hover:border-white/20 transition-all`}>
                                  <div className="flex items-center gap-4">
                                    <div className={`w-2 h-2 rounded-full ${config.dot} ${booking.status === 'in-progress' ? 'animate-pulse' : ''}`} />
                                    
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <p className="text-lg font-bold text-white">{booking.customer_name}</p>
                                        <span className="text-sm font-bold text-luxury-sky-400">{booking.booking_time}</span>
                                      </div>
                                      <div className="flex items-center gap-3 text-sm text-brand-gray">
                                        <div className="flex items-center gap-1">
                                          <Phone className="w-3.5 h-3.5" strokeWidth={2.5} />
                                          {booking.customer_phone}
                                        </div>
                                        {booking.duration && (
                                          <div className="flex items-center gap-1">
                                            <Clock className="w-3.5 h-3.5" strokeWidth={2.5} />
                                            {booking.duration} دقیقه
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    <div className={`${config.bg} border ${config.border} px-4 py-2 rounded-lg flex items-center gap-2`}>
                                      <StatusIcon className={`w-4 h-4 text-${config.color}`} strokeWidth={2.5} />
                                      <span className={`text-sm font-bold text-${config.color}`}>{config.label}</span>
                                    </div>

                                    <div className="text-right">
                                      <p className="text-xl font-black text-brand-gold">{(Number(booking.price) / 1000).toFixed(0)}K</p>
                                      <p className="text-xs text-brand-gray">تومان</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sidebar Details */}
      <AnimatePresence>
        {showSidebar && selectedBooking && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSidebar(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 w-96 h-screen bg-[#0a0a0a] border-l border-white/10 shadow-2xl z-50 overflow-y-auto"
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
