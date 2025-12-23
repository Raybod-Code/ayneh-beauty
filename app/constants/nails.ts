// app/constants/nails.ts

export type HandShape = "Slender" | "Broad" | "Petite" | null;
export type SkinTone = "Warm" | "Cool" | "Neutral" | null;

export const NAIL_RECOMMENDATIONS = {
  Slender: {
    id: "slender",
    title: "دست‌های کشیده (Slender)",
    shape: "مربعی (Square)",
    desc: "انگشتان شما کشیدگی زیبایی دارند. برای تعادل بصری، فرم‌های زاویه‌دار مثل مربعی بهترین انتخاب هستند.",
  },
  Broad: {
    id: "broad",
    title: "دست‌های پهن (Broad)",
    shape: "بادامی (Almond)",
    desc: "برای ایجاد خطای دید و ظریف‌تر نشان دادن انگشتان، فرم‌های منحنی و نوک‌تیز مثل بادامی معجزه می‌کنند.",
  },
  Petite: {
    id: "petite",
    title: "دست‌های ظریف (Petite)",
    shape: "بیضی (Oval)",
    desc: "فرم‌های بیضی باعث می‌شوند انگشتان شما بلندتر دیده شوند و ظرافت طبیعی دستانتان حفظ شود.",
  }
};

export const COLOR_PALETTES = {
  Warm: {
    title: "پوست گرم (Warm)",
    colors: ["#D2042D", "#E34234", "#FFD700", "#FF6F61", "#8B4513"],
    desc: "توناژ پوست شما گرم است. رنگ‌های آتشین و طلایی درخشش بی‌نظیری به دستانتان می‌دهند."
  },
  Cool: {
    title: "پوست سرد (Cool)",
    colors: ["#000080", "#4B0082", "#FF1493", "#708090", "#C0C0C0"],
    desc: "توناژ پوست شما سرد است. رنگ‌های جواهراتی و سرد مثل آبی نفتی و نقره‌ای برای شما ساخته شده‌اند."
  },
  Neutral: {
    title: "پوست خنثی (Neutral)",
    colors: ["#FFC0CB", "#F5F5DC", "#1A1A1A", "#FFFFFF", "#800000"],
    desc: "پوست شما تعادل کامل دارد. از رنگ‌های نود (Nude) تا مشکی براق، همه چیز به شما می‌آید."
  }
};

export function analyzeHandShape(landmarks: any[]): HandShape {
  const palmWidth = Math.sqrt(
    Math.pow(landmarks[5].x - landmarks[17].x, 2) + 
    Math.pow(landmarks[5].y - landmarks[17].y, 2)
  );
  const fingerLength = Math.sqrt(
    Math.pow(landmarks[9].x - landmarks[12].x, 2) + 
    Math.pow(landmarks[9].y - landmarks[12].y, 2)
  );
  const ratio = fingerLength / palmWidth;

  if (ratio > 0.85) return "Slender";
  if (ratio < 0.65) return "Broad";
  return "Petite";
}

export function getSkinTone(ctx: CanvasRenderingContext2D, x: number, y: number): SkinTone {
  const pixel = ctx.getImageData(x, y, 1, 1).data;
  const r = pixel[0];
  const g = pixel[1];
  const b = pixel[2];
  if (r > b + 20) return "Warm";
  if (b > r) return "Cool";
  return "Neutral";
}