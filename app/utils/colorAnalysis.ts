// app/utils/colorAnalysis.ts

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | null;

interface RGB {
  r: number;
  g: number;
  b: number;
}

// 1. تبدیل RGB به HSV (ریاضیات رنگ)
function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s, v };
}

// محاسبه روشنایی (Luminance) برای تشخیص تیرگی/روشنی مو
function getLuminance(r: number, g: number, b: number) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// 2. مغز متفکر تشخیص فصل
export function analyzeSeason(skinColor: RGB, hairColor: RGB): Season {
  const skinHSV = rgbToHsv(skinColor.r, skinColor.g, skinColor.b);
  const hairLuma = getLuminance(hairColor.r, hairColor.g, hairColor.b);

  // گام دوم: تشخیص گرم/سرد بودن پوست
  // Hue بین 0 تا 50 (قرمز تا زرد) معمولاً گرم در نظر گرفته میشه
  const isWarmSkin = skinHSV.h >= 0 && skinHSV.h <= 50;

  // گام سوم: تشخیص تیره/روشن بودن مو
  // عدد کمتر از 80 یعنی تیره، بیشتر یعنی روشن
  const isDarkHair = hairLuma < 80; 

  console.log("Skin Hue:", skinHSV.h, "Warm?", isWarmSkin);
  console.log("Hair Luma:", hairLuma, "Dark?", isDarkHair);

  // گام چهارم: جدول تطبیق فصل‌ها
  if (isWarmSkin) {
    return isDarkHair ? 'Autumn' : 'Spring';
  } else {
    return isDarkHair ? 'Winter' : 'Summer';
  }
}

// 3. شکارچی پیکسل (میانگین‌گیری از ناحیه مشخص شده)
export function extractRegionColor(
  ctx: CanvasRenderingContext2D, 
  points: {x: number, y: number}[] // آرایه‌ای از نقاط (مثلث صورت)
): RGB {
  let r = 0, g = 0, b = 0, count = 0;
  
  // پیدا کردن محدوده (Bounding Box) دور نقاط برای اسکن سریع‌تر
  const minX = Math.min(...points.map(p => p.x));
  const maxX = Math.max(...points.map(p => p.x));
  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));

  // خواندن پیکسل‌های خام از Canvas
  const imageData = ctx.getImageData(minX, minY, maxX - minX, maxY - minY);
  const data = imageData.data;

  // حلقه روی پیکسل‌ها (با گام 10 برای سرعت بالاتر)
  for (let i = 0; i < data.length; i += 4 * 10) { 
    // اگر پیکسل شفاف نیست (Alpha > 0)
    if (data[i + 3] > 0) {
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
      count++;
    }
  }

  return {
    r: Math.round(r / count) || 0,
    g: Math.round(g / count) || 0,
    b: Math.round(b / count) || 0
  };
}