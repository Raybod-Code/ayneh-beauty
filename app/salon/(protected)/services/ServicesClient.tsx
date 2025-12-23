"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Scissors,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  MoreHorizontal,
  Clock,
  DollarSign,
  Star,
  TrendingUp,
  Users,
  Package,
  Sparkles,
  Crown,
  Zap,
  Heart,
  X,
  Check,
  Image as ImageIcon,
  Tag,
  Grid3x3,
  LayoutList,
  ArrowUpDown,
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

// Category config
const categoryConfig = {
  hair: {
    label: "مو",
    icon: Scissors,
    color: "luxury-sky-400",
    bg: "bg-luxury-sky-400/10",
    border: "border-luxury-sky-400/30",
  },
  nails: {
    label: "ناخن",
    icon: Sparkles,
    color: "luxury-rose-400",
    bg: "bg-luxury-rose-400/10",
    border: "border-luxury-rose-400/30",
  },
  makeup: {
    label: "آرایش",
    icon: Crown,
    color: "luxury-amber-400",
    bg: "bg-luxury-amber-400/10",
    border: "border-luxury-amber-400/30",
  },
  skin: {
    label: "پوست",
    icon: Sparkles,
    color: "luxury-emerald-400",
    bg: "bg-luxury-emerald-400/10",
    border: "border-luxury-emerald-400/30",
  },
  spa: {
    label: "اسپا",
    icon: Heart,
    color: "luxury-purple-400",
    bg: "bg-luxury-purple-400/10",
    border: "border-luxury-purple-400/30",
  },
  other: {
    label: "سایر",
    icon: Package,
    color: "luxury-slate-400",
    bg: "bg-luxury-slate-400/10",
    border: "border-luxury-slate-400/30",
  },
};

type ViewMode = "grid" | "list";

export default function ServicesClient() {
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [filteredServices, setFilteredServices] = useState<any[]>([]);
  
  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "price" | "duration" | "popular">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "hair",
    price: "",
    duration: "",
    is_active: true,
  });

  // Stats
  const stats = useMemo(() => {
    return {
      total: services.length,
      active: services.filter(s => s.is_active).length,
      categories: new Set(services.map(s => s.category)).size,
      avgPrice: services.length ? services.reduce((sum, s) => sum + Number(s.price || 0), 0) / services.length : 0,
      totalRevenue: services.reduce((sum, s) => sum + Number(s.price || 0), 0),
    };
  }, [services]);

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

        const { data: servicesData } = await supabase
          .from("services")
          .select("*")
          .eq("tenant_id", currentTenant.id)
          .order("name", { ascending: true });

        if (servicesData) {
          setServices(servicesData);
          setFilteredServices(servicesData);
        }

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter & Sort
  useEffect(() => {
    let filtered = [...services];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === "name") {
        compareValue = (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "price") {
        compareValue = Number(b.price || 0) - Number(a.price || 0);
      } else if (sortBy === "duration") {
        compareValue = Number(b.duration || 0) - Number(a.duration || 0);
      }
      
      return sortOrder === "desc" ? compareValue : -compareValue;
    });

    setFilteredServices(filtered);
  }, [searchQuery, selectedCategory, sortBy, sortOrder, services]);

  // Handle modal
  const openModal = (service?: any) => {
    if (service) {
      setSelectedService(service);
      setFormData({
        name: service.name || "",
        description: service.description || "",
        category: service.category || "hair",
        price: service.price || "",
        duration: service.duration || "",
        is_active: service.is_active ?? true,
      });
      setIsEditing(true);
    } else {
      setSelectedService(null);
      setFormData({
        name: "",
        description: "",
        category: "hair",
        price: "",
        duration: "",
        is_active: true,
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setIsEditing(false);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const supabase = createClient();
      
      if (isEditing && selectedService) {
        // Update
        const { error } = await supabase
          .from("services")
          .update({
            name: formData.name,
            description: formData.description,
            category: formData.category,
            price: Number(formData.price),
            duration: Number(formData.duration),
            is_active: formData.is_active,
          })
          .eq("id", selectedService.id);

        if (error) throw error;

        // Update local state
        setServices(services.map(s => 
          s.id === selectedService.id 
            ? { ...s, ...formData, price: Number(formData.price), duration: Number(formData.duration) }
            : s
        ));
      } else {
        // Create
        const { data, error } = await supabase
          .from("services")
          .insert([{
            tenant_id: tenant.id,
            name: formData.name,
            description: formData.description,
            category: formData.category,
            price: Number(formData.price),
            duration: Number(formData.duration),
            is_active: formData.is_active,
          }])
          .select();

        if (error) throw error;
        if (data) {
          setServices([...services, data[0]]);
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این خدمت اطمینان دارید؟")) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("services")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setServices(services.filter(s => s.id !== id));
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
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl border-b border-white/10">
        <div className="px-6 py-4">
          {/* Title Row */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Scissors className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
                مدیریت خدمات
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
              <span className="text-sm">خدمت جدید</span>
            </motion.button>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <Package className="w-3.5 h-3.5 text-luxury-sky-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-white">{stats.total}</span>
              <span className="text-xs text-brand-gray">خدمت</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <Check className="w-3.5 h-3.5 text-luxury-emerald-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-luxury-emerald-400">{stats.active}</span>
              <span className="text-xs text-brand-gray">فعال</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <Tag className="w-3.5 h-3.5 text-luxury-amber-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-luxury-amber-400">{stats.categories}</span>
              <span className="text-xs text-brand-gray">دسته</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <DollarSign className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2.5} />
              <span className="text-xs font-bold text-brand-gold">{(stats.avgPrice / 1000).toFixed(0)}K</span>
              <span className="text-xs text-brand-gray">متوسط</span>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="جستجوی خدمات..."
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
              {Object.entries(categoryConfig).map(([key, config]) => (
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
                <option value="price" className="bg-[#1a1a1a]">قیمت</option>
                <option value="duration" className="bg-[#1a1a1a]">مدت زمان</option>
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

      {/* Main Content */}
      <div className="p-6">
        {filteredServices.length === 0 ? (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <Scissors className="w-20 h-20 mx-auto mb-4 text-brand-gray opacity-20" strokeWidth={1.5} />
            <p className="text-xl font-bold text-white mb-2">خدمتی یافت نشد</p>
            <p className="text-brand-gray mb-6">فیلترها رو تغییر بده یا خدمت جدید اضافه کن</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-luxury-amber-500 text-black font-bold"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              اولین خدمت رو اضافه کن
            </motion.button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredServices.map((service, index) => {
                  const config = categoryConfig[service.category as keyof typeof categoryConfig] || categoryConfig.other;
                  const CategoryIcon = config.icon;
                  
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="relative group"
                    >
                      {!service.is_active && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-luxury-rose-400/10 border border-luxury-rose-400/30 z-10">
                          <span className="text-xs font-bold text-luxury-rose-400">غیرفعال</span>
                        </div>
                      )}

                      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all h-full flex flex-col">
                        {/* Category Badge */}
                        <div className={`${config.bg} border ${config.border} px-3 py-2 rounded-lg flex items-center gap-2 mb-4 w-fit`}>
                          <CategoryIcon className={`w-4 h-4 text-${config.color}`} strokeWidth={2.5} />
                          <span className={`text-xs font-bold text-${config.color}`}>{config.label}</span>
                        </div>

                        {/* Service Info */}
                        <div className="flex-1 mb-4">
                          <h3 className="text-lg font-bold text-white mb-2 line-clamp-1">{service.name}</h3>
                          <p className="text-sm text-brand-gray line-clamp-2">{service.description || "بدون توضیحات"}</p>
                        </div>

                        {/* Details */}
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/10">
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-luxury-sky-400" strokeWidth={2.5} />
                            <span className="text-sm font-bold text-white">{service.duration}</span>
                            <span className="text-xs text-brand-gray">دقیقه</span>
                          </div>
                        </div>

                        {/* Price & Actions */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-black text-brand-gold">{(Number(service.price) / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-brand-gray">تومان</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openModal(service)}
                              className="w-8 h-8 rounded-lg bg-luxury-sky-400/10 border border-luxury-sky-400/30 flex items-center justify-center hover:bg-luxury-sky-400/20 transition-all"
                            >
                              <Edit2 className="w-4 h-4 text-luxury-sky-400" strokeWidth={2.5} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(service.id)}
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

            {/* List View */}
            {viewMode === "list" && (
              <div className="space-y-2">
                {filteredServices.map((service, index) => {
                  const config = categoryConfig[service.category as keyof typeof categoryConfig] || categoryConfig.other;
                  const CategoryIcon = config.icon;
                  
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.005, x: 4 }}
                      className="relative group"
                    >
                      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4">
                          {/* Category */}
                          <div className={`${config.bg} border ${config.border} p-3 rounded-xl flex-shrink-0`}>
                            <CategoryIcon className={`w-5 h-5 text-${config.color}`} strokeWidth={2.5} />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-white truncate">{service.name}</h3>
                              {!service.is_active && (
                                <span className="px-2 py-0.5 rounded-full bg-luxury-rose-400/10 border border-luxury-rose-400/30 text-xs font-bold text-luxury-rose-400">
                                  غیرفعال
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-brand-gray truncate">{service.description || "بدون توضیحات"}</p>
                          </div>

                          {/* Duration */}
                          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02]">
                            <Clock className="w-4 h-4 text-luxury-sky-400" strokeWidth={2.5} />
                            <span className="text-sm font-bold text-white">{service.duration}</span>
                            <span className="text-xs text-brand-gray">دقیقه</span>
                          </div>

                          {/* Price */}
                          <div className="text-right flex-shrink-0 w-24">
                            <p className="text-lg font-black text-brand-gold">{(Number(service.price) / 1000).toFixed(0)}K</p>
                            <p className="text-xs text-brand-gray">تومان</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openModal(service)}
                              className="w-8 h-8 rounded-lg bg-luxury-sky-400/10 border border-luxury-sky-400/30 flex items-center justify-center hover:bg-luxury-sky-400/20 transition-all"
                            >
                              <Edit2 className="w-4 h-4 text-luxury-sky-400" strokeWidth={2.5} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(service.id)}
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

      {/* Modal */}
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
                    {isEditing ? "ویرایش خدمت" : "خدمت جدید"}
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
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">نام خدمت *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                      placeholder="مثلاً: کوتاهی مو"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">توضیحات</label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all resize-none"
                      placeholder="توضیحات کوتاه درباره خدمت..."
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
                      {Object.entries(categoryConfig).map(([key, config]) => (
                        <option key={key} value={key} className="bg-[#1a1a1a]">{config.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price & Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">قیمت (تومان) *</label>
                      <input
                        type="number"
                        required
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="50000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">مدت (دقیقه) *</label>
                      <input
                        type="number"
                        required
                        value={formData.duration}
                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="30"
                      />
                    </div>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 rounded accent-brand-gold cursor-pointer"
                    />
                    <label htmlFor="is_active" className="text-sm font-bold text-white cursor-pointer">
                      خدمت فعال باشد
                    </label>
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
                      {isEditing ? "ذخیره تغییرات" : "ایجاد خدمت"}
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
