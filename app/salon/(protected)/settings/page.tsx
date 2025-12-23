import { Metadata } from "next";
import SettingsClient from "./SettingsClient";

export const metadata: Metadata = {
  title: "تنظیمات | Beauty Lounge",
  description: "تنظیمات و پیکربندی سالن زیبایی",
};

export default function SettingsPage() {
  return <SettingsClient />;
}
