"use client";

import { useEffect, useRef, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  CalendarDays,
  Users,
  DollarSign,
  Star,
  Sparkles,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  ChevronRight,
  Activity,
  Zap,
} from "lucide-react";
import { motion, useSpring, useMotionValue, animate } from "framer-motion";

// ─── Types ───
type KPI = {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  change: number;
  changeLabel: string;
  icon: any;
  color: string;
  glow: string;
  bg: string;
};

type Booking = {
  id: string;
  client: string;
  service: string;
  staff: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled" | "done";
  amount: number;
};

type AIInsight = {
  id: number;
  icon: any;
  color: string;
  bg: string;
  title: string;
  desc: string;
  action?: string;
};

// ─── Animated Counter ───
function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const controls = animate(0, value, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return controls.stop;
  }, [value]);
  return (
    <span>
      {prefix}
      {decimals > 0
        ? display.toFixed(decimals)
        : Math.round(display).toLocaleString("fa-IR")}
      {suffix}
    </span>
  );
}

// ─── Mini Sparkline ───
function Sparkline({
  data,
  color,
}: {
  data: number[];
  color: string;
}) {
  const w = 80;
  const h = 28;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={pts}
        opacity="0.7"
      />
      {/* last dot */}
      <circle
        cx={(((data.length - 1) / (data.length - 1)) * w)}
        cy={h - ((data[data.length - 1] - min) / range) * h}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

// ─── Revenue Chart (SVG bar chart) ───
const REVENUE_DATA = [
  { label: "شنبه", v: 4200000 },
  { label: "یکشنبه", v: 5800000 },
  { label: "دوشنبه", v: 3900000 },
  { label: "سهشنبه", v: 7200000 },
  { label: "چهارشنبه", v: 6100000 },
  { label: "پنجشنبه", v: 8400000 },
  { label: "جمعه", v: 9600000 },
];

function RevenueChart() {
  const [hovered, setHovered] = useState<number | null>(null);
  const max = Math.max(...REVENUE_DATA.map((d) => d.v));
  const W = 420;
  const H = 120;
  const barW = 36;
  const gap = (W - REVENUE_DATA.length * barW) / (REVENUE_DATA.length + 1);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${W} ${H + 28}`}
        className="w-full"
        style={{ overflow: "visible" }}
      >
        {/* Grid lines */}
        {[0.25, 0.5, 0.75, 1].map((t) => (
          <line
            key={t}
            x1={0}
            y1={H - H * t}
            x2={W}
            y2={H - H * t}
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="4 4"
          />
        ))}

        {REVENUE_DATA.map((d, i) => {
          const x = gap + i * (barW + gap);
          const barH = (d.v / max) * H;
          const y = H - barH;
          const isHov = hovered === i;
          const isToday = i === REVENUE_DATA.length - 1;
          return (
            <g key={i}>
              {/* Bar bg */}
              <rect
                x={x}
                y={0}
                width={barW}
                height={H}
                fill="transparent"
                rx={6}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
                style={{ cursor: "pointer" }}
              />
              {/* Bar fill */}
              <motion.rect
                x={x}
                y={y}
                width={barW}
                height={barH}
                rx={6}
                fill={
                  isToday
                    ? "url(#goldGrad)"
                    : isHov
                    ? "rgba(201,169,110,0.35)"
                    : "rgba(255,255,255,0.06)"
                }
                initial={{ height: 0, y: H }}
                animate={{ height: barH, y }}
                transition={{ duration: 0.8, delay: i * 0.07, ease: [0.16,1,0.3,1] }}
              />
              {/* Hover tooltip */}
              {isHov && (
                <g>
                  <rect
                    x={x - 10}
                    y={y - 32}
                    width={barW + 20}
                    height={22}
                    rx={6}
                    fill="#1a1a24"
                    stroke="rgba(255,255,255,0.08)"
                    strokeWidth={1}
                  />
                  <text
                    x={x + barW / 2}
                    y={y - 17}
                    textAnchor="middle"
                    fill="#c9a96e"
                    fontSize="9"
                    fontWeight="bold"
                  >
                    {(d.v / 1000000).toFixed(1)}M
                  </text>
                </g>
              )}
              {/* Label */}
              <text
                x={x + barW / 2}
                y={H + 18}
                textAnchor="middle"
                fill="rgba(255,255,255,0.25)"
                fontSize="10"
                fontFamily="var(--font-doran)"
              >
                {d.label}
              </text>
            </g>
          );
        })}

        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c9a96e" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#8a6c3e" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

// ─── Status badge ───
const STATUS_MAP = {
  confirmed: { label: "تایید شد", color: "text-emerald-400", bg: "bg-emerald-400/10", dot: "bg-emerald-400" },
  pending:   { label: "در انتظار",   color: "text-amber-400",   bg: "bg-amber-400/10",   dot: "bg-amber-400 animate-pulse" },
  cancelled: { label: "لغو شد",    color: "text-rose-400",    bg: "bg-rose-400/10",    dot: "bg-rose-400" },
  done:      { label: "انجام شد",   color: "text-white/30",   bg: "bg-white/5",       dot: "bg-white/20" },
};

// ─── Mock data ───
const KPI_DATA: KPI[] = [
  {
    label: "درآمد امروز",
    value: 9600000,
    suffix: " ت",
    change: 18,
    changeLabel: "نسبت به دیروز",
    icon: DollarSign,
    color: "text-[#c9a96e]",
    glow: "shadow-[#c9a96e]/20",
    bg: "bg-[#c9a96e]/10",
    sparkline: [4.2, 5.8, 3.9, 7.2, 6.1, 8.4, 9.6],
  } as any,
  {
    label: "نوبت‌های امروز",
    value: 14,
    suffix: " نوبت",
    change: 7,
    changeLabel: "نسبت به دیروز",
    icon: CalendarDays,
    color: "text-[#7b68ee]",
    glow: "shadow-[#7b68ee]/20",
    bg: "bg-[#7b68ee]/10",
    sparkline: [8, 11, 9, 13, 10, 12, 14],
  } as any,
  {
    label: "مشتریان جدید",
    value: 3,
    suffix: " نفر",
    change: -1,
    changeLabel: "نسبت به دیروز",
    icon: Users,
    color: "text-[#4ade80]",
    glow: "shadow-[#4ade80]/20",
    bg: "bg-[#4ade80]/10",
    sparkline: [1, 4, 2, 5, 3, 4, 3],
  } as any,
  {
    label: "میانگین رضایت",
    value: 4.8,
    prefix: "",
    suffix: " ★",
    change: 3,
    changeLabel: "نسبت به ماه گذشته",
    icon: Star,
    color: "text-[#f5a623]",
    glow: "shadow-[#f5a623]/20",
    bg: "bg-[#f5a623]/10",
    sparkline: [4.2, 4.5, 4.3, 4.7, 4.6, 4.9, 4.8],
  } as any,
];

const BOOKINGS: Booking[] = [
  { id: "1", client: "سارا محمدی",   service: "رنگ و هایلایت",    staff: "مریم",   time: "۱۴:۰۰", status: "confirmed", amount: 1800000 },
  { id: "2", client: "نیلوفر رضایی",  service: "کراتین کامل",      staff: "سارا",   time: "۱۵:۳۰", status: "confirmed", amount: 2200000 },
  { id: "3", client: "مینا راد",      service: "پدیکور VIP",       staff: "لیلا",   time: "۱۶:۰۰", status: "pending",   amount: 900000  },
  { id: "4", client: "زینب کریمی",   service: "براشنگ ابرو",      staff: "مریم",   time: "۱۷:۰۰", status: "cancelled", amount: 350000  },
  { id: "5", client: "فاطمه نوری",  service: "ترمیم لایت و کوتاهی", staff: "سارا",   time: "۱۸:۳۰", status: "done",      amount: 1400000 },
];

const AI_INSIGHTS: AIInsight[] = [
  {
    id: 1,
    icon: Zap,
    color: "text-[#c9a96e]",
    bg: "bg-[#c9a96e]/10",
    title: "ساعت اوج امروز: ۱۵:۰۰‬‬‬‬‬‬‬",
    desc: "۳ نوبت همزمان دارید. پیشنهاد: یک متخصص اضافه کنید.",
    action: "مدیریت کارمندان",
  },
  {
    id: 2,
    icon: Activity,
    color: "text-[#7b68ee]",
    bg: "bg-[#7b68ee]/10",
    title: "روند هفتگی مثبت",
    desc: "درآمد هفته جاری ۱۸ٕ بالاتر از هفته گذشته.",
  },
  {
    id: 3,
    icon: Users,
    color: "text-[#4ade80]",
    bg: "bg-[#4ade80]/10",
    title: "۳ مشتری VIP در خطر ریزشش",
    desc: "بیش از ۶۰ روز از آخرین مراجعه‌شان گذشته. پیام بفرستید.",
    action: "بازاریابی",
  },
];

// ─── Main Page ───
export default function AdminDashboardPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto space-y-8" dir="rtl">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-xl font-bold text-white">خوش آمدید 👋</h1>
          <p className="text-sm text-white/30 mt-1">
            {new Date().toLocaleDateString("fa-IR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c9a96e]/12 hover:bg-[#c9a96e]/20 border border-[#c9a96e]/20 text-[#c9a96e] text-sm transition-all">
            <CalendarDays size={14} />
            <span>امروز</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/4 hover:bg-white/7 border border-white/8 text-white/50 hover:text-white text-sm transition-all">
            <span>گزارش هفتگی</span>
            <ArrowUpRight size={13} />
          </button>
        </div>
      </motion.div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_DATA.map((kpi: any, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            whileHover={{ y: -2, transition: { duration: 0.2 } }}
            className="bg-[#0d0d14] border border-white/6 hover:border-white/10 rounded-2xl p-5 flex flex-col gap-4 transition-colors cursor-default"
          >
            {/* Icon + change */}
            <div className="flex items-start justify-between">
              <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center`}>
                <kpi.icon size={16} className={kpi.color} />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${
                  kpi.change >= 0
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-rose-400/10 text-rose-400"
                }`}
              >
                {kpi.change >= 0 ? (
                  <TrendingUp size={11} />
                ) : (
                  <TrendingDown size={11} />
                )}
                {Math.abs(kpi.change)}٪
              </div>
            </div>

            {/* Value */}
            <div>
              <div className={`text-2xl font-bold tabular-nums ${kpi.color}`}>
                <AnimatedNumber
                  value={kpi.value}
                  prefix={kpi.prefix}
                  suffix={kpi.suffix}
                  decimals={kpi.value % 1 !== 0 ? 1 : 0}
                />
              </div>
              <div className="text-xs text-white/30 mt-1">{kpi.label}</div>
            </div>

            {/* Sparkline */}
            <div className="flex items-end justify-between">
              <span className="text-[10px] text-white/20">{kpi.changeLabel}</span>
              <Sparkline data={kpi.sparkline} color={kpi.color.replace("text-[", "").replace("]", "")} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Middle row: Revenue chart + AI insights ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.2 }}
          className="lg:col-span-2 bg-[#0d0d14] border border-white/6 rounded-2xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-white">درآمد هفتگی</h2>
              <p className="text-xs text-white/25 mt-0.5">۷ روز گذشته</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-white/25">
                <div className="w-2 h-2 rounded-full bg-[#c9a96e]" />
                امروز
              </div>
              <div className="flex items-center gap-1.5 text-xs text-white/25">
                <div className="w-2 h-2 rounded-full bg-white/15" />
                بقیه روزها
              </div>
            </div>
          </div>
          <RevenueChart />
          <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
            <div>
              <span className="text-xs text-white/25">جمع هفته</span>
              <div className="text-base font-bold text-white mt-0.5">
                <AnimatedNumber value={45200000} suffix=" ت" />
              </div>
            </div>
            <div className="text-left">
              <span className="text-xs text-white/25">هدف هفته</span>
              <div className="text-base font-bold text-white/40 mt-0.5">50,000,000 ت</div>
            </div>
            <div className="w-32">
              <div className="flex justify-between text-[10px] text-white/25 mb-1">
                <span>پیشرفت</span>
                <span>90٪</span>
              </div>
              <div className="h-1.5 bg-white/6 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "90%" }}
                  transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-[#c9a96e] to-[#8a6c3e] rounded-full"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Insights */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.3 }}
          className="bg-[#0d0d14] border border-white/6 rounded-2xl p-6 flex flex-col"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-7 h-7 rounded-lg bg-[#c9a96e]/12 flex items-center justify-center">
              <Sparkles size={13} className="text-[#c9a96e]" />
            </div>
            <h2 className="text-sm font-semibold text-white">هوش مصنوعی</h2>
            <span className="mr-auto text-[10px] bg-[#c9a96e]/10 text-[#c9a96e] px-2 py-0.5 rounded-full border border-[#c9a96e]/15">
              ۳ پیشنهاد
            </span>
          </div>

          <div className="flex-1 space-y-3">
            {AI_INSIGHTS.map((ins, i) => (
              <motion.div
                key={ins.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.4 + i * 0.1 }}
                className="p-3.5 rounded-xl bg-white/2 border border-white/5 hover:border-white/8 transition-colors"
              >
                <div className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 rounded-lg ${ins.bg} flex items-center justify-center shrink-0 mt-0.5`}>
                    <ins.icon size={13} className={ins.color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-white/80 leading-tight">{ins.title}</p>
                    <p className="text-[11px] text-white/35 mt-1 leading-relaxed">{ins.desc}</p>
                    {ins.action && (
                      <button className={`mt-2 text-[10px] font-semibold ${ins.color} flex items-center gap-1 hover:gap-2 transition-all`}>
                        {ins.action} <ChevronRight size={10} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <button className="mt-4 w-full py-2.5 rounded-xl border border-white/6 hover:border-[#c9a96e]/20 text-xs text-white/25 hover:text-[#c9a96e] transition-all flex items-center justify-center gap-1.5">
            <Sparkles size={11} />
            تحلیل کامل AI
          </button>
        </motion.div>
      </div>

      {/* ── Today's bookings table ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.35 }}
        className="bg-[#0d0d14] border border-white/6 rounded-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
          <div className="flex items-center gap-2">
            <CalendarDays size={15} className="text-white/40" />
            <h2 className="text-sm font-semibold text-white">نوبت‌های امروز</h2>
            <span className="text-[10px] bg-white/5 text-white/30 px-2 py-0.5 rounded-full">
              {BOOKINGS.length} مورد
            </span>
          </div>
          <button className="text-xs text-white/25 hover:text-white flex items-center gap-1 transition-colors">
            مشاهده همه <ChevronRight size={12} />
          </button>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5">
                {["مشتری", "خدمت", "متخصص", "ساعت", "وضعیت", "مبلغ"].map((h) => (
                  <th key={h} className="px-6 py-3 text-right text-[11px] font-semibold text-white/25 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BOOKINGS.map((b, i) => {
                const s = STATUS_MAP[b.status];
                return (
                  <motion.tr
                    key={b.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.45 + i * 0.06 }}
                    className="border-b border-white/4 hover:bg-white/2 transition-colors group"
                  >
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-xs font-bold text-white/40">
                          {b.client.charAt(0)}
                        </div>
                        <span className="text-sm text-white/70 font-medium">{b.client}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-white/50">{b.service}</td>
                    <td className="px-6 py-3.5 text-sm text-white/40">{b.staff}</td>
                    <td className="px-6 py-3.5">
                      <div className="flex items-center gap-1.5 text-sm text-white/50">
                        <Clock size={12} className="text-white/20" />
                        {b.time}
                      </div>
                    </td>
                    <td className="px-6 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${s.bg} ${s.color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-white/50 tabular-nums">
                      {b.amount.toLocaleString("fa-IR")} ت
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden divide-y divide-white/5">
          {BOOKINGS.map((b) => {
            const s = STATUS_MAP[b.status];
            return (
              <div key={b.id} className="px-5 py-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center text-sm font-bold text-white/40 shrink-0">
                  {b.client.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white/70 truncate">{b.client}</span>
                    <span className={`text-[10px] font-semibold ${s.color}`}>{s.label}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-white/30">
                    <span>{b.service}</span>
                    <span>·</span>
                    <span>{b.time}</span>
                  </div>
                </div>
                <div className="text-xs text-white/40 tabular-nums shrink-0">
                  {(b.amount / 1000).toFixed(0)}K
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}
