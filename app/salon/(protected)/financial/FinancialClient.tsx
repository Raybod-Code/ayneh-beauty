"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Receipt,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar,
  Search,
  Edit2,
  Trash2,
  X,
  Tag,
} from "lucide-react";

// Helper function
function getTenantSlug(): string {
  if (typeof window === 'undefined') return '';
  const hostname = window.location.hostname;
  const parts = hostname.split('.');
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.startsWith('localhost:')) {
    return 'localhost-fallback';
  }
  if (parts.length >= 2) return parts[0];
  return '';
}

type TransactionType = "income" | "expense";
type PaymentMethod = "cash" | "card" | "transfer" | "other";

interface Transaction {
  id: string;
  tenant_id: string;
  type: TransactionType;
  amount: number;
  category: string;
  description: string;
  payment_method: PaymentMethod;
  date: string;
  reference_type?: string;
  reference_id?: string;
  created_at: string;
}

export default function FinancialClient() {
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  
  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"all" | TransactionType>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(new Date().toISOString().slice(0, 7));
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    type: "income" as TransactionType,
    amount: "",
    category: "",
    description: "",
    payment_method: "cash" as PaymentMethod,
    date: new Date().toISOString().split("T")[0],
  });

  // Categories
  const incomeCategories = [
    "خدمات",
    "محصولات",
    "پکیج",
    "سایر درآمد",
  ];

  const expenseCategories = [
    "حقوق و دستمزد",
    "اجاره",
    "آب و برق",
    "مواد اولیه",
    "تجهیزات",
    "بازاریابی",
    "تعمیر و نگهداری",
    "سایر هزینه",
  ];

  const paymentMethods = [
    { id: "cash" as PaymentMethod, label: "نقدی" },
    { id: "card" as PaymentMethod, label: "کارت" },
    { id: "transfer" as PaymentMethod, label: "انتقال" },
    { id: "other" as PaymentMethod, label: "سایر" },
  ];

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const supabase = createClient();
        let slug = getTenantSlug();
        
        let tenantData: any = null;
        
        if (slug === 'localhost-fallback') {
          const response = await supabase.from("tenants").select("*").eq("status", "active").limit(1);
          tenantData = response.data;
          if (tenantData && tenantData.length > 0) slug = tenantData[0].slug;
        } else {
          const response = await supabase.from("tenants").select("*").eq("slug", slug).eq("status", "active").limit(1);
          tenantData = response.data;
        }

        if (!tenantData || tenantData.length === 0) {
          setLoading(false);
          return;
        }

        const currentTenant = tenantData[0];
        setTenant(currentTenant);

        // Fetch transactions
        const { data: transactionsData } = await supabase
          .from("transactions")
          .select("*")
          .eq("tenant_id", currentTenant.id)
          .order("date", { ascending: false });

        if (transactionsData) {
          setTransactions(transactionsData);
          setFilteredTransactions(transactionsData);
        }

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter transactions
  useEffect(() => {
    let filtered = [...transactions];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Type
    if (selectedType !== "all") {
      filtered = filtered.filter((t) => t.type === selectedType);
    }

    // Month
    if (selectedMonth) {
      filtered = filtered.filter((t) => t.date.startsWith(selectedMonth));
    }

    setFilteredTransactions(filtered);
  }, [searchQuery, selectedType, selectedMonth, transactions]);

  // Calculate stats
  const stats = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const expense = filteredTransactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + Number(t.amount), 0);

    const balance = income - expense;

    // By category
    const incomeByCategory: { [key: string]: number } = {};
    const expenseByCategory: { [key: string]: number } = {};

    filteredTransactions.forEach(t => {
      if (t.type === "income") {
        incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + Number(t.amount);
      } else {
        expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + Number(t.amount);
      }
    });

    // By payment method
    const byPaymentMethod: { [key: string]: number } = {};
    filteredTransactions.forEach(t => {
      byPaymentMethod[t.payment_method] = (byPaymentMethod[t.payment_method] || 0) + Number(t.amount);
    });

    return {
      income,
      expense,
      balance,
      incomeByCategory,
      expenseByCategory,
      byPaymentMethod,
    };
  }, [filteredTransactions]);

  // Handle modal
  const openModal = (transaction?: Transaction) => {
    if (transaction) {
      setSelectedTransaction(transaction);
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        category: transaction.category,
        description: transaction.description,
        payment_method: transaction.payment_method,
        date: transaction.date,
      });
      setIsEditing(true);
    } else {
      setSelectedTransaction(null);
      setFormData({
        type: "income",
        amount: "",
        category: "",
        description: "",
        payment_method: "cash",
        date: new Date().toISOString().split("T")[0],
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTransaction(null);
    setIsEditing(false);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const supabase = createClient();
      
      if (isEditing && selectedTransaction) {
        // Update
        const { error } = await supabase
          .from("transactions")
          .update({
            type: formData.type,
            amount: Number(formData.amount),
            category: formData.category,
            description: formData.description,
            payment_method: formData.payment_method,
            date: formData.date,
          })
          .eq("id", selectedTransaction.id);

        if (error) throw error;

        setTransactions(transactions.map(t => 
          t.id === selectedTransaction.id 
            ? { ...t, ...formData, amount: Number(formData.amount) }
            : t
        ));
      } else {
        // Create
        const { data, error } = await supabase
          .from("transactions")
          .insert([{
            tenant_id: tenant.id,
            type: formData.type,
            amount: Number(formData.amount),
            category: formData.category,
            description: formData.description,
            payment_method: formData.payment_method,
            date: formData.date,
          }])
          .select();

        if (error) throw error;
        if (data) {
          setTransactions([data[0], ...transactions]);
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error:", error);
      alert("خطا در ثبت تراکنش!");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این تراکنش اطمینان دارید؟")) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("transactions")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-brand-gold border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!tenant) return null;

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Wallet className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
                مدیریت مالی
              </h1>
              <p className="text-xs text-brand-gray mt-0.5">{tenant.name}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal()}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-gold to-luxury-amber-500 text-black font-bold shadow-lg shadow-brand-gold/30"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              <span className="text-sm">تراکنش جدید</span>
            </motion.button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="جستجو در تراکنش‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-10 py-2 text-sm text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
            >
              <option value="all" className="bg-[#1a1a1a]">همه</option>
              <option value="income" className="bg-[#1a1a1a]">درآمد</option>
              <option value="expense" className="bg-[#1a1a1a]">هزینه</option>
            </select>

            {/* Month Filter */}
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Income */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-luxury-emerald-400/10 border border-luxury-emerald-400/30 flex items-center justify-center">
                <ArrowUpRight className="w-6 h-6 text-luxury-emerald-400" strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white mb-1">
              {(stats.income / 1000000).toFixed(1)}M
            </h3>
            <p className="text-sm text-brand-gray">درآمد کل</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-brand-gray mb-1">تعداد تراکنش</p>
              <p className="text-lg font-black text-luxury-emerald-400">
                {filteredTransactions.filter(t => t.type === "income").length} مورد
              </p>
            </div>
          </motion.div>

          {/* Expense */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-luxury-rose-400/10 border border-luxury-rose-400/30 flex items-center justify-center">
                <ArrowDownRight className="w-6 h-6 text-luxury-rose-400" strokeWidth={2.5} />
              </div>
            </div>
            <h3 className="text-3xl font-black text-white mb-1">
              {(stats.expense / 1000000).toFixed(1)}M
            </h3>
            <p className="text-sm text-brand-gray">هزینه کل</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-brand-gray mb-1">تعداد تراکنش</p>
              <p className="text-lg font-black text-luxury-rose-400">
                {filteredTransactions.filter(t => t.type === "expense").length} مورد
              </p>
            </div>
          </motion.div>

          {/* Balance */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={`bg-white/[0.02] backdrop-blur-xl border rounded-2xl p-6 ${
              stats.balance >= 0 
                ? "border-luxury-emerald-400/30" 
                : "border-luxury-rose-400/30"
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${
                stats.balance >= 0
                  ? "bg-luxury-emerald-400/10 border-luxury-emerald-400/30"
                  : "bg-luxury-rose-400/10 border-luxury-rose-400/30"
              }`}>
                <Wallet className={`w-6 h-6 ${
                  stats.balance >= 0 ? "text-luxury-emerald-400" : "text-luxury-rose-400"
                }`} strokeWidth={2.5} />
              </div>
            </div>
            <h3 className={`text-3xl font-black mb-1 ${
              stats.balance >= 0 ? "text-luxury-emerald-400" : "text-luxury-rose-400"
            }`}>
              {(Math.abs(stats.balance) / 1000000).toFixed(1)}M
            </h3>
            <p className="text-sm text-brand-gray">موجودی</p>
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-brand-gray mb-1">وضعیت</p>
              <p className={`text-lg font-black ${
                stats.balance >= 0 ? "text-luxury-emerald-400" : "text-luxury-rose-400"
              }`}>
                {stats.balance >= 0 ? "مثبت" : "منفی"}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Income & Expense Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Income by Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-luxury-emerald-400" strokeWidth={2.5} />
              درآمد بر اساس دسته
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.incomeByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-luxury-emerald-400" strokeWidth={2.5} />
                      <span className="text-sm font-bold text-white">{category}</span>
                    </div>
                    <span className="text-sm font-black text-luxury-emerald-400">
                      {(amount / 1000).toFixed(0)}K
                    </span>
                  </div>
                ))}
              {Object.keys(stats.incomeByCategory).length === 0 && (
                <p className="text-center text-brand-gray py-8">داده‌ای موجود نیست</p>
              )}
            </div>
          </motion.div>

          {/* Expense by Category */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
          >
            <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-luxury-rose-400" strokeWidth={2.5} />
              هزینه بر اساس دسته
            </h3>
            <div className="space-y-3">
              {Object.entries(stats.expenseByCategory)
                .sort(([, a], [, b]) => b - a)
                .map(([category, amount]) => (
                  <div key={category} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-luxury-rose-400" strokeWidth={2.5} />
                      <span className="text-sm font-bold text-white">{category}</span>
                    </div>
                    <span className="text-sm font-black text-luxury-rose-400">
                      {(amount / 1000).toFixed(0)}K
                    </span>
                  </div>
                ))}
              {Object.keys(stats.expenseByCategory).length === 0 && (
                <p className="text-center text-brand-gray py-8">داده‌ای موجود نیست</p>
              )}
            </div>
          </motion.div>
        </div>

        {/* Transactions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6"
        >
          <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
            <Receipt className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
            تراکنش‌های اخیر
          </h3>

          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="w-20 h-20 mx-auto mb-4 text-brand-gray opacity-20" strokeWidth={1.5} />
              <p className="text-xl font-bold text-white mb-2">تراکنشی یافت نشد</p>
              <p className="text-brand-gray mb-6">فیلترها رو تغییر بده یا تراکنش جدید اضافه کن</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTransactions.map((transaction) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  whileHover={{ scale: 1.005, x: 4 }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.04] hover:border-white/20 transition-all"
                >
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center flex-shrink-0 ${
                    transaction.type === "income"
                      ? "bg-luxury-emerald-400/10 border-luxury-emerald-400/30"
                      : "bg-luxury-rose-400/10 border-luxury-rose-400/30"
                  }`}>
                    {transaction.type === "income" ? (
                      <ArrowUpRight className="w-6 h-6 text-luxury-emerald-400" strokeWidth={2.5} />
                    ) : (
                      <ArrowDownRight className="w-6 h-6 text-luxury-rose-400" strokeWidth={2.5} />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-white truncate">{transaction.description}</h4>
                      <span className="px-2 py-0.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold text-brand-gray">
                        {transaction.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-brand-gray">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" strokeWidth={2.5} />
                        {new Date(transaction.date).toLocaleDateString("fa-IR")}
                      </span>
                      <span className="flex items-center gap-1">
                        <CreditCard className="w-3.5 h-3.5" strokeWidth={2.5} />
                        {paymentMethods.find(m => m.id === transaction.payment_method)?.label}
                      </span>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className={`text-left flex-shrink-0 ${
                    transaction.type === "income" ? "text-luxury-emerald-400" : "text-luxury-rose-400"
                  }`}>
                    <p className="text-lg font-black">
                      {transaction.type === "income" ? "+" : "-"}
                      {Number(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-xs text-brand-gray">تومان</p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openModal(transaction)}
                      className="w-8 h-8 rounded-lg bg-luxury-amber-400/10 border border-luxury-amber-400/30 flex items-center justify-center hover:bg-luxury-amber-400/20 transition-all"
                    >
                      <Edit2 className="w-4 h-4 text-luxury-amber-400" strokeWidth={2.5} />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(transaction.id)}
                      className="w-8 h-8 rounded-lg bg-luxury-rose-400/10 border border-luxury-rose-400/30 flex items-center justify-center hover:bg-luxury-rose-400/20 transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-luxury-rose-400" strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-white">
                    {isEditing ? "ویرایش تراکنش" : "تراکنش جدید"}
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeModal}
                    className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-luxury-rose-400/50 transition-all"
                  >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </motion.button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Type */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">نوع تراکنش *</label>
                    <div className="grid grid-cols-2 gap-3">
                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, type: "income", category: "" })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.type === "income"
                            ? "border-luxury-emerald-400 bg-luxury-emerald-400/10"
                            : "border-white/10 bg-white/[0.02]"
                        }`}
                      >
                        <ArrowUpRight className={`w-8 h-8 mx-auto mb-2 ${
                          formData.type === "income" ? "text-luxury-emerald-400" : "text-brand-gray"
                        }`} strokeWidth={2.5} />
                        <p className="text-sm font-bold text-white">درآمد</p>
                      </motion.button>

                      <motion.button
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.type === "expense"
                            ? "border-luxury-rose-400 bg-luxury-rose-400/10"
                            : "border-white/10 bg-white/[0.02]"
                        }`}
                      >
                        <ArrowDownRight className={`w-8 h-8 mx-auto mb-2 ${
                          formData.type === "expense" ? "text-luxury-rose-400" : "text-brand-gray"
                        }`} strokeWidth={2.5} />
                        <p className="text-sm font-bold text-white">هزینه</p>
                      </motion.button>
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">مبلغ (تومان) *</label>
                    <input
                      type="number"
                      required
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                      placeholder="1000000"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">دسته‌بندی *</label>
                    <select
                      required
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
                    >
                      <option value="" className="bg-[#1a1a1a]">انتخاب کنید</option>
                      {(formData.type === "income" ? incomeCategories : expenseCategories).map((cat) => (
                        <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">توضیحات *</label>
                    <textarea
                      rows={3}
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all resize-none"
                      placeholder="توضیحات تراکنش..."
                    />
                  </div>

                  {/* Payment Method & Date */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">روش پرداخت</label>
                      <select
                        value={formData.payment_method}
                        onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as PaymentMethod })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
                      >
                        {paymentMethods.map((method) => (
                          <option key={method.id} value={method.id} className="bg-[#1a1a1a]">{method.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">تاریخ</label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={closeModal}
                      className="flex-1 px-4 py-3 rounded-xl bg-white/[0.02] border border-white/10 text-white font-bold hover:bg-white/[0.04] transition-all"
                    >
                      انصراف
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-luxury-amber-500 text-black font-bold shadow-lg shadow-brand-gold/30"
                    >
                      {isEditing ? "ذخیره تغییرات" : "ثبت تراکنش"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
