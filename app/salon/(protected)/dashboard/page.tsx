import { Metadata } from "next";
import Header from "../components/Header";
import SalonDashboardClient from "./SalonDashboardClient";
import RealtimeStats from "@/components/dashboard/RealtimeStats";

export const metadata: Metadata = {
  title: "داشبورد سالن | آینه",
  description: "مدیریت سالن زیبایی",
};

export default function SalonDashboardPage() {
  return (
    <>
      <Header
        title="داشبورد سالن"
        subtitle="خلاصه‌ای از عملکرد و وضعیت سالن"
        breadcrumbs={[{ label: "داشبورد" }]}
      />
         <RealtimeStats />
      <SalonDashboardClient />
    </>
  );
}
