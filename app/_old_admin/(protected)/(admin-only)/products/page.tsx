"use client";

import { useState } from "react";
import Image from "next/image";
import { Edit, Trash2, Plus, Package, X, Upload, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS } from "@/app/constants"; 

export default function ProductsAdminPage() {
  // استیت‌ها برای مدیریت لیست و مودال‌ها
  const [products, setProducts] = useState(PRODUCTS); 
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null); 
  const [deletingProduct, setDeletingProduct] = useState<any>(null); 

  // تابع حذف محصول از لیست
  const handleDelete = () => {
    if (deletingProduct) {
      setProducts(products.filter(p => p.id !== deletingProduct.id));
      setDeletingProduct(null);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* هدر صفحه و دکمه افزودن */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">انبار محصولات</h1>
          <p className="text-gray-400 text-sm">مدیریت موجودی و قیمت‌های بوتیک</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-brand-gold text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors flex items-center gap-2"
        >
          <Plus size={20} /> محصول جدید
        </button>
      </div>

      {/* لیست محصولات */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {products.map((product) => (
            <motion.div 
              layout
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              key={product.id} 
              className="bg-[#111] border border-white/5 rounded-2xl p-4 flex flex-col md:flex-row items-center gap-6 group hover:border-brand-gold/30 transition-all"
            >
              {/* تصویر محصول */}
              <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-white/10 shrink-0">
                <Image src={product.image} alt={product.title} fill className="object-cover" />
              </div>

              {/* اطلاعات محصول */}
              <div className="flex-1 text-center md:text-right w-full">
                <h3 className="font-bold text-lg text-white mb-1">{product.title}</h3>
                <p className="text-gray-500 text-sm mb-3">{product.enTitle}</p>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                   <span className="bg-white/5 text-xs px-3 py-1 rounded-lg text-gray-300 border border-white/5">{product.category}</span>
                   {/* وضعیت موجودی (به صورت دمو همیشه موجود) */}
                   <span className="bg-green-500/10 text-xs px-3 py-1 rounded-lg text-green-400 border border-green-500/20">موجود</span>
                </div>
              </div>

              {/* قیمت */}
              <div className="flex flex-col items-center md:items-end gap-1 px-4 border-r-0 md:border-r border-white/5 w-full md:w-auto py-4 md:py-0">
                <span className="text-brand-gold font-mono font-bold text-xl">{product.price}</span>
                <span className="text-gray-500 text-xs">تومان</span>
              </div>

              {/* دکمه‌های ویرایش و حذف */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-center">
                <button 
                  onClick={() => setEditingProduct(product)}
                  className="p-3 rounded-xl border border-white/10 text-blue-400 hover:text-white hover:bg-blue-500/20 transition-colors"
                >
                  <Edit size={18} />
                </button>
                <button 
                  onClick={() => setDeletingProduct(product)}
                  className="p-3 rounded-xl border border-white/10 text-red-400 hover:bg-red-500/10 hover:border-red-500/30 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>

            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- MODAL: افزودن / ویرایش --- */}
      <AnimatePresence>
        {(isAddModalOpen || editingProduct) && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 100 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl p-8 z-[70] shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Package className="text-brand-gold" /> 
                  {editingProduct ? "ویرایش محصول" : "تعریف محصول جدید"}
                </h2>
                <button onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }} className="text-gray-400 hover:text-white"><X /></button>
              </div>
              
              {/* فرم محصول */}
              <div className="space-y-6">
                {/* آپلود عکس */}
                <div className="w-full h-40 border-2 border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center text-gray-500 hover:border-brand-gold/50 hover:text-brand-gold hover:bg-brand-gold/5 transition-all cursor-pointer">
                   <Upload size={32} className="mb-2" />
                   <span className="text-sm">آپلود تصویر محصول</span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                   <div className="space-y-2">
                      <label className="text-xs text-gray-500">نام محصول (فارسی)</label>
                      <input type="text" defaultValue={editingProduct?.title} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold transition-colors" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs text-gray-500">نام محصول (انگلیسی)</label>
                      <input type="text" defaultValue={editingProduct?.enTitle} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold text-left transition-colors" dir="ltr" />
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                   <div className="col-span-2 space-y-2">
                      <label className="text-xs text-gray-500">قیمت (تومان)</label>
                      <input type="text" defaultValue={editingProduct?.price} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold text-left transition-colors" dir="ltr" />
                   </div>
                   <div className="space-y-2">
                      <label className="text-xs text-gray-500">موجودی</label>
                      <input type="number" defaultValue={20} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold text-center transition-colors" />
                   </div>
                </div>

                <div className="space-y-2">
                   <label className="text-xs text-gray-500">توضیحات</label>
                   <textarea rows={3} defaultValue={editingProduct?.description} className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-brand-gold resize-none transition-colors"></textarea>
                </div>
              </div>

              <div className="mt-8 flex gap-3 pt-6 border-t border-white/10">
                <button onClick={() => { setIsAddModalOpen(false); setEditingProduct(null); }} className="flex-1 py-4 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white font-bold">انصراف</button>
                <button className="flex-[2] py-4 rounded-xl bg-brand-gold text-black font-bold hover:bg-white transition-colors">
                  {editingProduct ? "ذخیره تغییرات" : "ایجاد محصول"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* --- MODAL: حذف (Delete Confirmation) --- */}
      <AnimatePresence>
        {deletingProduct && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setDeletingProduct(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80]"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-[#111] border border-red-500/30 rounded-3xl p-8 z-[90] shadow-2xl text-center"
            >
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center text-red-500 mx-auto mb-6 border border-red-500/20">
                <AlertCircle size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">حذف محصول</h3>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed font-light">
                آیا مطمئن هستید که می‌خواهید 
                <span className="text-white font-bold mx-1">"{deletingProduct.title}"</span> 
                را حذف کنید؟ این عملیات غیرقابل بازگشت است.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeletingProduct(null)} className="flex-1 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-colors text-white">لغو</button>
                <button onClick={handleDelete} className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20">بله، حذف کن</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}