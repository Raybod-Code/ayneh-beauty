"use client";

import { useCartStore } from "@/app/store/useCartStore";

export default function AddToCartButton({ product }: { product: any }) {
  const { addItem } = useCartStore();

  return (
    <button
      onClick={() => addItem(product)}
      className="w-full bg-brand-gold text-black py-5 rounded-full font-bold text-lg hover:bg-white transition-colors shadow-[0_0_30px_rgba(198,168,124,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-shadow cursor-pointer"
    >
      افزودن به سبد خرید
    </button>
  );
}
