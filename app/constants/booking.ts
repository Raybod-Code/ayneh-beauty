// app/constants/booking.ts

export const STYLISTS = [
  {
    id: 1,
    name: "سارا",
    role: "متخصص رنگ و لایت",
    image: "/images/service-color.png",
  },
  {
    id: 2,
    name: "مینا",
    role: "هیرکات آرتیست",
    image: "/images/service-haircut.png",
  },
  {
    id: 3,
    name: "الناز",
    role: "میکاپ آرتیست",
    image: "/images/service-bridal.png",
  },
] as const;

const pad2 = (n: number) => String(n).padStart(2, "0"); // [web:358]

const generateTimeSlots = (startHHmm: string, endHHmm: string, stepMinutes: number) => {
  const [sh, sm] = startHHmm.split(":").map(Number);
  const [eh, em] = endHHmm.split(":").map(Number);

  const start = sh * 60 + sm;
  const end = eh * 60 + em;

  const slots: string[] = [];
  for (let t = start; t <= end; t += stepMinutes) {
    const hh = Math.floor(t / 60);
    const mm = t % 60;
    slots.push(`${pad2(hh)}:${pad2(mm)}`);
  }
  return slots;
};

// ✅ استاندارد: از 10:00 تا 20:00 هر 30 دقیقه
export const TIME_SLOTS = generateTimeSlots("10:00", "20:00", 30);

// اگر هنوز جایی از پروژه از DATES استفاده می‌کنی، می‌تونی نگهش داری.
// ولی در نسخه جدید booking/page.tsx تو، DATES دیگر لازم نیست.
export const DATES = [
  { day: "شنبه", date: "24", active: true },
  { day: "یک‌شنبه", date: "25", active: true },
  { day: "دوشنبه", date: "26", active: true },
  { day: "سه‌شنبه", date: "27", active: true },
  { day: "چهارشنبه", date: "28", active: true },
  { day: "پنج‌شنبه", date: "29", active: true },
  { day: "جمعه", date: "30", active: true },
] as const;
