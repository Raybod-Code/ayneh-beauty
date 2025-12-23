import { Metadata } from "next";
import SalonLoginForm from "./SalonLoginForm";

export const metadata: Metadata = {
  title: "ورود مدیر سالن | آینه",
  description: "ورود به پنل مدیریت سالن",
};

export default function SalonLoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
      <SalonLoginForm />
    </div>
  );
}
