// app/constants/quiz.ts

export type RecommendationType = {
  title: string;
  description: string;
  image: string;
  priceRange: string;
};

export const QUIZ_DATA: Record<string, any[]> = {
  hair: [
    {
      question: "جنس فعلی موهای شما چطور است؟",
      options: [
        { text: "خشک و وز", icon: "dry", score: { hydration: 2, keratin: 1 } },
        {
          text: "چرب و بی‌حالت",
          icon: "boring",
          score: { volume: 2, botox: 1 },
        },
        {
          text: "سالم و معمولی",
          icon: "healthy",
          score: { color: 1, light: 1 },
        },
      ],
    },
    {
      question: "چقدر اهل سشوار و اتو مو هستید؟",
      options: [
        { text: "هر روز!", icon: "style", score: { therapy: 2, hydration: 1 } },
        { text: "فقط مهمانی‌ها", icon: "ok", score: { color: 1 } },
        { text: "اصلاً (طبیعی)", icon: "sleep", score: { cut: 2 } },
      ],
    },
  ],
  nail: [
    {
      question: "وضعیت ناخن‌هایتان چگونه است؟",
      options: [
        {
          text: "شکننده و کوتاه",
          icon: "break",
          score: { laminet: 2, implant: 1 },
        },
        {
          text: "محکم و بلند",
          icon: "strong",
          score: { gelish: 2, design: 1 },
        },
        { text: "معمولی", icon: "ok", score: { cover: 1 } },
      ],
    },
    {
      question: "چه سبکی را می‌پسندید؟",
      options: [
        {
          text: "ساده و مینیمال",
          icon: "minimal",
          score: { gelish: 1, laminet: 1 },
        },
        { text: "طراحی‌های خاص", icon: "art", score: { design: 2 } },
        { text: "ناخن‌های خیلی بلند", icon: "long", score: { implant: 2 } },
      ],
    },
  ],
};

export const RECOMMENDATIONS: Record<string, RecommendationType> = {
  hydration: {
    title: "هیدروتراپی تخصصی",
    description:
      "موهای شما تشنه آبرسانی هستند! این پکیج با استفاده از دستگاه نانو استیم، رطوبت را به عمق ساقه مو برمی‌گرداند.",
    image: "/images/services/hair-care.jpg", // عکس واقعی بذار
    priceRange: "800 - 1.200",
  },
  keratin: {
    title: "کراتین احیا و صافی",
    description:
      "برای خداحافظی با وز مو و داشتن موهایی ابریشمی، کراتین بهترین گزینه برای شماست.",
    image: "/images/services/hair-color.jpg",
    priceRange: "2.500 - 4.000",
  },
  color: {
    title: "رنگ و لایت آمبره",
    description:
      "موهای شما سالم است و آماده یک تغییر جذاب! تکنیک آمبره می‌تواند چهره شما را دگرگون کند.",
    image: "/images/services/hair-color.jpg",
    priceRange: "3.000 - 6.000",
  },
  implant: {
    title: "کاشت پودر با طراحی",
    description:
      "برای داشتن ناخن‌هایی بلند و مقاوم با فرم دلخواه، کاشت پودر بهترین انتخاب است.",
    image: "/images/services/nail.jpg",
    priceRange: "450 - 600",
  },
  gelish: {
    title: "ژلیش ناخن طبیعی",
    description:
      "ناخن‌های شما فرم خوبی دارند. یک ژلیش تمیز و شیک زیبایی دستانتان را دوچندان می‌کند.",
    image: "/images/services/nail.jpg",
    priceRange: "250 - 350",
  },
  // مقدار پیش‌فرض برای جلوگیری از ارور
  default: {
    title: "مشاوره حضوری VIP",
    description:
      "برای تشخیص دقیق‌تر نیازهای شما، پیشنهاد می‌کنیم یک جلسه مشاوره رایگان رزرو کنید.",
    image: "/images/hero-bg.jpg",
    priceRange: "رایگان",
  },
};
