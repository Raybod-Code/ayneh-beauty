// app/utils/faceLogic.ts
import { AI_STYLE_ENGINE } from "./faceDatabase";

const getDistance = (p1: any, p2: any) => 
  Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));

export const analyzeFaceGeometry = (landmarks: any[]) => {
  if (!landmarks || landmarks.length < 400) return null; // امنیت بیشتر برای تعداد نقاط

  const foreheadWidth = getDistance(landmarks[103], landmarks[332]);
  const cheekboneWidth = getDistance(landmarks[234], landmarks[454]);
  const jawlineWidth = getDistance(landmarks[58], landmarks[288]);
  const faceLength = getDistance(landmarks[10], landmarks[152]);

  // نسبت طول به عرض
  const ratio = faceLength / cheekboneWidth;

  // منطق طبقه‌بندی دقیق‌تر
  if (ratio > 1.55) return AI_STYLE_ENGINE.Long;
  
  if (cheekboneWidth > foreheadWidth && cheekboneWidth > jawlineWidth) {
    if (jawlineWidth < foreheadWidth * 0.85) return AI_STYLE_ENGINE.Heart;
    return AI_STYLE_ENGINE.Diamond;
  }
  
  const widthDiff = Math.abs(faceLength - cheekboneWidth);
  if (widthDiff < 0.15 * faceLength) {
    if (jawlineWidth > foreheadWidth * 0.88) return AI_STYLE_ENGINE.Square;
    return AI_STYLE_ENGINE.Round;
  }

  return AI_STYLE_ENGINE.Oval; // به عنوان فرم ایده‌آل و پیش‌فرض
};