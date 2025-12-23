// app/utils/faceDatabase.ts

export const PRODUCTS = [
  { id: "p1", name: "روغن آرگان خالص", price: 850000, image: "/images/p1.jpg" },
  { id: "p2", name: "پالت کانتورینگ حرفه‌ای", price: 1200000, image: "/images/p2.jpg" },
  { id: "p3", name: "نرم‌کننده ابریشمی مو", price: 650000, image: "/images/p3.jpg" },
  { id: "p4", name: "رژلب حجم‌دهنده VIP", price: 450000, image: "/images/p4.jpg" },
  { id: "p5", name: "هایلایتر مایع مرواریدی", price: 980000, image: "/images/p5.jpg" },
  { id: "p6", name: "اسپری حجم‌دهنده مو", price: 550000, image: "/images/p6.jpg" },
];

export const AI_STYLE_ENGINE: Record<string, any> = {
  Oval: {
    title: "بیضی (Oval)",
    description: "ایده‌آل‌ترین فرم چهره. هدف ما در آینه، حفظ تعادل طبیعی و درخشش خیره‌کننده شماست.",
    palette: ["#C6A87C", "#1A1A1A", "#E6BE8A"],
    makeup: "میکاپ نود (Nude) با تاکید بر درخشش طبیعی پوست.",
    hair: "هر مدل مویی به شما می‌آید، اما براشینگ لیر پیشنهاد اول ماست.",
    service: { name: "پکیج VIP کات و استایل", link: "/booking" },
    productId: "p1"
  },
  Round: {
    title: "گرد (Round)",
    description: "هدف ما ایجاد زاویه‌های ظریف و کمی کشیدگی بصری برای استایلی مدرن و جذاب است.",
    palette: ["#4A0404", "#722F37", "#1A1A1A"],
    makeup: "کانتورینگ عمودی برای استخوان‌سازی گونه.",
    hair: "مدل‌های بلند با چتری کج برای شکستن منحنی چهره.",
    service: { name: "زاویه‌سازی فک و کانتورینگ", link: "/booking" },
    productId: "p2"
  },
  Square: {
    title: "مربعی (Square)",
    description: "شما خط فک قدرتمندی دارید. هدف ما تلطیف زوایا و ایجاد حس لطافت اشرافی در چهره است.",
    palette: ["#E5E7EB", "#C6A87C", "#F5F5F0"],
    makeup: "رژگونه دایره‌ای برای نرم کردن خطوط فک.",
    hair: "موهای حالت‌دار و موج‌های درشت (Wavy) بسیار عالیست.",
    service: { name: "کراتین تراپی و احیای ابریشمی", link: "/booking" },
    productId: "p3"
  },
  Heart: {
    title: "قلبی (Heart)",
    description: "تمرکز ما بر پر کردن فضای اطراف چانه و متعادل کردن پهنای پیشانی است.",
    palette: ["#722F37", "#E6BE8A", "#000000"],
    makeup: "تاکید بر رژلب‌های تیره و کانتورینگ بالای پیشانی.",
    hair: "باب (Bob) تا روی شانه یا شینیون‌های پایین.",
    service: { name: "میکاپ کلاسیک و کانتورینگ پیشانی", link: "/booking" },
    productId: "p4"
  },
  Diamond: {
    title: "الماسی (Diamond)",
    description: "شما خاص‌ترین استخوان‌بندی چهره را دارید. ما روی درخشش گونه‌ها و بازتر نشان دادن چانه تمرکز می‌کنیم.",
    palette: ["#1A1A1A", "#C6A87C", "#4B5563"],
    makeup: "هایلایت براق روی استخوان گونه و پیشانی.",
    hair: "پیکسی کوتاه یا موهای کاملاً جمع شده پشت سر.",
    service: { name: "فیشیال تخصصی Illuminating", link: "/booking" },
    productId: "p5"
  },
  Long: {
    title: "کشیده (Long)",
    description: "هدف ما در آینه، ایجاد پهنای بصری برای متعادل کردن طول چهره و ایجاد ظاهری اشرافی است.",
    palette: ["#F3F4F6", "#C6A87C", "#111827"],
    makeup: "خط چشم‌های کشیده و پهن کردن ابروها.",
    hair: "چتری پهن (Bangs) و حجم دادن به کناره‌های مو.",
    service: { name: "کوتاهی تخصصی چتری و براشینگ", link: "/booking" },
    productId: "p6"
  }
};