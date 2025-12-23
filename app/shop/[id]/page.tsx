"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import {
  Star,
  Truck,
  ShieldCheck,
  ArrowLeft,
  ShoppingBag,
  Minus,
  Plus,
  Heart,
  Share2,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { PRODUCTS } from "@/app/utils/faceDatabase";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<string | null>("desc");

  // پیدا کردن محصول
  const product: any = PRODUCTS.find((p) => p.id === id) || {
    id: "p1",
    name: "محصول یافت نشد",
    price: 0,
    image: "/images/p1.jpg",
    description: "محصولی لوکس برای مراقبت حرفه‌ای.",
    rating: 4.8,
  };

  // هندلر افزودن به سبد با تعداد
  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addToCart(product);
  };

  // کامپوننت آکاردئون برای توضیحات
  const AccordionItem = ({
    id,
    title,
    content,
  }: {
    id: string;
    title: string;
    content: string;
  }) => (
    <div className="border-b border-white/10">
      <button
        onClick={() => setActiveTab(activeTab === id ? null : id)}
        className="w-full flex justify-between items-center py-6 text-left hover:text-[#C6A87C] transition-colors"
      >
        <span className="font-bold text-lg">{title}</span>
        <ChevronDown
          className={`transition-transform duration-300 ${
            activeTab === id ? "rotate-180 text-[#C6A87C]" : ""
          }`}
        />
      </button>
      <AnimatePresence>
        {activeTab === id && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="text-gray-400 pb-6 leading-loose">{content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#C6A87C] selection:text-black">
      <Navbar />

      <div className="pt-32 pb-20 px-6 max-w-[1400px] mx-auto">
        {/* نویگیشن بالا */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
          >
            <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30">
              <ArrowLeft
                size={18}
                className="group-hover:-translate-x-1 transition-transform"
              />
            </div>
            <span className="text-sm font-bold uppercase tracking-widest">
              بازگشت به فروشگاه
            </span>
          </Link>
          <div className="flex gap-4">
            <button className="p-3 bg-white/5 rounded-full hover:bg-[#C6A87C] hover:text-black transition-colors">
              <Share2 size={20} />
            </button>
            <button className="p-3 bg-white/5 rounded-full hover:bg-red-500 hover:text-white transition-colors">
              <Heart size={20} />
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24 items-start">
          {/* --- ستون چپ: گالری تصویر (اصلاح شده برای موبایل) --- */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            // 👇 تغییر اینجاست: در موبایل (relative) و در دسکتاپ (sticky)
            className="relative lg:sticky lg:top-32 space-y-6"
          >
            <div className="relative aspect-[4/5] bg-[#111] rounded-[3rem] overflow-hidden border border-white/5 group">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              />

              {/* بج لاکچری */}
              <div className="absolute top-6 left-6 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                <span className="text-xs font-bold uppercase tracking-widest text-[#C6A87C]">
                  Ayneh Exclusive
                </span>
              </div>
            </div>

            {/* تامبنیل‌ها (مخفی در موبایل برای شلوغ نشدن، یا نمایش اختیاری) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`aspect-square rounded-2xl overflow-hidden border cursor-pointer transition-all ${
                    i === 1
                      ? "border-[#C6A87C]"
                      : "border-transparent opacity-50 hover:opacity-100"
                  }`}
                >
                  <div className="relative w-full h-full bg-[#111]">
                    <Image
                      src={product.image}
                      alt="thumbnail"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* --- ستون راست: اطلاعات و خرید --- */}
          <div className="space-y-10 pt-4">
            {/* هدر محصول */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-4 border-b border-white/10 pb-8"
            >
              <div className="flex items-center gap-2 text-[#C6A87C] mb-2">
                <Star fill="currentColor" size={16} />
                <span className="text-sm font-bold tracking-wider">
                  {product.rating || 4.9} (۱۲۵ دیدگاه)
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black font-serif leading-tight">
                {product.name}
              </h1>
              <div className="text-3xl font-mono text-white flex items-center gap-4">
                {product.price.toLocaleString()}{" "}
                <span className="text-lg text-gray-500 font-sans font-normal">
                  تومان
                </span>
              </div>
            </motion.div>

            {/* توضیحات کوتاه */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-lg leading-relaxed font-light"
            >
              {product.description ||
                "این محصول با فرمولاسیون پیشرفته و مواد اولیه کمیاب، تجربه‌ای متفاوت از مراقبت و زیبایی را برای شما به ارمغان می‌آورد. مناسب برای انواع پوست و مو با تاثیرگذاری سریع و ماندگار."}
            </motion.p>

            {/* انتخاب تعداد و دکمه خرید */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#111] p-6 rounded-[2rem] border border-white/5 space-y-6 sticky bottom-0 md:relative z-20 md:z-0 backdrop-blur-md md:backdrop-blur-0 bg-opacity-95 md:bg-opacity-100"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-gray-400">
                  تعداد سفارش
                </span>
                <div className="flex items-center gap-6 bg-black border border-white/10 px-4 py-2 rounded-xl">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="hover:text-[#C6A87C] transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="font-mono text-xl w-4 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="hover:text-[#C6A87C] transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <button
                onClick={handleAddToCart}
                className="w-full bg-[#C6A87C] text-black py-5 rounded-2xl font-black text-xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_10px_40px_rgba(198,168,124,0.2)]"
              >
                <ShoppingBag size={24} strokeWidth={2.5} />
                افزودن به سبد خرید
              </button>

              <div className="flex justify-center gap-8 text-xs text-gray-500 pt-2">
                <div className="flex items-center gap-2">
                  <Truck size={14} /> ارسال رایگان
                </div>
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} /> ضمانت اصالت
                </div>
              </div>
            </motion.div>

            {/* آکاردئون اطلاعات تکمیلی */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="pt-4"
            >
              <AccordionItem
                id="desc"
                title="توضیحات کامل"
                content="این محصول حاصل سال‌ها تحقیق متخصصین آینه است. با استفاده از تکنولوژی‌های نوین و مواد ارگانیک، ما محصولی را خلق کرده‌ایم که نه تنها زیبایی آنی، بلکه سلامت بلندمدت را تضمین می‌کند."
              />
              <AccordionItem
                id="ingredients"
                title="مواد تشکیل‌دهنده"
                content="روغن آرگان خالص مراکشی، ویتامین E، عصاره آلوئه‌ورا، پروتئین هیدرولیز شده ابریشم و رایحه‌ی طبیعی گل‌های بهاری."
              />
              <AccordionItem
                id="usage"
                title="نحوه مصرف"
                content="مقدار کمی از محصول را روی کف دست ریخته و به آرامی ماساژ دهید. برای بهترین نتیجه، دو بار در روز (صبح و شب) استفاده کنید."
              />
            </motion.div>
          </div>
        </div>

        {/* --- محصولات پیشنهادی (Cross-Sell) --- */}
        <div className="mt-32 border-t border-white/10 pt-16">
          <h3 className="text-3xl font-black font-serif mb-12 text-center">
            مکمل‌های پیشنهادی
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {PRODUCTS.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/shop/${p.id}`} className="group block">
                <div className="relative aspect-square bg-[#111] rounded-3xl overflow-hidden mb-4 border border-white/5">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="font-bold text-lg group-hover:text-[#C6A87C] transition-colors">
                  {p.name}
                </h4>
                <p className="text-gray-500 font-mono mt-1">
                  {p.price.toLocaleString()} تومان
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
