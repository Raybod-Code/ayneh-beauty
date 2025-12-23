import { Metadata } from "next";
import InventoryClient from "./InventoryClient";

export const metadata: Metadata = {
  title: "مدیریت موجودی | Beauty Lounge",
  description: "مدیریت موجودی محصولات و تجهیزات سالن",
};

export default function InventoryPage() {
  return <InventoryClient />;
}
