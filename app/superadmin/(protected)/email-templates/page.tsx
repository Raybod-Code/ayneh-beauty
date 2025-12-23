import { Metadata } from "next";
import Header from "../components/Header";
import EmailTemplatesClient from "./EmailTemplatesClient";

export const metadata: Metadata = {
  title: "قالب‌های ایمیل | پنل سوپرادمین",
  description: "مدیریت قالب‌های ایمیل سیستم",
};

export default function EmailTemplatesPage() {
  return (
    <>
      <Header
        title="قالب‌های ایمیل"
        subtitle="مدیریت و ویرایش قالب‌های ایمیل سیستم"
        breadcrumbs={[
          { label: "داشبورد", href: "/superadmin/dashboard" },
          { label: "قالب‌های ایمیل" },
        ]}
      />
      <EmailTemplatesClient />
    </>
  );
}
