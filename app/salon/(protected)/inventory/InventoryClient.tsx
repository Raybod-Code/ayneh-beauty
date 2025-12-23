"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Archive,
  CheckCircle,
  XCircle,
  Grid3x3,
  LayoutList,
  ArrowUpDown,
  Barcode,
  DollarSign,
  Calendar,
  Tag,
  Boxes,
  AlertCircle,
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

type ViewMode = "grid" | "list";
type StockStatus = "in-stock" | "low-stock" | "out-of-stock";

const stockStatusConfig = {
  "in-stock": {
    label: "موجود",
    icon: CheckCircle,
    color: "luxury-emerald-400",
    bg: "bg-luxury-emerald-400/10",
    border: "border-luxury-emerald-400/30",
  },
  "low-stock": {
    label: "کم موجود",
    icon: AlertCircle,
    color: "luxury-amber-400",
    bg: "bg-luxury-amber-400/10",
    border: "border-luxury-amber-400/30",
  },
  "out-of-stock": {
    label: "ناموجود",
    icon: XCircle,
    color: "luxury-rose-400",
    bg: "bg-luxury-rose-400/10",
    border: "border-luxury-rose-400/30",
  },
};

export default function InventoryClient() {
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<"all" | StockStatus>("all");
  const [sortBy, setSortBy] = useState<"name" | "quantity" | "price">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    sku: "",
    quantity: "",
    min_quantity: "",
    unit_price: "",
    selling_price: "",
    supplier: "",
    description: "",
  });

  // Categories
  const categories = [
    "رنگ مو",
    "محصولات مراقبت مو",
    "محصولات پوست",
    "آرایشی",
    "ناخن",
    "ابزار و تجهیزات",
    "سایر",
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

        // Fetch products
        const { data: productsData } = await supabase
          .from("inventory")
          .select("*")
          .eq("tenant_id", currentTenant.id)
          .order("name", { ascending: true });

        if (productsData) {
          setProducts(productsData);
          setFilteredProducts(productsData);
        }

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get stock status
  const getStockStatus = (quantity: number, minQuantity: number): StockStatus => {
    if (quantity === 0) return "out-of-stock";
    if (quantity <= minQuantity) return "low-stock";
    return "in-stock";
  };

  // Filter & Sort
  useEffect(() => {
    let filtered = [...products];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.sku?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Status
    if (selectedStatus !== "all") {
      filtered = filtered.filter((p) => getStockStatus(p.quantity, p.min_quantity) === selectedStatus);
    }

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === "name") {
        compareValue = (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "quantity") {
        compareValue = (b.quantity || 0) - (a.quantity || 0);
      } else if (sortBy === "price") {
        compareValue = (b.selling_price || 0) - (a.selling_price || 0);
      }
      
      return sortOrder === "desc" ? compareValue : -compareValue;
    });

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, selectedStatus, sortBy, sortOrder, products]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.quantity * p.unit_price || 0), 0);
    const lowStock = products.filter(p => getStockStatus(p.quantity, p.min_quantity) === "low-stock").length;
    const outOfStock = products.filter(p => getStockStatus(p.quantity, p.min_quantity) === "out-of-stock").length;

    return {
      totalProducts,
      totalValue,
      lowStock,
      outOfStock,
    };
  }, [products]);

  // Handle modal
  const openModal = (product?: any) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name || "",
        category: product.category || "",
        sku: product.sku || "",
        quantity: product.quantity?.toString() || "",
        min_quantity: product.min_quantity?.toString() || "",
        unit_price: product.unit_price?.toString() || "",
        selling_price: product.selling_price?.toString() || "",
        supplier: product.supplier || "",
        description: product.description || "",
      });
      setIsEditing(true);
    } else {
      setSelectedProduct(null);
      setFormData({
        name: "",
        category: "",
        sku: "",
        quantity: "",
        min_quantity: "",
        unit_price: "",
        selling_price: "",
        supplier: "",
        description: "",
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
    setIsEditing(false);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const supabase = createClient();
      
      if (isEditing && selectedProduct) {
        // Update
        const { error } = await supabase
          .from("inventory")
          .update({
            name: formData.name,
            category: formData.category,
            sku: formData.sku,
            quantity: Number(formData.quantity),
            min_quantity: Number(formData.min_quantity),
            unit_price: Number(formData.unit_price),
            selling_price: Number(formData.selling_price),
            supplier: formData.supplier,
            description: formData.description,
          })
          .eq("id", selectedProduct.id);

        if (error) throw error;

        setProducts(products.map(p => 
          p.id === selectedProduct.id 
            ? { 
                ...p, 
                ...formData, 
                quantity: Number(formData.quantity),
                min_quantity: Number(formData.min_quantity),
                unit_price: Number(formData.unit_price),
                selling_price: Number(formData.selling_price),
              }
            : p
        ));
      } else {
        // Create
        const { data, error } = await supabase
          .from("inventory")
          .insert([{
            tenant_id: tenant.id,
            name: formData.name,
            category: formData.category,
            sku: formData.sku,
            quantity: Number(formData.quantity),
            min_quantity: Number(formData.min_quantity),
            unit_price: Number(formData.unit_price),
            selling_price: Number(formData.selling_price),
            supplier: formData.supplier,
            description: formData.description,
          }])
          .select();

        if (error) throw error;
        if (data) {
          setProducts([...products, data[0]]);
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error:", error);
      alert("خطا در ثبت محصول!");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این محصول اطمینان دارید؟")) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("inventory")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setProducts(products.filter(p => p.id !== id));
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
                <Package className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
                مدیریت موجودی
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
              <span className="text-sm">محصول جدید</span>
            </motion.button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <Boxes className="w-3.5 h-3.5 text-luxury-sky-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-white">{stats.totalProducts}</span>
              <span className="text-xs text-brand-gray">محصول</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <DollarSign className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2.5} />
              <span className="text-xs font-bold text-brand-gold">{(stats.totalValue / 1000000).toFixed(1)}M</span>
              <span className="text-xs text-brand-gray">ارزش</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-luxury-amber-400/10 border border-luxury-amber-400/30">
              <AlertCircle className="w-3.5 h-3.5 text-luxury-amber-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-luxury-amber-400">{stats.lowStock}</span>
              <span className="text-xs text-brand-gray">کم موجود</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-luxury-rose-400/10 border border-luxury-rose-400/30">
              <XCircle className="w-3.5 h-3.5 text-luxury-rose-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-luxury-rose-400">{stats.outOfStock}</span>
              <span className="text-xs text-brand-gray">ناموجود</span>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="جستجوی محصولات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-10 py-2 text-sm text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
            >
              <option value="all" className="bg-[#1a1a1a]">همه دسته‌ها</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
            >
              <option value="all" className="bg-[#1a1a1a]">همه وضعیت‌ها</option>
              {Object.entries(stockStatusConfig).map(([key, config]) => (
                <option key={key} value={key} className="bg-[#1a1a1a]">{config.label}</option>
              ))}
            </select>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
              >
                <option value="name" className="bg-[#1a1a1a]">نام</option>
                <option value="quantity" className="bg-[#1a1a1a]">موجودی</option>
                <option value="price" className="bg-[#1a1a1a]">قیمت</option>
              </select>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-brand-gold/50 transition-all"
              >
                <ArrowUpDown className={`w-4 h-4 transition-transform ${sortOrder === "asc" ? "rotate-180" : ""}`} strokeWidth={2.5} />
              </motion.button>
            </div>

            {/* View Mode */}
            <div className="flex items-center gap-1 p-1 bg-white/[0.02] border border-white/10 rounded-lg">
              {[
                { id: "grid" as ViewMode, icon: Grid3x3 },
                { id: "list" as ViewMode, icon: LayoutList },
              ].map((view) => {
                const Icon = view.icon;
                return (
                  <motion.button
                    key={view.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode(view.id)}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                      viewMode === view.id
                        ? "bg-brand-gold text-black"
                        : "text-brand-gray hover:text-white"
                    }`}
                  >
                    <Icon className="w-4 h-4" strokeWidth={2.5} />
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {filteredProducts.length === 0 ? (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <Package className="w-20 h-20 mx-auto mb-4 text-brand-gray opacity-20" strokeWidth={1.5} />
            <p className="text-xl font-bold text-white mb-2">محصولی یافت نشد</p>
            <p className="text-brand-gray mb-6">فیلترها رو تغییر بده یا محصول جدید اضافه کن</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-luxury-amber-500 text-black font-bold"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              اولین محصول رو اضافه کن
            </motion.button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product, index) => {
                  const status = getStockStatus(product.quantity, product.min_quantity);
                  const config = stockStatusConfig[status];
                  const StatusIcon = config.icon;
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="relative group"
                    >
                      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all h-full flex flex-col">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-base font-bold text-white truncate mb-1">{product.name}</h3>
                            <div className="flex items-center gap-2 text-xs text-brand-gray">
                              <Tag className="w-3 h-3" strokeWidth={2.5} />
                              <span>{product.category}</span>
                            </div>
                          </div>

                          {/* Status Badge */}
                          <div className={`${config.bg} border ${config.border} p-1.5 rounded-lg`}>
                            <StatusIcon className={`w-4 h-4 text-${config.color}`} strokeWidth={2.5} />
                          </div>
                        </div>

                        {/* SKU */}
                        {product.sku && (
                          <div className="flex items-center gap-2 mb-4 text-xs">
                            <Barcode className="w-3.5 h-3.5 text-brand-gray" strokeWidth={2.5} />
                            <span className="text-brand-gray">{product.sku}</span>
                          </div>
                        )}

                        {/* Stats */}
                        <div className="flex-1 space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-brand-gray">موجودی:</span>
                            <span className={`font-bold ${
                              status === "out-of-stock" ? "text-luxury-rose-400" :
                              status === "low-stock" ? "text-luxury-amber-400" :
                              "text-luxury-emerald-400"
                            }`}>
                              {product.quantity} عدد
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-brand-gray">قیمت فروش:</span>
                            <span className="font-bold text-brand-gold">{Number(product.selling_price).toLocaleString()}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
                            <span className="text-brand-gray">ارزش کل:</span>
                            <span className="font-bold text-white">{(product.quantity * product.unit_price / 1000).toFixed(0)}K</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openModal(product)}
                            className="flex-1 px-3 py-2 rounded-lg bg-luxury-amber-400/10 border border-luxury-amber-400/30 text-luxury-amber-400 text-xs font-bold hover:bg-luxury-amber-400/20 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Edit2 className="w-3.5 h-3.5" strokeWidth={2.5} />
                            ویرایش
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(product.id)}
                            className="w-9 h-9 rounded-lg bg-luxury-rose-400/10 border border-luxury-rose-400/30 flex items-center justify-center hover:bg-luxury-rose-400/20 transition-all"
                          >
                            <Trash2 className="w-4 h-4 text-luxury-rose-400" strokeWidth={2.5} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-2">
                {filteredProducts.map((product, index) => {
                  const status = getStockStatus(product.quantity, product.min_quantity);
                  const config = stockStatusConfig[status];
                  const StatusIcon = config.icon;
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.005, x: 4 }}
                      className="relative group"
                    >
                      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luxury-sky-400 to-luxury-violet-400 flex items-center justify-center text-white font-black flex-shrink-0">
                            <Package className="w-6 h-6" strokeWidth={2.5} />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-white truncate mb-1">{product.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-brand-gray">
                              <span className="flex items-center gap-1">
                                <Tag className="w-3.5 h-3.5" strokeWidth={2.5} />
                                {product.category}
                              </span>
                              {product.sku && (
                                <span className="flex items-center gap-1">
                                  <Barcode className="w-3.5 h-3.5" strokeWidth={2.5} />
                                  {product.sku}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Status */}
                          <div className={`${config.bg} border ${config.border} px-3 py-2 rounded-lg flex items-center gap-2 flex-shrink-0`}>
                            <StatusIcon className={`w-4 h-4 text-${config.color}`} strokeWidth={2.5} />
                            <span className={`text-sm font-bold text-${config.color}`}>{config.label}</span>
                          </div>

                          {/* Stats */}
                          <div className="hidden lg:flex items-center gap-6 flex-shrink-0">
                            <div className="text-center">
                              <p className={`text-lg font-black ${
                                status === "out-of-stock" ? "text-luxury-rose-400" :
                                status === "low-stock" ? "text-luxury-amber-400" :
                                "text-luxury-emerald-400"
                              }`}>{product.quantity}</p>
                              <p className="text-xs text-brand-gray">موجودی</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-black text-brand-gold">{(Number(product.selling_price) / 1000).toFixed(0)}K</p>
                              <p className="text-xs text-brand-gray">قیمت</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openModal(product)}
                              className="w-8 h-8 rounded-lg bg-luxury-amber-400/10 border border-luxury-amber-400/30 flex items-center justify-center hover:bg-luxury-amber-400/20 transition-all"
                            >
                              <Edit2 className="w-4 h-4 text-luxury-amber-400" strokeWidth={2.5} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(product.id)}
                              className="w-8 h-8 rounded-lg bg-luxury-rose-400/10 border border-luxury-rose-400/30 flex items-center justify-center hover:bg-luxury-rose-400/20 transition-all"
                            >
                              <Trash2 className="w-4 h-4 text-luxury-rose-400" strokeWidth={2.5} />
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
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
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-white">
                    {isEditing ? "ویرایش محصول" : "محصول جدید"}
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
                  {/* Name & Category */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">نام محصول *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="مثلاً: رنگ مو لورآل"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">دسته‌بندی *</label>
                      <select
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
                      >
                        <option value="" className="bg-[#1a1a1a]">انتخاب کنید</option>
                        {categories.map((cat) => (
                          <option key={cat} value={cat} className="bg-[#1a1a1a]">{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* SKU & Supplier */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">کد محصول (SKU)</label>
                      <input
                        type="text"
                        value={formData.sku}
                        onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="SKU-001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">تامین‌کننده</label>
                      <input
                        type="text"
                        value={formData.supplier}
                        onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="نام تامین‌کننده"
                      />
                    </div>
                  </div>

                  {/* Quantity & Min Quantity */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">موجودی *</label>
                      <input
                        type="number"
                        required
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">حداقل موجودی *</label>
                      <input
                        type="number"
                        required
                        value={formData.min_quantity}
                        onChange={(e) => setFormData({ ...formData, min_quantity: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="10"
                      />
                    </div>
                  </div>

                  {/* Unit Price & Selling Price */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">قیمت خرید *</label>
                      <input
                        type="number"
                        required
                        value={formData.unit_price}
                        onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">قیمت فروش *</label>
                      <input
                        type="number"
                        required
                        value={formData.selling_price}
                        onChange={(e) => setFormData({ ...formData, selling_price: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="80000"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">توضیحات</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all resize-none"
                      placeholder="توضیحات محصول..."
                    />
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
                      {isEditing ? "ذخیره تغییرات" : "ایجاد محصول"}
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
