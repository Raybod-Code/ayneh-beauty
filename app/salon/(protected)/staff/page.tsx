import { Metadata } from "next";
import StaffClient from "./StaffClient";

export const metadata: Metadata = {
  title: "مدیریت کارمندان | Beauty Lounge",
  description: "مدیریت کارمندان و تیم سالن زیبایی",
};

export default function StaffPage() {
  return <StaffClient />;
}
