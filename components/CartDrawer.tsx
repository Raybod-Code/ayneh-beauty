"use client";

import { useCart } from "@/app/context/CartContext";
import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function CartDrawer() {
  const { cartItems, removeFromCart, increaseQuantity, decreaseQuantity, isOpen, setIsOpen, cartTotal } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. لایه پس‌زمینه تار (Backdrop) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[90]"
          />

          {/* 2. بدنه اصلی دراور (Drawer) */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#111] border-l border-white/10 shadow-2xl z-[100] flex flex-col"
          >
            
            {/* هدر سبد خرید */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-[#C6A87C]" />
                <h2 className="text-xl font-bold text-white">سبد خرید شما</h2>
                <span className="bg-white/10 text-xs px-2 py-1 rounded-full text-gray-400">
                  {cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0)} آیتم
                </span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* لیست محصولات */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cartItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 space-y-4">
                  <ShoppingBag size={64} className="opacity-20" />
                  <p>سبد خرید شما خالی است.</p>
                  <button 
                    onClick={() => setIsOpen(false)}
                    className="text-[#C6A87C] hover:underline"
                  >
                    بازگشت به فروشگاه
                  </button>
                </div>
              ) : (
                cartItems.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={item.id} 
                    className="flex gap-4 bg-white/5 p-4 rounded-2xl border border-white/5"
                  >
                    {/* عکس محصول */}
                    <div className="relative w-20 h-20 bg-black rounded-xl overflow-hidden shrink-0 border border-white/10">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>

                    {/* جزئیات */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm text-white line-clamp-2">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="text-[#C6A87C] font-mono text-sm">
                          {item.price.toLocaleString()} تومان
                        </div>
                        
                        {/* کنترل تعداد */}
                        <div className="flex items-center gap-3 bg-black/50 rounded-lg px-2 py-1 border border-white/10">
                          <button onClick={() => decreaseQuantity(item.id)} className="hover:text-white text-gray-400"><Minus size={14}/></button>
                          <span className="text-xs font-mono w-4 text-center">{item.quantity || 1}</span>
                          <button onClick={() => increaseQuantity(item.id)} className="hover:text-white text-gray-400"><Plus size={14}/></button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* فوتر و دکمه پرداخت */}
            {cartItems.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#0a0a0a]">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-gray-400">جمع کل</span>
                  <span className="text-2xl font-mono font-bold text-white">
                    {cartTotal.toLocaleString()} <span className="text-sm text-gray-500 font-sans">تومان</span>
                  </span>
                </div>
                <button className="w-full bg-[#C6A87C] text-black py-4 rounded-xl font-bold text-lg hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2">
                  تسویه حساب و پرداخت
                </button>
              </div>
            )}

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}