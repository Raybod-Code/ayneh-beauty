"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Upload,
  CalendarClock,
} from "lucide-react";
import { STYLISTS as DEFAULT_STYLISTS } from "@/app/constants/booking";

type Stylist = {
  id: string;
  name: string;
  role: string;
  image: string; // DataURL یا مسیر ثابت
  active: boolean;
  createdAt: number;
};

type Shift = {
  id: string;
  stylistId: string;
  // هفته شمسی: 0=شنبه ... 6=جمعه
  weekdayIndex: number;
  start: string; // "10:00"
  end: string; // "20:00"
  active: boolean;
};

const LS_STYLISTS = "ayneh-stylists";
const LS_SHIFTS = "ayneh-staff-shifts";

const WEEKDAYS_FA = ["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"] as const;

const makeId = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;

function safeParse<T>(raw: string | null, fallback: T): T {
  try {
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveLS(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeDefaults(): Stylist[] {
  return DEFAULT_STYLISTS.map((s: any, idx: number) => ({
    id: String(s.id ?? idx + 1),
    name: s.name,
    role: s.role,
    image: s.image, // مسیر ثابت
    active: true,
    createdAt: Date.now() - idx,
  }));
}

function buildDefaultShiftsFor(stylistId: string): Shift[] {
  return WEEKDAYS_FA.map((_, weekdayIndex) => ({
    id: makeId(),
    stylistId,
    weekdayIndex,
    start: "10:00",
    end: "20:00",
    active: true,
  }));
}

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      const res = reader.result;
      if (typeof res === "string") resolve(res);
      else reject(new Error("FileReader result is not a string"));
    });
    reader.addEventListener("error", () => reject(new Error("FileReader error")));
    reader.readAsDataURL(file);
  });
}

function toMinutes(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export default function StaffPage() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Add form
  const [addOpen, setAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({
    name: "",
    role: "",
    imageDataUrl: "" as string, // اگر خالی بود از placeholder می‌زنیم
  });
  const addFileRef = useRef<HTMLInputElement>(null);

  // Edit modal
  const [editId, setEditId] = useState<string | null>(null);

  // Delete confirm modal
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    const storedStylists = safeParse<Stylist[]>(localStorage.getItem(LS_STYLISTS), []);
    const storedShifts = safeParse<Shift[]>(localStorage.getItem(LS_SHIFTS), []);

    if (storedStylists.length === 0) {
      const seed = normalizeDefaults();
      const seedShifts = seed.flatMap((s) => buildDefaultShiftsFor(s.id));
      setStylists(seed);
      setShifts(seedShifts);
      saveLS(LS_STYLISTS, seed);
      saveLS(LS_SHIFTS, seedShifts);
    } else {
      setStylists(storedStylists);
      setShifts(storedShifts);
    }

    setIsLoaded(true);
  }, []);

  const shiftsByStylist = useMemo(() => {
    const map = new Map<string, Shift[]>();
    for (const sh of shifts) {
      const list = map.get(sh.stylistId) ?? [];
      list.push(sh);
      map.set(sh.stylistId, list);
    }
    for (const [k, list] of map) {
      list.sort((a, b) => a.weekdayIndex - b.weekdayIndex);
      map.set(k, list);
    }
    return map;
  }, [shifts]);

  const activeStylists = useMemo(() => stylists.slice().sort((a, b) => b.createdAt - a.createdAt), [stylists]);

  const selectedStylist = useMemo(() => {
    if (!editId) return null;
    return stylists.find((s) => s.id === editId) ?? null;
  }, [editId, stylists]);

  const selectedShifts = useMemo(() => {
    if (!selectedStylist) return [];
    const list = shiftsByStylist.get(selectedStylist.id) ?? [];
    // اگر دیتای قدیمی بود و روزی کم داشت، اینجا برای UI کاملش می‌کنیم
    const filled = WEEKDAYS_FA.map((_, weekdayIndex) => {
      return (
        list.find((x) => x.weekdayIndex === weekdayIndex) ?? {
          id: makeId(),
          stylistId: selectedStylist.id,
          weekdayIndex,
          start: "10:00",
          end: "20:00",
          active: true,
        }
      );
    });
    return filled;
  }, [selectedStylist, shiftsByStylist]);

  const persist = (nextStylists: Stylist[], nextShifts: Shift[]) => {
    setStylists(nextStylists);
    setShifts(nextShifts);
    saveLS(LS_STYLISTS, nextStylists);
    saveLS(LS_SHIFTS, nextShifts);
  };

  const openEdit = (id: string) => setEditId(id);

  const onAddPickFile = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("فقط فایل تصویر مجاز است.");
      return;
    }
    const dataUrl = await readFileAsDataURL(file);
    setAddForm((p) => ({ ...p, imageDataUrl: dataUrl }));
    toast.success("عکس انتخاب شد.");
  };

  const addStylist = () => {
    if (!addForm.name.trim()) {
      toast.error("نام آرایشگر را وارد کنید.");
      return;
    }

    const newStylist: Stylist = {
      id: makeId(),
      name: addForm.name.trim(),
      role: addForm.role.trim() || "Stylist",
      image: addForm.imageDataUrl || "/images/service-haircut.png",
      active: true,
      createdAt: Date.now(),
    };

    const nextStylists = [newStylist, ...stylists];
    const nextShifts = [...buildDefaultShiftsFor(newStylist.id), ...shifts];

    persist(nextStylists, nextShifts);
    setAddOpen(false);
    setAddForm({ name: "", role: "", imageDataUrl: "" });
    toast.success("آرایشگر اضافه شد.");
  };

  const requestDelete = (id: string) => setDeleteId(id);

  const confirmDelete = () => {
    if (!deleteId) return;

    const nextStylists = stylists.filter((s) => s.id !== deleteId);
    const nextShifts = shifts.filter((sh) => sh.stylistId !== deleteId);
    persist(nextStylists, nextShifts);

    setDeleteId(null);
    if (editId === deleteId) setEditId(null);
    toast.success("آرایشگر حذف شد.");
  };

  const updateStylist = (id: string, patch: Partial<Stylist>) => {
    setStylists((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  };

  const updateShift = (shiftId: string, patch: Partial<Shift>) => {
    setShifts((prev) => prev.map((s) => (s.id === shiftId ? { ...s, ...patch } : s)));
  };

  const saveAll = () => {
    // یک validation ساده برای شیفت‌ها: start < end
    for (const sh of shifts) {
      if (!sh.active) continue;
      if (toMinutes(sh.start) >= toMinutes(sh.end)) {
        toast.error("زمان شروع باید کمتر از پایان باشد.");
        return;
      }
    }
    saveLS(LS_STYLISTS, stylists);
    saveLS(LS_SHIFTS, shifts);
    toast.success("تغییرات ذخیره شد.");
  };

  const onEditPickFile = async (file?: File) => {
    if (!file || !selectedStylist) return;
    if (!file.type.startsWith("image/")) {
      toast.error("فقط فایل تصویر مجاز است.");
      return;
    }
    const dataUrl = await readFileAsDataURL(file);
    updateStylist(selectedStylist.id, { image: dataUrl });
    toast.success("عکس بروزرسانی شد.");
  };

  if (!isLoaded) return <div className="text-gray-400 p-6">در حال بارگذاری...</div>;

  return (
    <div className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#111] border border-white/10 rounded-3xl p-5">
        <div>
          <h1 className="text-2xl font-black text-white">مدیریت آرایشگرها</h1>
          <p className="text-sm text-gray-400 mt-1">
            اضافه‌کردن آرایشگر، آپلود عکس، و تنظیم شیفت هفتگی (شنبه تا جمعه).
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setAddOpen(true)}
            className="bg-[#C6A87C] text-black font-bold rounded-xl px-4 py-2.5 flex items-center gap-2 hover:bg-white transition-colors"
          >
            <Plus size={18} /> آرایشگر جدید
          </button>

          <button
            onClick={saveAll}
            className="bg-white/10 text-white font-bold rounded-xl px-4 py-2.5 flex items-center gap-2 hover:bg-white/15 transition-colors border border-white/10"
          >
            <Save size={18} /> ذخیره
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeStylists.map((s) => (
          <button
            key={s.id}
            onClick={() => openEdit(s.id)}
            className="text-right bg-[#111] border border-white/10 hover:border-[#C6A87C]/40 transition-colors rounded-3xl p-4"
          >
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 bg-black/40 shrink-0">
                <Image src={s.image} alt={s.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3">
                  <div className="font-black text-white">{s.name}</div>
                  <div
                    className={`text-xs px-2 py-1 rounded-lg border ${
                      s.active ? "border-green-500/20 text-green-400 bg-green-500/10" : "border-red-500/20 text-red-400 bg-red-500/10"
                    }`}
                  >
                    {s.active ? "فعال" : "غیرفعال"}
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">{s.role}</div>
                <div className="text-[11px] text-gray-500 mt-2 flex items-center gap-2">
                  <CalendarClock size={14} className="text-gray-500" />
                  تنظیم شیفت و مشخصات
                </div>
              </div>
              <Pencil size={18} className="text-gray-400" />
            </div>
          </button>
        ))}
      </div>

      {/* Add Modal */}
      {addOpen && (
        <Modal title="افزودن آرایشگر جدید" onClose={() => setAddOpen(false)}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="text-xs text-gray-400">
              نام
              <input
                value={addForm.name}
                onChange={(e) => setAddForm((p) => ({ ...p, name: e.target.value }))}
                className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#C6A87C]"
              />
            </label>

            <label className="text-xs text-gray-400">
              نقش
              <input
                value={addForm.role}
                onChange={(e) => setAddForm((p) => ({ ...p, role: e.target.value }))}
                className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#C6A87C]"
              />
            </label>

            <div className="md:col-span-2 flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                <Image
                  src={addForm.imageDataUrl || "/images/service-haircut.png"}
                  alt="preview"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <input
                  ref={addFileRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => onAddPickFile(e.target.files?.[0])}
                  className="hidden"
                />
                <button
                  onClick={() => addFileRef.current?.click()}
                  className="bg-white/10 text-white border border-white/10 hover:bg-white/15 rounded-xl px-4 py-2.5 font-bold flex items-center gap-2"
                >
                  <Upload size={18} /> انتخاب عکس
                </button>
                <div className="text-[11px] text-gray-500 mt-2">
                  عکس داخل مرورگر ذخیره می‌شود (فعلاً لوکال).
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex gap-3 justify-end mt-2">
              <button
                onClick={() => setAddOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white"
              >
                انصراف
              </button>
              <button
                onClick={addStylist}
                className="px-4 py-2.5 rounded-xl bg-[#C6A87C] hover:bg-white text-black font-bold"
              >
                ثبت
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {selectedStylist && (
        <Modal
          title={`ویرایش: ${selectedStylist.name}`}
          onClose={() => {
            setEditId(null);
            // برای اینکه تغییرات همون لحظه هم ذخیره بشه:
            saveLS(LS_STYLISTS, stylists);
            saveLS(LS_SHIFTS, shifts);
          }}
        >
          <div className="space-y-5">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-24 h-24 rounded-3xl overflow-hidden border border-white/10 bg-black/40 shrink-0">
                <Image src={selectedStylist.image} alt={selectedStylist.name} fill className="object-cover" />
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <label className="text-xs text-gray-400">
                  نام
                  <input
                    value={selectedStylist.name}
                    onChange={(e) => updateStylist(selectedStylist.id, { name: e.target.value })}
                    className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#C6A87C]"
                  />
                </label>

                <label className="text-xs text-gray-400">
                  نقش
                  <input
                    value={selectedStylist.role}
                    onChange={(e) => updateStylist(selectedStylist.id, { role: e.target.value })}
                    className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-[#C6A87C]"
                  />
                </label>

                <label className="text-xs text-gray-400 flex items-center justify-between bg-black/40 border border-white/10 rounded-xl px-3">
                  <span className="text-gray-300">فعال</span>
                  <input
                    type="checkbox"
                    checked={selectedStylist.active}
                    onChange={(e) => updateStylist(selectedStylist.id, { active: e.target.checked })}
                    className="accent-[#C6A87C] w-5 h-5"
                  />
                </label>

                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => onEditPickFile(e.target.files?.[0])}
                    className="hidden"
                    id="edit-upload"
                  />
                  <label
                    htmlFor="edit-upload"
                    className="flex-1 cursor-pointer bg-white/10 text-white border border-white/10 hover:bg-white/15 rounded-xl px-4 py-2.5 font-bold flex items-center justify-center gap-2"
                  >
                    <Upload size={18} /> آپلود عکس
                  </label>

                  <button
                    onClick={() => requestDelete(selectedStylist.id)}
                    className="px-4 py-2.5 rounded-xl border border-red-500/20 hover:border-red-500/40 text-red-300 hover:text-red-200 font-bold flex items-center gap-2"
                  >
                    <Trash2 size={18} /> حذف
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-black/30 border border-white/10 rounded-2xl p-4">
              <div className="text-white font-bold mb-3">شیفت هفتگی (شنبه تا جمعه)</div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                {selectedShifts.map((sh) => (
                  <div key={sh.id} className="bg-black/40 border border-white/10 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="text-white font-bold">{WEEKDAYS_FA[sh.weekdayIndex]}</div>
                      <label className="flex items-center gap-2 text-sm text-gray-300">
                        فعال
                        <input
                          type="checkbox"
                          checked={sh.active}
                          onChange={(e) => updateShift(sh.id, { active: e.target.checked })}
                          className="accent-[#C6A87C] w-5 h-5"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-xs text-gray-400">
                        شروع
                        <input
                          type="time"
                          value={sh.start}
                          onChange={(e) => updateShift(sh.id, { start: e.target.value })}
                          className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl p-2 text-gray-200 outline-none focus:border-[#C6A87C]"
                        />
                      </label>
                      <label className="text-xs text-gray-400">
                        پایان
                        <input
                          type="time"
                          value={sh.end}
                          onChange={(e) => updateShift(sh.id, { end: e.target.value })}
                          className="mt-1 w-full bg-black/40 border border-white/10 rounded-xl p-2 text-gray-200 outline-none focus:border-[#C6A87C]"
                        />
                      </label>
                    </div>

                    <div className="text-[11px] text-gray-500 mt-2">پیش‌فرض سالن: 10:00 تا 20:00</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  saveAll();
                  setEditId(null);
                }}
                className="bg-[#C6A87C] hover:bg-white text-black font-bold rounded-xl px-4 py-2.5 flex items-center gap-2"
              >
                <Save size={18} /> ذخیره و بستن
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirm Modal */}
      {deleteId && (
        <Modal title="حذف آرایشگر" onClose={() => setDeleteId(null)}>
          <div className="space-y-4">
            <p className="text-gray-300 text-sm leading-relaxed">
              این آرایشگر و تمام شیفت‌هایش حذف می‌شود. ادامه می‌دهید؟
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-white"
              >
                انصراف
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold"
              >
                حذف
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
      />
      <div className="relative w-full max-w-4xl bg-[#111] border border-white/10 rounded-3xl shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="text-white font-black">{title}</div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300"
            title="بستن"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
