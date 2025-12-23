import { Metadata } from "next";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = {
  title: "تنظیمات سیستم | پنل سوپرادمین",
  description: "مدیریت تنظیمات کلی سیستم",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
