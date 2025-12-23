"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Calendar,
  Clock,
  User,
  MoreVertical,
  Search,
  Plus,
  X,
  Ticket,
  Download,
  Share2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import html2canvas from "html2canvas-pro";
import { DigitalTicket } from "@/components/DigitalTicket";
import Link from "next/link";

// داده‌های اولیه (رزروهای قدیمی)
const INITIAL_BOOKINGS = [
  {
    id: 1,
    customer: "سارا محمدی",
    service: "رنگ و لایت",
    stylist: "الناز",
    date: "1402/10/25",
    time: "14:00",
    status: "pending",
    phone: "0912...",
  },
  {
    id: 2,
    customer: "مینا راد",
    service: "هیرکات",
    stylist: "سارا",
    date: "1402/10/25",
    time: "15:30",
    status: "confirmed",
    phone: "0935...",
  },
  {
    id: 3,
    customer: "زهرا کریمی",
    service: "میکاپ عروس",
    stylist: "الناز",
    date: "1402/10/26",
    time: "10:00",
    status: "completed",
    phone: "0919...",
  },
  {
    id: 4,
    customer: "نیلوفر",
    service: "پدیکور VIP",
    stylist: "مینا",
    date: "1402/10/26",
    time: "11:00",
    status: "cancelled",
    phone: "0936...",
  },
] as const;

type BookingStatus = "pending" | "confirmed" | "completed" | "cancelled";

type Booking = {
  id: number | string;
  bookingId?: string;
  customer: string;
  service: string;
  stylist: string;
  date: string;
  time: string;
  status: BookingStatus;
  phone?: string;

  startAt?: string;
  endAt?: string;
};

const LS_KEY = "ayneh-bookings";

// MVP duration
const SERVICE_DURATION_MINUTES: Record<string, number> = {
  کوتاهی: 30,
  هیرکات: 30,
  "رنگ مو": 120,
  "رنگ و لایت": 120,
  "کاشت ناخن": 75,
  "پدیکور VIP": 60,
  "میکاپ عروس": 120,
};

// ✅ فرمت یک‌دست تاریخ/ساعت (شمسی)
const fmtFaDate = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "Asia/Tehran",
});

const fmtFaTime = new Intl.DateTimeFormat("fa-IR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Asia/Tehran",
});

function toFaDateTime(startAt?: string) {
  if (!startAt) return null;
  const d = new Date(startAt);
  if (Number.isNaN(d.getTime())) return null;

  return {
    date: fmtFaDate.format(d),
    time: fmtFaTime.format(d),
  };
}

function normalizeId(id: number | string) {
  return String(id);
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([...INITIAL_BOOKINGS]);
  const [filter, setFilter] = useState<"all" | BookingStatus>("all");
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [ticketData, setTicketData] = useState<any>(null);
  const ticketRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    customer: "",
    phone: "",
    service: "رنگ مو",
    stylist: "سارا",
    date: "", // input date (میلادی)
    time: "",
    status: "confirmed" as BookingStatus,
  });

  useEffect(() => {
    const localBookings: Booking[] = JSON.parse(localStorage.getItem(LS_KEY) || "[]");

    if (localBookings.length > 0) {
      setBookings(() => {
        const combined = [...localBookings, ...INITIAL_BOOKINGS] as Booking[];

        const map = new Map<string, Booking>();
        for (const b of combined) map.set(normalizeId(b.id), b);
        return Array.from(map.values());
      });
    }
  }, []);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    return { total, pending, cancelled, completed };
  }, [bookings]);

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getStatusText = (status: BookingStatus | "all") => {
    switch (status) {
      case "all":
        return "همه نوبت‌ها";
      case "pending":
        return "در انتظار تایید";
      case "confirmed":
        return "تایید شده";
      case "completed":
        return "انجام شد";
      case "cancelled":
        return "لغو شده";
      default:
        return String(status);
    }
  };

  const handleDownloadTicket = async () => {
    if (!ticketRef.current || !ticketData) return;

    try {
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,
        backgroundColor: "#050505",
        useCORS: true,
        onclone: (doc) => {
          const el = doc.getElementById("digital-ticket-id");
          if (el) el.style.color = "#ffffff";
        },
      });

      const data = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.href = data;
      link.download = `Ayneh-Ticket-${ticketData.bookingId}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("خطا در دانلود بلیط:", error);
      alert("دانلود انجام نشد.");
    }
  };

  const openTicketModal = (booking: Booking) => {
    // اگر startAt موجود بود، تاریخ/زمان یک‌دست از روی آن ساخته شود
    const dt = toFaDateTime(booking.startAt);
    const showDate = dt?.date ?? booking.date;
    const showTime = dt?.time ?? booking.time;

    setTicketData({
      name: booking.customer,
      service: booking.service,
      date: showDate,
      time: showTime,
      stylist: booking.stylist,
      bookingId: booking.bookingId || String(booking.id),
    });
  };

  const filteredBookings = useMemo(() => {
    const base = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

    const q = query.trim().toLowerCase();
    if (!q) return base;

    return base.filter((b) => {
      const raw = `${b.customer} ${b.service} ${b.stylist} ${b.phone ?? ""} ${b.date} ${b.time}`.toLowerCase();
      return raw.includes(q);
    });
  }, [bookings, filter, query]);

  const resetForm = () => {
    setForm({
      customer: "",
      phone: "",
      service: "رنگ مو",
      stylist: "سارا",
      date: "",
      time: "",
      status: "confirmed",
    });
  };

  const handleCreateManualBooking = () => {
    if (!form.customer.trim()) return alert("نام مشتری را وارد کنید.");
    if (!form.date) return alert("تاریخ را انتخاب کنید.");
    if (!form.time) return alert("ساعت را انتخاب کنید.");

    // date input -> YYYY-MM-DD (میلادی) ولی نمایش را شمسی می‌کنیم [web:246]
    const [y, m, d] = form.date.split("-").map(Number);
    const [hh, mm] = form.time.split(":").map(Number);
    const start = new Date(y, m - 1, d, hh, mm, 0, 0);

    const dur = SERVICE_DURATION_MINUTES[form.service] ?? 60;
    const end = new Date(start.getTime() + dur * 60 * 1000);

    const id = Date.now();
    const booking: Booking = {
      id,
      bookingId: String(id),
      customer: form.customer.trim(),
      phone: form.phone.trim(),
      service: form.service,
      stylist: form.stylist,
      status: form.status,

      // ✅ نمایش یک‌دست شمسی از روی start
      date: fmtFaDate.format(start),
      time: fmtFaTime.format(start),

      // ✅ برای تقویم
      startAt: start.toISOString(),
      endAt: end.toISOString(),
    };

    const prev: Booking[] = JSON.parse(localStorage.getItem(LS_KEY) || "[]");
    localStorage.setItem(LS_KEY, JSON.stringify([booking, ...prev]));

    setBookings((p) => [booking, ...p]);
    setIsModalOpen(false);
    resetForm();
  };

  return (
    <div className="space-y-8 relative">
      {/* هدر آماری */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col">
          <span className="text-xs text-gray-500 mb-1">کل نوبت‌ها</span>
          <span className="text-2xl font-bold text-white">{stats.total}</span>
        </div>
        <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col">
          <span className="text-xs text-gray-500 mb-1">در انتظار تایید</span>
          <span className="text-2xl font-bold text-yellow-500">{stats.pending}</span>
        </div>
        <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col">
          <span className="text-xs text-gray-500 mb-1">کنسلی‌ها</span>
          <span className="text-2xl font-bold text-red-500">{stats.cancelled}</span>
        </div>
        <div className="bg-[#111] border border-white/5 p-4 rounded-2xl flex flex-col">
          <span className="text-xs text-gray-500 mb-1">تکمیل شده</span>
          <span className="text-2xl font-bold text-green-500">{stats.completed}</span>
        </div>
      </div>

      {/* ابزارها */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#111] p-4 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {(["all", "pending", "confirmed", "completed", "cancelled"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors capitalize whitespace-nowrap ${
                filter === tab
                  ? "bg-white text-black font-bold"
                  : "text-gray-400 hover:text-white bg-white/5"
              }`}
            >
              {getStatusText(tab)}
            </button>
          ))}
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Link
            href="/admin/bookings/calendar"
            className="px-4 py-2.5 rounded-xl font-bold bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
          >
            تقویم رزروها
          </Link>

          <div className="relative flex-1 md:w-64">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="text"
              placeholder="جستجو..."
              className="w-full bg-black border border-white/10 rounded-xl py-2.5 pr-10 pl-4 text-white focus:border-brand-gold outline-none text-sm"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-brand-gold text-black px-4 py-2.5 rounded-xl font-bold hover:bg-white transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <Plus size={18} /> نوبت جدید
          </button>
        </div>
      </div>

      {/* لیست نوبت‌ها */}
      <div className="space-y-3">
        {filteredBookings.map((item, index) => {
          const dt = toFaDateTime(item.startAt);
          const showDate = dt?.date ?? item.date;
          const showTime = dt?.time ?? item.time;

          return (
            <motion.div
              key={normalizeId(item.id)}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              className="bg-[#111] border border-white/5 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 hover:border-brand-gold/30 transition-all group"
            >
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 font-bold border border-white/5">
                  {item.customer?.charAt(0) ?? "?"}
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{item.customer}</h3>
                  <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                    <span>{item.phone}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-300 w-full md:w-auto justify-start bg-black/20 p-3 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-brand-gold rounded-full" />
                  {item.service}
                </div>
                <div className="w-[1px] h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                  <User size={14} /> {item.stylist}
                </div>
                <div className="w-[1px] h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                  <Calendar size={14} /> {showDate}
                </div>
                <div className="w-[1px] h-4 bg-white/10" />
                <div className="flex items-center gap-2">
                  <Clock size={14} /> {showTime}
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <span className={`px-3 py-1 rounded-lg text-xs border ${getStatusColor(item.status)}`}>
                  {getStatusText(item.status)}
                </span>

                <button
                  onClick={() => openTicketModal({ ...item, date: showDate, time: showTime })}
                  className="p-2 hover:bg-brand-gold hover:text-black rounded-lg text-brand-gold border border-brand-gold/20 transition-colors"
                  title="صدور کارت دعوت"
                >
                  <Ticket size={18} />
                </button>

                <button className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                  <MoreVertical size={18} />
                </button>
              </div>
            </motion.div>
          );
        })}

        {filteredBookings.length === 0 && (
          <div className="text-center text-gray-500 py-10">موردی پیدا نشد.</div>
        )}
      </div>

      {/* MODAL 1 */}
      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 z-[70] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">ثبت نوبت دستی</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                  <X />
                </button>
              </div>

              <div className="space-y-4">
                <input
                  value={form.customer}
                  onChange={(e) => setForm((p) => ({ ...p, customer: e.target.value }))}
                  type="text"
                  placeholder="نام مشتری"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold"
                />
                <input
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  type="tel"
                  placeholder="شماره تماس"
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <select
                    value={form.service}
                    onChange={(e) => setForm((p) => ({ ...p, service: e.target.value }))}
                    className="bg-black/50 border border-white/10 rounded-xl p-4 text-gray-300 outline-none focus:border-brand-gold"
                  >
                    <option value="رنگ مو">رنگ مو</option>
                    <option value="کوتاهی">کوتاهی</option>
                    <option value="هیرکات">هیرکات</option>
                    <option value="پدیکور VIP">پدیکور VIP</option>
                    <option value="میکاپ عروس">میکاپ عروس</option>
                  </select>

                  <select
                    value={form.stylist}
                    onChange={(e) => setForm((p) => ({ ...p, stylist: e.target.value }))}
                    className="bg-black/50 border border-white/10 rounded-xl p-4 text-gray-300 outline-none focus:border-brand-gold"
                  >
                    <option value="سارا">سارا</option>
                    <option value="مینا">مینا</option>
                    <option value="الناز">الناز</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    value={form.date}
                    onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
                    type="date"
                    className="bg-black/50 border border-white/10 rounded-xl p-4 text-gray-300 outline-none focus:border-brand-gold"
                  />
                  <input
                    value={form.time}
                    onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
                    type="time"
                    className="bg-black/50 border border-white/10 rounded-xl p-4 text-gray-300 outline-none focus:border-brand-gold"
                  />
                </div>

                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value as BookingStatus }))}
                  className="bg-black/50 border border-white/10 rounded-xl p-4 text-gray-300 outline-none focus:border-brand-gold"
                >
                  <option value="confirmed">تایید شده</option>
                  <option value="pending">در انتظار تایید</option>
                  <option value="completed">انجام شد</option>
                  <option value="cancelled">لغو شده</option>
                </select>
              </div>

              <div className="mt-8 flex gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="flex-1 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors"
                >
                  لغو
                </button>
                <button
                  onClick={handleCreateManualBooking}
                  className="flex-[2] py-4 rounded-xl bg-brand-gold text-black font-bold hover:bg-white transition-colors"
                >
                  ثبت نوبت
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* MODAL 2 */}
      <AnimatePresence>
        {ticketData && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTicketData(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative z-10 flex flex-col items-center gap-6 max-w-4xl w-full"
            >
              <div className="flex justify-between items-center w-full max-w-2xl px-4">
                <h3 className="text-2xl font-bold text-white">صدور کارت دعوت</h3>
                <button
                  onClick={() => setTicketData(null)}
                  className="p-2 bg-white/10 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-x-auto w-full flex justify-center py-4">
                <div className="scale-75 md:scale-100 origin-center">
                  <DigitalTicket ref={ticketRef} data={ticketData} />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownloadTicket}
                  className="bg-brand-gold text-black px-8 py-3 rounded-xl font-bold hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <Download size={20} /> دانلود فایل JPG
                </button>

                <button
                  onClick={() => {
                    const text = `آینه | کارت دعوت\nنام: ${ticketData?.name}\nسرویس: ${ticketData?.service}\nتاریخ: ${ticketData?.date}\nساعت: ${ticketData?.time}`;
                    const nav: any = navigator;
                    if (nav?.share) nav.share({ title: "Ayneh Ticket", text });
                    else alert("اشتراک‌گذاری روی این دستگاه پشتیبانی نمی‌شود.");
                  }}
                  className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center justify-center gap-2 border border-white/10"
                >
                  <Share2 size={20} /> اشتراک‌گذاری
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
