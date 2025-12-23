import { Metadata } from "next";
import Header from "../components/Header";
import NotificationsClient from "./NotificationsClient";

export const metadata: Metadata = {
  title: "اعلانات | پنل سوپرادمین",
  description: "مدیریت اعلانات سیستم",
};

export default function NotificationsPage() {
  return (
    <>
      <Header
        title="اعلانات"
        subtitle="مشاهده و مدیریت تمام اعلانات سیستم"
        breadcrumbs={[
          { label: "داشبورد", href: "/superadmin/dashboard" },
          { label: "اعلانات" },
        ]}
      />
      <NotificationsClient />
    </>
  );
}
