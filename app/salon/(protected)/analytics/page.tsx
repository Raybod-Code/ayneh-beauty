import { Metadata } from "next";
import AnalyticsClient from "./AnalyticsClient";

export const metadata: Metadata = {
  title: "گزارش‌ها و آمار | Beauty Lounge",
  description: "گزارش‌گیری و تحلیل عملکرد سالن زیبایی",
};

export default function AnalyticsPage() {
  return <AnalyticsClient />;
}
