"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity?: number;
}

interface CartContextType {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<Product[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // 👈 چک می‌کنیم سایت لود شده یا نه

  // 1. فقط وقتی سایت لود شد اطلاعات رو بخون (رفع ارور کنسول)
  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem("ayneh-cart");
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error("خطا در بارگذاری سبد خرید:", error);
      }
    }
  }, []);

  // 2. ذخیره کردن
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("ayneh-cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      } else {
        setIsOpen(true); // باز کردن خودکار سبد
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const increaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: Math.max(1, (item.quantity || 1) - 1) };
        }
        return item;
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  const cartCount = cartItems.reduce((count, item) => count + (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        isOpen,
        setIsOpen,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};