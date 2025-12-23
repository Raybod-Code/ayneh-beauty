import { Metadata } from "next";
import BookingsClient from "./BookingsClient";

export const metadata: Metadata = {
  title: "رزروها | Beauty Lounge",
  description: "مدیریت رزروها و وقت‌های سالن",
};

export default function BookingsPage() {
  return <BookingsClient />;
}
