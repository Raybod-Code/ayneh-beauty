"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  MoreHorizontal,
  Star,
  TrendingUp,
  Award,
  Clock,
  DollarSign,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Crown,
  Sparkles,
  Heart,
  Gift,
  Tag,
  X,
  User,
  Grid3x3,
  LayoutList,
  ArrowUpDown,
  Eye,
  MessageSquare,
  History,
  ShoppingBag,
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

// Customer Type config
const customerTypeConfig = {
  regular: {
    label: "عادی",
    icon: User,
    color: "luxury-slate-400",
    bg: "bg-luxury-slate-400/10",
    border: "border-luxury-slate-400/30",
  },
  vip: {
    label: "VIP",
    icon: Crown,
    color: "brand-gold",
    bg: "bg-brand-gold/10",
    border: "border-brand-gold/30",
  },
  premium: {
    label: "پرمیوم",
    icon: Sparkles,
    color: "luxury-amber-400",
    bg: "bg-luxury-amber-400/10",
    border: "border-luxury-amber-400/30",
  },
  loyal: {
    label: "وفادار",
    icon: Heart,
    color: "luxury-rose-400",
    bg: "bg-luxury-rose-400/10",
    border: "border-luxury-rose-400/30",
  },
};

type ViewMode = "grid" | "list" | "table";

export default function CustomersClient() {
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  
  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "visits" | "spent" | "last_visit">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    customer_type: "regular",
    birthday: "",
    address: "",
    notes: "",
  });

  // Stats
  const stats = useMemo(() => {
    return {
      total: customers.length,
      vip: customers.filter(c => c.customer_type === 'vip').length,
      newThisMonth: customers.filter(c => {
        const created = new Date(c.created_at);
        const now = new Date();
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
      }).length,
      totalSpent: customers.reduce((sum, c) => sum + (c.total_spent || 0), 0),
    };
  }, [customers]);

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

        // Fetch customers
        const { data: customersData } = await supabase
          .from("customers")
          .select("*")
          .eq("tenant_id", currentTenant.id)
          .order("name", { ascending: true });

        if (customersData) {
          setCustomers(customersData);
          setFilteredCustomers(customersData);
        }

        // Fetch bookings
        const { data: bookingsData } = await supabase
          .from("bookings")
          .select("*")
          .eq("tenant_id", currentTenant.id);

        if (bookingsData) {
          setBookings(bookingsData);
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
    let filtered = [...customers];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (c) =>
          c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.phone?.includes(searchQuery)
      );
    }

    // Type
    if (selectedType !== "all") {
      filtered = filtered.filter((c) => c.customer_type === selectedType);
    }

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === "name") {
        compareValue = (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "visits") {
        compareValue = (b.visit_count || 0) - (a.visit_count || 0);
      } else if (sortBy === "spent") {
        compareValue = (b.total_spent || 0) - (a.total_spent || 0);
      } else if (sortBy === "last_visit") {
        const dateA = a.last_visit ? new Date(a.last_visit).getTime() : 0;
        const dateB = b.last_visit ? new Date(b.last_visit).getTime() : 0;
        compareValue = dateB - dateA;
      }
      
      return sortOrder === "desc" ? compareValue : -compareValue;
    });

    setFilteredCustomers(filtered);
  }, [searchQuery, selectedType, sortBy, sortOrder, customers]);

  // Get customer bookings
  const getCustomerBookings = (customerId: string) => {
    return bookings.filter(b => b.customer_id === customerId);
  };

  // Handle modal
  const openModal = (customer?: any) => {
    if (customer) {
      setSelectedCustomer(customer);
      setFormData({
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        customer_type: customer.customer_type || "regular",
        birthday: customer.birthday || "",
        address: customer.address || "",
        notes: customer.notes || "",
      });
      setIsEditing(true);
    } else {
      setSelectedCustomer(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        customer_type: "regular",
        birthday: "",
        address: "",
        notes: "",
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCustomer(null);
    setIsEditing(false);
  };

  const openDetailsModal = (customer: any) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedCustomer(null);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const supabase = createClient();
      
      if (isEditing && selectedCustomer) {
        // Update
        const { error } = await supabase
          .from("customers")
          .update({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            customer_type: formData.customer_type,
            birthday: formData.birthday || null,
            address: formData.address,
            notes: formData.notes,
          })
          .eq("id", selectedCustomer.id);

        if (error) throw error;

        // Update local state
        setCustomers(customers.map(c => 
          c.id === selectedCustomer.id 
            ? { ...c, ...formData }
            : c
        ));
      } else {
        // Create
        const { data, error } = await supabase
          .from("customers")
          .insert([{
            tenant_id: tenant.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            customer_type: formData.customer_type,
            birthday: formData.birthday || null,
            address: formData.address,
            notes: formData.notes,
            visit_count: 0,
            total_spent: 0,
          }])
          .select();

        if (error) throw error;
        if (data) {
          setCustomers([...customers, data[0]]);
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این مشتری اطمینان دارید؟")) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("customers")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setCustomers(customers.filter(c => c.id !== id));
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
                <Users className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
                مدیریت مشتریان
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
              <span className="text-sm">مشتری جدید</span>
            </motion.button>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <Users className="w-3.5 h-3.5 text-luxury-sky-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-white">{stats.total}</span>
              <span className="text-xs text-brand-gray">مشتری</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <Crown className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2.5} />
              <span className="text-xs font-bold text-brand-gold">{stats.vip}</span>
              <span className="text-xs text-brand-gray">VIP</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-luxury-emerald-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-luxury-emerald-400">{stats.newThisMonth}</span>
              <span className="text-xs text-brand-gray">جدید</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <DollarSign className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2.5} />
              <span className="text-xs font-bold text-brand-gold">{(stats.totalSpent / 1000000).toFixed(1)}M</span>
              <span className="text-xs text-brand-gray">درآمد</span>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="جستجوی مشتریان..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-10 py-2 text-sm text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
              />
            </div>

            {/* Type Filter */}
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
            >
              <option value="all" className="bg-[#1a1a1a]">همه انواع</option>
              {Object.entries(customerTypeConfig).map(([key, config]) => (
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
                <option value="visits" className="bg-[#1a1a1a]">تعداد ویزیت</option>
                <option value="spent" className="bg-[#1a1a1a]">خرج کرده</option>
                <option value="last_visit" className="bg-[#1a1a1a]">آخرین ویزیت</option>
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
        {filteredCustomers.length === 0 ? (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <Users className="w-20 h-20 mx-auto mb-4 text-brand-gray opacity-20" strokeWidth={1.5} />
            <p className="text-xl font-bold text-white mb-2">مشتری یافت نشد</p>
            <p className="text-brand-gray mb-6">فیلترها رو تغییر بده یا مشتری جدید اضافه کن</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-luxury-amber-500 text-black font-bold"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              اولین مشتری رو اضافه کن
            </motion.button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredCustomers.map((customer, index) => {
                  const config = customerTypeConfig[customer.customer_type as keyof typeof customerTypeConfig] || customerTypeConfig.regular;
                  const TypeIcon = config.icon;
                  
                  return (
                    <motion.div
                      key={customer.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="relative group"
                    >
                      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all h-full flex flex-col">
                        {/* Avatar & Type */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luxury-slate-400 to-luxury-sky-400 flex items-center justify-center text-white text-lg font-black">
                              {customer.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                            </div>
                            <div>
                              <h3 className="text-base font-bold text-white truncate">{customer.name}</h3>
                              {customer.phone && (
                                <p className="text-xs text-brand-gray truncate">{customer.phone}</p>
                              )}
                            </div>
                          </div>

                          {/* Type Badge */}
                          <div className={`${config.bg} border ${config.border} p-1.5 rounded-lg`}>
                            <TypeIcon className={`w-4 h-4 text-${config.color}`} strokeWidth={2.5} />
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex-1 space-y-2 mb-4">
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1.5 text-brand-gray">
                              <Calendar className="w-3.5 h-3.5" strokeWidth={2.5} />
                              <span>ویزیت:</span>
                            </div>
                            <span className="font-bold text-white">{customer.visit_count || 0}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center gap-1.5 text-brand-gray">
                              <DollarSign className="w-3.5 h-3.5" strokeWidth={2.5} />
                              <span>خرج:</span>
                            </div>
                            <span className="font-bold text-brand-gold">{((customer.total_spent || 0) / 1000).toFixed(0)}K</span>
                          </div>
                          {customer.last_visit && (
                            <div className="flex items-center justify-between text-sm pt-2 border-t border-white/10">
                              <span className="text-brand-gray">آخرین ویزیت:</span>
                              <span className="text-xs font-bold text-white">
                                {new Date(customer.last_visit).toLocaleDateString("fa-IR", { day: "numeric", month: "short" })}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openDetailsModal(customer)}
                            className="flex-1 px-3 py-2 rounded-lg bg-luxury-sky-400/10 border border-luxury-sky-400/30 text-luxury-sky-400 text-xs font-bold hover:bg-luxury-sky-400/20 transition-all flex items-center justify-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" strokeWidth={2.5} />
                            جزئیات
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => openModal(customer)}
                            className="w-9 h-9 rounded-lg bg-luxury-amber-400/10 border border-luxury-amber-400/30 flex items-center justify-center hover:bg-luxury-amber-400/20 transition-all"
                          >
                            <Edit2 className="w-4 h-4 text-luxury-amber-400" strokeWidth={2.5} />
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(customer.id)}
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
                {filteredCustomers.map((customer, index) => {
                  const config = customerTypeConfig[customer.customer_type as keyof typeof customerTypeConfig] || customerTypeConfig.regular;
                  const TypeIcon = config.icon;
                  
                  return (
                    <motion.div
                      key={customer.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.005, x: 4 }}
                      className="relative group"
                    >
                      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-luxury-slate-400 to-luxury-sky-400 flex items-center justify-center text-white font-black flex-shrink-0">
                            {customer.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-white truncate mb-1">{customer.name}</h3>
                            <div className="flex items-center gap-3 text-sm text-brand-gray">
                              {customer.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5" strokeWidth={2.5} />
                                  {customer.phone}
                                </div>
                              )}
                              {customer.email && (
                                <div className="flex items-center gap-1 truncate">
                                  <Mail className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
                                  <span className="truncate">{customer.email}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Type Badge */}
                          <div className={`${config.bg} border ${config.border} px-3 py-2 rounded-lg flex items-center gap-2 flex-shrink-0`}>
                            <TypeIcon className={`w-4 h-4 text-${config.color}`} strokeWidth={2.5} />
                            <span className={`text-sm font-bold text-${config.color}`}>{config.label}</span>
                          </div>

                          {/* Stats */}
                          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
                            <div className="text-center">
                              <p className="text-lg font-black text-white">{customer.visit_count || 0}</p>
                              <p className="text-xs text-brand-gray">ویزیت</p>
                            </div>
                            <div className="text-center">
                              <p className="text-lg font-black text-brand-gold">{((customer.total_spent || 0) / 1000).toFixed(0)}K</p>
                              <p className="text-xs text-brand-gray">تومان</p>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openDetailsModal(customer)}
                              className="w-8 h-8 rounded-lg bg-luxury-sky-400/10 border border-luxury-sky-400/30 flex items-center justify-center hover:bg-luxury-sky-400/20 transition-all"
                            >
                              <Eye className="w-4 h-4 text-luxury-sky-400" strokeWidth={2.5} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openModal(customer)}
                              className="w-8 h-8 rounded-lg bg-luxury-amber-400/10 border border-luxury-amber-400/30 flex items-center justify-center hover:bg-luxury-amber-400/20 transition-all"
                            >
                              <Edit2 className="w-4 h-4 text-luxury-amber-400" strokeWidth={2.5} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(customer.id)}
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
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-white">
                    {isEditing ? "ویرایش مشتری" : "مشتری جدید"}
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
                    <label className="block text-sm font-bold text-white mb-2">نام و نام خانوادگی *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                      placeholder="مثلاً: مریم احمدی"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">ایمیل</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="email@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">شماره تماس *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="09123456789"
                      />
                    </div>
                  </div>

                  {/* Type & Birthday */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">نوع مشتری</label>
                      <select
                        value={formData.customer_type}
                        onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
                      >
                        {Object.entries(customerTypeConfig).map(([key, config]) => (
                          <option key={key} value={key} className="bg-[#1a1a1a]">{config.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">تاریخ تولد</label>
                      <input
                        type="date"
                        value={formData.birthday}
                        onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 transition-all"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">آدرس</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                      placeholder="آدرس محل سکونت..."
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">یادداشت‌ها</label>
                    <textarea
                      rows={3}
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all resize-none"
                      placeholder="یادداشت‌های مربوط به مشتری..."
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
                      {isEditing ? "ذخیره تغییرات" : "ایجاد مشتری"}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedCustomer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeDetailsModal}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-luxury-slate-400 to-luxury-sky-400 flex items-center justify-center text-white text-2xl font-black">
                      {selectedCustomer.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-white">{selectedCustomer.name}</h2>
                      <p className="text-sm text-brand-gray">{selectedCustomer.phone}</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={closeDetailsModal}
                    className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-luxury-rose-400/50 transition-all"
                  >
                    <X className="w-4 h-4" strokeWidth={2.5} />
                  </motion.button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-luxury-sky-400" strokeWidth={2} />
                    <p className="text-2xl font-black text-white">{selectedCustomer.visit_count || 0}</p>
                    <p className="text-xs text-brand-gray">ویزیت</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 text-center">
                    <DollarSign className="w-8 h-8 mx-auto mb-2 text-brand-gold" strokeWidth={2} />
                    <p className="text-2xl font-black text-brand-gold">{((selectedCustomer.total_spent || 0) / 1000).toFixed(0)}K</p>
                    <p className="text-xs text-brand-gray">خرج کرده</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 text-center">
                    <Star className="w-8 h-8 mx-auto mb-2 text-luxury-amber-400" strokeWidth={2} />
                    <p className="text-2xl font-black text-white">{selectedCustomer.loyalty_points || 0}</p>
                    <p className="text-xs text-brand-gray">امتیاز</p>
                  </div>
                </div>

                {/* Info */}
                <div className="space-y-4 mb-6">
                  {selectedCustomer.email && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <Mail className="w-5 h-5 text-luxury-sky-400" strokeWidth={2.5} />
                      <span className="text-sm text-white">{selectedCustomer.email}</span>
                    </div>
                  )}
                  {selectedCustomer.address && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <MapPin className="w-5 h-5 text-luxury-rose-400" strokeWidth={2.5} />
                      <span className="text-sm text-white">{selectedCustomer.address}</span>
                    </div>
                  )}
                  {selectedCustomer.birthday && (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/10">
                      <Gift className="w-5 h-5 text-luxury-amber-400" strokeWidth={2.5} />
                      <span className="text-sm text-white">تولد: {new Date(selectedCustomer.birthday).toLocaleDateString("fa-IR")}</span>
                    </div>
                  )}
                </div>

                {/* Recent Bookings */}
                <div>
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <History className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                    رزروهای اخیر
                  </h3>
                  <div className="space-y-2">
                    {getCustomerBookings(selectedCustomer.id).slice(0, 5).map((booking) => (
                      <div key={booking.id} className="bg-white/[0.02] border border-white/10 rounded-xl p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-bold text-white">{booking.service_name || 'خدمت'}</p>
                            <p className="text-xs text-brand-gray">{new Date(booking.booking_date).toLocaleDateString("fa-IR")} - {booking.booking_time}</p>
                          </div>
                          <span className="text-sm font-bold text-brand-gold">{Number(booking.price).toLocaleString()} تومان</span>
                        </div>
                      </div>
                    ))}
                    {getCustomerBookings(selectedCustomer.id).length === 0 && (
                      <p className="text-center text-brand-gray py-8">رزروی ثبت نشده</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
