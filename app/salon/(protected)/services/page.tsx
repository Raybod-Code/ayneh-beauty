import { Metadata } from "next";
import ServicesClient from "./ServicesClient";

export const metadata: Metadata = {
  title: "مدیریت خدمات | Beauty Lounge",
  description: "مدیریت خدمات و سرویس‌های سالن زیبایی",
};

export default function ServicesPage() {
  return <ServicesClient />;
}
