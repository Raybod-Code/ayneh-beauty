import { Metadata } from "next";
import FinancialClient from "./FinancialClient";

export const metadata: Metadata = {
  title: "مدیریت مالی | Beauty Lounge",
  description: "مدیریت مالی و حسابداری سالن زیبایی",
};

export default function FinancialPage() {
  return <FinancialClient />;
}
