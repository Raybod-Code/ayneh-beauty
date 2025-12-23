import { Metadata } from "next";
import MarketingClient from "./MarketingClient";

export const metadata: Metadata = {
  title: "بازاریابی و پیامک | Beauty Lounge",
  description: "مدیریت کمپین‌های بازاریابی و ارسال پیامک",
};

export default function MarketingPage() {
  return <MarketingClient />;
}
