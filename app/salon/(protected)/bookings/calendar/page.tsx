import { Metadata } from "next";
import CalendarClient from "./CalendarClient";

export const metadata: Metadata = {
  title: "تقویم رزروها | Beauty Lounge",
  description: "نمای تقویمی رزروهای سالن",
};

export default function CalendarPage() {
  return <CalendarClient />;
}
