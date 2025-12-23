"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

import {
  Calendar as RBC,
  dateFnsLocalizer,
  View,
  ToolbarProps,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay, addDays } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

import { DATES } from "@/app/constants/booking";

const DragAndDropCalendar = withDragAndDrop(RBC);

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 6 }),
  getDay,
  locales: {},
});

type BookingLS = {
  id: number;
  bookingId?: string;
  customer: string;
  service: string;
  stylist: string;
  phone?: string;
  status: string;
  date: string; // مثل: "شنبه 24"
  time: string; // مثل: "10:00"
  startAt?: string;
  endAt?: string;
};

type CalEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  resource: { bookingId: string; phone?: string; status?: string };
};

const LS_KEY = "ayneh-bookings";

const GOLD = "#C6A87C";
const BG = "#050505";
const CARD = "#0a0a0a";

// ---------- Persian formatters (Unified Jalali UI) ----------
const fmtFaTime = new Intl.DateTimeFormat("fa-IR", {
  hour: "2-digit",
  minute: "2-digit",
});

const fmtFaDateShort = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const fmtFaDateLong = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

const fmtFaMonthTitle = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
  year: "numeric",
  month: "long",
});

const getDurationMinutes = (serviceTitle: string) => {
  const t = (serviceTitle || "").toLowerCase();
  if (t.includes("کوتاهی") || t.includes("هیرکات")) return 30;
  if (t.includes("رنگ")) return 120;
  if (t.includes("پدیکور")) return 60;
  return 60;
};

// تلاش برای ساخت start/end از رزروهای قدیمی که startAt/endAt ندارند
const inferStartEndFromLegacy = (b: BookingLS) => {
  const parts = (b.date || "").split(" ");
  const day = parts[0];
  const dateStr = parts[1];

  const dayIndex = DATES.findIndex((d) => d.day === day && d.date === dateStr);
  if (dayIndex < 0) return null;

  const [hh, mm] = (b.time || "").split(":").map(Number);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;

  const base = new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() + dayIndex);

  const start = new Date(base);
  start.setHours(hh, mm, 0, 0);

  const dur = getDurationMinutes(b.service);
  const end = new Date(start.getTime() + dur * 60 * 1000);

  return { start, end };
};

function getToolbarLabel(currentDate: Date, view: View) {
  if (view === "month") return fmtFaMonthTitle.format(currentDate);
  if (view === "day") return fmtFaDateLong.format(currentDate);

  // week
  const start = startOfWeek(currentDate, { weekStartsOn: 6 });
  const end = addDays(start, 6);
  return `${fmtFaDateShort.format(start)} تا ${fmtFaDateShort.format(end)}`;
}

function AynehToolbar(props: ToolbarProps) {
  const { onNavigate, onView, view } = props;

  // نکته: react-big-calendar تاریخ فعلی را مستقیم در ToolbarProps نمی‌دهد،
  // پس ما label اصلی را استفاده نمی‌کنیم و از state بیرون (در صفحه) نمایش می‌دیم.
  // این Toolbar فقط کنترل‌هاست.
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onNavigate("PREV")}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          aria-label="قبلی"
          title="قبلی"
        >
          <ChevronRight size={18} />
        </button>

        <button
          onClick={() => onNavigate("TODAY")}
          className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition text-sm font-bold"
        >
          امروز
        </button>

        <button
          onClick={() => onNavigate("NEXT")}
          className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
          aria-label="بعدی"
          title="بعدی"
        >
          <ChevronLeft size={18} />
        </button>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
        {(["day", "week", "month"] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => onView(v)}
            className={`px-3 py-2 rounded-xl text-sm font-bold border transition whitespace-nowrap ${
              view === v
                ? "bg-[#C6A87C] text-black border-[#C6A87C]"
                : "bg-white/5 text-white border-white/10 hover:bg-white/10"
            }`}
          >
            {v === "day" ? "روز" : v === "week" ? "هفته" : "ماه"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function AdminBookingsCalendarPage() {
  const [events, setEvents] = useState<CalEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const [view, setView] = useState<View>(
    typeof window !== "undefined" && window.innerWidth < 768 ? "day" : "week"
  );
  const [date, setDate] = useState<Date>(new Date());

  const loadFromLocalStorage = () => {
    setLoading(true);

    const list: BookingLS[] = JSON.parse(localStorage.getItem(LS_KEY) || "[]");

    const mapped: CalEvent[] = list
      .map((b) => {
        // 1) جدید: startAt/endAt
        if (b.startAt && b.endAt) {
          const s = new Date(b.startAt);
          const e = new Date(b.endAt);
          if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) return null;

          return {
            id: String(b.id),
            title: `${b.customer} • ${b.service} • ${b.stylist}`,
            start: s,
            end: e,
            resource: {
              bookingId: b.bookingId || String(b.id),
              phone: b.phone,
              status: b.status,
            },
          } as CalEvent;
        }

        // 2) قدیمی: infer
        const inferred = inferStartEndFromLegacy(b);
        if (!inferred) return null;

        return {
          id: String(b.id),
          title: `${b.customer} • ${b.service} • ${b.stylist}`,
          start: inferred.start,
          end: inferred.end,
          resource: {
            bookingId: b.bookingId || String(b.id),
            phone: b.phone,
            status: b.status,
          },
        } as CalEvent;
      })
      .filter(Boolean) as CalEvent[];

    mapped.sort((a, b) => a.start.getTime() - b.start.getTime());
    setEvents(mapped);

    // برو روی جدیدترین رزرو
    if (mapped.length > 0) setDate(mapped[mapped.length - 1].start);

    setLoading(false);
  };

  // لود اولیه + ریلود خودکار
  useEffect(() => {
    loadFromLocalStorage();

    const onFocus = () => loadFromLocalStorage();
    const onVisibility = () => {
      if (document.visibilityState === "visible") loadFromLocalStorage();
    };
    const onStorage = (e: StorageEvent) => {
      if (e.key === LS_KEY) loadFromLocalStorage();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const saveEventTimeToLocalStorage = (bookingSystemId: string, start: Date, end: Date) => {
    const list: BookingLS[] = JSON.parse(localStorage.getItem(LS_KEY) || "[]");

    const next = list.map((b) =>
      String(b.id) === bookingSystemId
        ? { ...b, startAt: start.toISOString(), endAt: end.toISOString() }
        : b
    );

    localStorage.setItem(LS_KEY, JSON.stringify(next));
  };

  const onEventDrop = async ({ event, start, end }: any) => {
    setEvents((prev) => prev.map((e) => (e.id === event.id ? { ...e, start, end } : e)));
    saveEventTimeToLocalStorage(event.id, start, end);

    // مرحله بعد: API + SMS
    // await fetch("/api/booking/reschedule", ...)
  };

  // ✅ بزرگ‌تر کردن event از نظر padding/font + رنگ بهتر
  const eventPropGetter = () => ({
    style: {
      background: "linear-gradient(135deg, rgba(198,168,124,0.45), rgba(198,168,124,0.18))",
      border: "1px solid rgba(198,168,124,0.55)",
      color: "#fff",
      borderRadius: 18,
      padding: "10px 12px",
      boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
      fontSize: 13,
      lineHeight: 1.25,
    },
  });

  const formats = useMemo(() => {
    return {
      // هدر ماه
      monthHeaderFormat: (d: Date) => fmtFaMonthTitle.format(d),

      // هدر روز در month/week
      weekdayFormat: (d: Date) =>
        new Intl.DateTimeFormat("fa-IR-u-ca-persian", { weekday: "short" }).format(d),

      // شماره روز داخل month
      dayFormat: (d: Date) =>
        new Intl.DateTimeFormat("fa-IR-u-ca-persian", { day: "numeric" }).format(d),

      // هدر بالای صفحه day
      dayHeaderFormat: (d: Date) => fmtFaDateLong.format(d),

      // نمایش ساعت رویداد
      eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
        `${fmtFaTime.format(start)} - ${fmtFaTime.format(end)}`,
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
              <CalendarDays className="text-[#C6A87C]" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black">تقویم رزروها</h1>
              <p className="text-gray-400 text-sm">
                {getToolbarLabel(date, view)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadFromLocalStorage}
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#C6A87C]/40 hover:bg-white/10 transition flex items-center gap-2 text-sm"
            >
              <RefreshCw size={16} /> بروزرسانی
            </button>

            <Link
              href="/admin/bookings"
              className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-[#C6A87C]/40 hover:bg-white/10 transition flex items-center gap-2 text-sm"
            >
              <ArrowRight size={16} /> بازگشت
            </Link>
          </div>
        </div>

        <div className="p-3 md:p-5 bg-[#0a0a0a] border border-white/10 rounded-[2rem]">
          <div className="h-[72vh]">
            <DragAndDropCalendar
              localizer={localizer}
              events={events}
              rtl
              resizable
              onEventDrop={onEventDrop}
              onEventResize={onEventDrop}
              eventPropGetter={eventPropGetter as any}
              longPressThreshold={250}
              selectable={false}
              view={view}
              onView={(v) => setView(v)}
              date={date}
              onNavigate={(d) => setDate(d)}
              components={{ toolbar: AynehToolbar }}
              formats={formats as any}
              step={30}
              timeslots={2}
            />
          </div>

          {loading && (
            <div className="mt-4 text-gray-400 text-sm">در حال دریافت…</div>
          )}

          {!loading && events.length === 0 && (
            <div className="mt-4 text-gray-400 text-sm">
              هنوز رزروی ثبت نشده؛ یک رزرو جدید بساز و دوباره صفحه را فوکوس کن یا بروزرسانی بزن.
            </div>
          )}
        </div>
      </div>

      {/* Theme + Bigger Events */}
      <style jsx global>{`
        .rbc-calendar {
          background: ${BG};
          color: #fff;
        }

        .rbc-time-view,
        .rbc-month-view {
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 24px;
          overflow: hidden;
          background: ${CARD};
        }

        .rbc-header,
        .rbc-time-header,
        .rbc-time-content,
        .rbc-timeslot-group,
        .rbc-day-slot .rbc-time-slot {
          border-color: rgba(255, 255, 255, 0.08) !important;
        }

        .rbc-today {
          background: rgba(198, 168, 124, 0.08) !important;
        }

        .rbc-toolbar {
          display: none;
        }

        .rbc-label,
        .rbc-time-gutter,
        .rbc-time-header-content {
          color: rgba(255, 255, 255, 0.75);
        }

        .rbc-off-range-bg {
          background: rgba(255, 255, 255, 0.03);
        }

        .rbc-current-time-indicator {
          background-color: ${GOLD};
        }

        /* ✅ بزرگ‌تر و خواناتر شدن نوبت‌ها */
        .rbc-event {
          min-height: 44px;
        }
        .rbc-event-content {
          font-weight: 800;
          font-size: 13px;
          line-height: 1.35;
          white-space: normal;
        }
        .rbc-day-slot .rbc-event {
          margin-left: 6px;
          margin-right: 6px;
        }
      `}</style>
    </div>
  );
}
