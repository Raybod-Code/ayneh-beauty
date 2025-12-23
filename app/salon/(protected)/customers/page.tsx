import { Metadata } from "next";
import CustomersClient from "./CustomersClient";

export const metadata: Metadata = {
  title: "مدیریت مشتریان | Beauty Lounge",
  description: "مدیریت مشتریان و پایگاه داده سالن زیبایی",
};

export default function CustomersPage() {
  return <CustomersClient />;
}
