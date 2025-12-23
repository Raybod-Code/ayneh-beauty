// app/store/useCartStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  title: string;
  price: string; // قیمت به صورت رشته "۱.۸۰۰.۰۰۰"
  image: string;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean; // آیا سبد خرید باز است؟
  
  // اکشن‌ها
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: any) => void;
  removeItem: (id: number) => void;
  increaseQuantity: (id: number) => void;
  decreaseQuantity: (id: number) => void;
  clearCart: () => void;
  
  // محاسبات
  totalItems: () => number;
  totalPrice: () => string;
}

// تابع کمکی برای تبدیل قیمت فارسی/رشته‌ای به عدد
const parsePrice = (price: string) => {
  return parseInt(price.replace(/\./g, '').replace(/,/g, '')) || 0;
};

// تابع کمکی برای فرمت کردن عدد به قیمت فارسی
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fa-IR').format(price);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          // اگر محصول بود، تعدادش رو زیاد کن
          set({
            items: currentItems.map((item) =>
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
            isOpen: true, // سبد رو باز کن تا ببینه اضافه شد
          });
        } else {
          // اگر نبود، اضافه‌ش کن
          set({
            items: [...currentItems, { ...product, quantity: 1 }],
            isOpen: true,
          });
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },

      increaseQuantity: (id) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        });
      },

      decreaseQuantity: (id) => {
        const currentItems = get().items;
        const targetItem = currentItems.find((item) => item.id === id);

        if (targetItem && targetItem.quantity > 1) {
          set({
            items: currentItems.map((item) =>
              item.id === id ? { ...item, quantity: item.quantity - 1 } : item
            ),
          });
        } else {
          // اگر ۱ دونه بود و کم کرد، حذفش کن
          get().removeItem(id);
        }
      },

      clearCart: () => set({ items: [] }),

      totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),

      totalPrice: () => {
        const total = get().items.reduce((sum, item) => {
          return sum + (parsePrice(item.price) * item.quantity);
        }, 0);
        return formatPrice(total);
      },
    }),
    {
      name: 'ayneh-cart-storage', // اسم کلید در لوکال استوریج (برای اینکه با رفرش نپره)
    }
  )
);