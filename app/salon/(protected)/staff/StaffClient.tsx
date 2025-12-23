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
  Briefcase,
  Crown,
  Zap,
  CheckCircle,
  XCircle,
  X,
  User,
  Grid3x3,
  LayoutList,
  ArrowUpDown,
  Calendar,
  Image as ImageIcon,
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

// Role config
const roleConfig = {
  admin: {
    label: "مدیر",
    icon: Crown,
    color: "brand-gold",
    bg: "bg-brand-gold/10",
    border: "border-brand-gold/30",
  },
  manager: {
    label: "مسئول",
    icon: Award,
    color: "luxury-amber-400",
    bg: "bg-luxury-amber-400/10",
    border: "border-luxury-amber-400/30",
  },
  stylist: {
    label: "آرایشگر",
    icon: Briefcase,
    color: "luxury-sky-400",
    bg: "bg-luxury-sky-400/10",
    border: "border-luxury-sky-400/30",
  },
  assistant: {
    label: "دستیار",
    icon: User,
    color: "luxury-slate-400",
    bg: "bg-luxury-slate-400/10",
    border: "border-luxury-slate-400/30",
  },
};

type ViewMode = "grid" | "list";

export default function StaffClient() {
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [staff, setStaff] = useState<any[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
  
  // UI State
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"name" | "role" | "rating">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "stylist",
    specialties: "",
    bio: "",
    is_active: true,
  });

  // Stats
  const stats = useMemo(() => {
    return {
      total: staff.length,
      active: staff.filter(s => s.is_active).length,
      stylists: staff.filter(s => s.role === 'stylist').length,
      avgRating: staff.length ? staff.reduce((sum, s) => sum + (s.rating || 0), 0) / staff.length : 0,
    };
  }, [staff]);

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

        const { data: staffData } = await supabase
          .from("staff")
          .select("*")
          .eq("tenant_id", currentTenant.id)
          .order("name", { ascending: true });

        if (staffData) {
          setStaff(staffData);
          setFilteredStaff(staffData);
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
    let filtered = [...staff];

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.phone?.includes(searchQuery)
      );
    }

    // Role
    if (selectedRole !== "all") {
      filtered = filtered.filter((s) => s.role === selectedRole);
    }

    // Sort
    filtered.sort((a, b) => {
      let compareValue = 0;
      
      if (sortBy === "name") {
        compareValue = (a.name || "").localeCompare(b.name || "");
      } else if (sortBy === "role") {
        compareValue = (a.role || "").localeCompare(b.role || "");
      } else if (sortBy === "rating") {
        compareValue = (b.rating || 0) - (a.rating || 0);
      }
      
      return sortOrder === "desc" ? compareValue : -compareValue;
    });

    setFilteredStaff(filtered);
  }, [searchQuery, selectedRole, sortBy, sortOrder, staff]);

  // Handle modal
  const openModal = (member?: any) => {
    if (member) {
      setSelectedStaff(member);
      setFormData({
        name: member.name || "",
        email: member.email || "",
        phone: member.phone || "",
        role: member.role || "stylist",
        specialties: member.specialties || "",
        bio: member.bio || "",
        is_active: member.is_active ?? true,
      });
      setIsEditing(true);
    } else {
      setSelectedStaff(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
        role: "stylist",
        specialties: "",
        bio: "",
        is_active: true,
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStaff(null);
    setIsEditing(false);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const supabase = createClient();
      
      if (isEditing && selectedStaff) {
        // Update
        const { error } = await supabase
          .from("staff")
          .update({
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            specialties: formData.specialties,
            bio: formData.bio,
            is_active: formData.is_active,
          })
          .eq("id", selectedStaff.id);

        if (error) throw error;

        // Update local state
        setStaff(staff.map(s => 
          s.id === selectedStaff.id 
            ? { ...s, ...formData }
            : s
        ));
      } else {
        // Create
        const { data, error } = await supabase
          .from("staff")
          .insert([{
            tenant_id: tenant.id,
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            role: formData.role,
            specialties: formData.specialties,
            bio: formData.bio,
            is_active: formData.is_active,
            rating: 5.0,
          }])
          .select();

        if (error) throw error;
        if (data) {
          setStaff([...staff, data[0]]);
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این کارمند اطمینان دارید؟")) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("staff")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setStaff(staff.filter(s => s.id !== id));
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
                مدیریت کارمندان
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
              <span className="text-sm">کارمند جدید</span>
            </motion.button>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <Users className="w-3.5 h-3.5 text-luxury-sky-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-white">{stats.total}</span>
              <span className="text-xs text-brand-gray">کارمند</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <CheckCircle className="w-3.5 h-3.5 text-luxury-emerald-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-luxury-emerald-400">{stats.active}</span>
              <span className="text-xs text-brand-gray">فعال</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <Briefcase className="w-3.5 h-3.5 text-luxury-amber-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-luxury-amber-400">{stats.stylists}</span>
              <span className="text-xs text-brand-gray">آرایشگر</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <Star className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2.5} />
              <span className="text-xs font-bold text-brand-gold">{stats.avgRating.toFixed(1)}</span>
              <span className="text-xs text-brand-gray">امتیاز</span>
            </div>
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" strokeWidth={2.5} />
              <input
                type="text"
                placeholder="جستجوی کارمندان..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-10 py-2 text-sm text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
              />
            </div>

            {/* Role Filter */}
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
            >
              <option value="all" className="bg-[#1a1a1a]">همه نقش‌ها</option>
              {Object.entries(roleConfig).map(([key, config]) => (
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
                <option value="role" className="bg-[#1a1a1a]">نقش</option>
                <option value="rating" className="bg-[#1a1a1a]">امتیاز</option>
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
        {filteredStaff.length === 0 ? (
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <Users className="w-20 h-20 mx-auto mb-4 text-brand-gray opacity-20" strokeWidth={1.5} />
            <p className="text-xl font-bold text-white mb-2">کارمندی یافت نشد</p>
            <p className="text-brand-gray mb-6">فیلترها رو تغییر بده یا کارمند جدید اضافه کن</p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-luxury-amber-500 text-black font-bold"
            >
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              اولین کارمند رو اضافه کن
            </motion.button>
          </div>
        ) : (
          <>
            {/* Grid View */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredStaff.map((member, index) => {
                  const config = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.assistant;
                  const RoleIcon = config.icon;
                  
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.02, y: -4 }}
                      className="relative group"
                    >
                      {!member.is_active && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-luxury-rose-400/10 border border-luxury-rose-400/30 z-10">
                          <span className="text-xs font-bold text-luxury-rose-400">غیرفعال</span>
                        </div>
                      )}

                      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all h-full flex flex-col">
                        {/* Avatar */}
                        <div className="flex flex-col items-center mb-4">
                          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-luxury-slate-400 to-luxury-sky-400 flex items-center justify-center text-white text-2xl font-black mb-3">
                            {member.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                          </div>
                          
                          <h3 className="text-lg font-bold text-white text-center mb-1">{member.name}</h3>
                          
                          {/* Role Badge */}
                          <div className={`${config.bg} border ${config.border} px-3 py-1 rounded-lg flex items-center gap-1.5`}>
                            <RoleIcon className={`w-3.5 h-3.5 text-${config.color}`} strokeWidth={2.5} />
                            <span className={`text-xs font-bold text-${config.color}`}>{config.label}</span>
                          </div>
                        </div>

                        {/* Rating */}
                        {member.rating && (
                          <div className="flex items-center justify-center gap-1 mb-4">
                            <Star className="w-4 h-4 text-brand-gold fill-brand-gold" strokeWidth={2.5} />
                            <span className="text-sm font-bold text-brand-gold">{member.rating.toFixed(1)}</span>
                          </div>
                        )}

                        {/* Info */}
                        <div className="flex-1 space-y-2 mb-4">
                          {member.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3.5 h-3.5 text-luxury-sky-400 flex-shrink-0" strokeWidth={2.5} />
                              <span className="text-brand-gray truncate">{member.phone}</span>
                            </div>
                          )}
                          {member.email && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="w-3.5 h-3.5 text-luxury-amber-400 flex-shrink-0" strokeWidth={2.5} />
                              <span className="text-brand-gray truncate">{member.email}</span>
                            </div>
                          )}
                          {member.specialties && (
                            <div className="pt-2 border-t border-white/10">
                              <p className="text-xs text-brand-gray line-clamp-2">{member.specialties}</p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => openModal(member)}
                            className="flex-1 px-3 py-2 rounded-lg bg-luxury-sky-400/10 border border-luxury-sky-400/30 text-luxury-sky-400 text-sm font-bold hover:bg-luxury-sky-400/20 transition-all"
                          >
                            ویرایش
                          </motion.button>

                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDelete(member.id)}
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
                {filteredStaff.map((member, index) => {
                  const config = roleConfig[member.role as keyof typeof roleConfig] || roleConfig.assistant;
                  const RoleIcon = config.icon;
                  
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.02 }}
                      whileHover={{ scale: 1.005, x: 4 }}
                      className="relative group"
                    >
                      <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all">
                        <div className="flex items-center gap-4">
                          {/* Avatar */}
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-luxury-slate-400 to-luxury-sky-400 flex items-center justify-center text-white text-lg font-black flex-shrink-0">
                            {member.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase()}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-white truncate">{member.name}</h3>
                              {!member.is_active && (
                                <span className="px-2 py-0.5 rounded-full bg-luxury-rose-400/10 border border-luxury-rose-400/30 text-xs font-bold text-luxury-rose-400 flex-shrink-0">
                                  غیرفعال
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-3 text-sm text-brand-gray">
                              {member.phone && (
                                <div className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5" strokeWidth={2.5} />
                                  {member.phone}
                                </div>
                              )}
                              {member.email && (
                                <div className="flex items-center gap-1 truncate">
                                  <Mail className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2.5} />
                                  <span className="truncate">{member.email}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Role Badge */}
                          <div className={`${config.bg} border ${config.border} px-4 py-2 rounded-lg flex items-center gap-2 flex-shrink-0`}>
                            <RoleIcon className={`w-4 h-4 text-${config.color}`} strokeWidth={2.5} />
                            <span className={`text-sm font-bold text-${config.color}`}>{config.label}</span>
                          </div>

                          {/* Rating */}
                          {member.rating && (
                            <div className="flex items-center gap-1 px-3 py-2 rounded-lg bg-brand-gold/10 border border-brand-gold/30 flex-shrink-0">
                              <Star className="w-4 h-4 text-brand-gold fill-brand-gold" strokeWidth={2.5} />
                              <span className="text-sm font-bold text-brand-gold">{member.rating.toFixed(1)}</span>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => openModal(member)}
                              className="w-8 h-8 rounded-lg bg-luxury-sky-400/10 border border-luxury-sky-400/30 flex items-center justify-center hover:bg-luxury-sky-400/20 transition-all"
                            >
                              <Edit2 className="w-4 h-4 text-luxury-sky-400" strokeWidth={2.5} />
                            </motion.button>

                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleDelete(member.id)}
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
                    {isEditing ? "ویرایش کارمند" : "کارمند جدید"}
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
                      <label className="block text-sm font-bold text-white mb-2">شماره تماس</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="09123456789"
                      />
                    </div>
                  </div>

                  {/* Role */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">نقش *</label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
                    >
                      {Object.entries(roleConfig).map(([key, config]) => (
                        <option key={key} value={key} className="bg-[#1a1a1a]">{config.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Specialties */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">تخصص‌ها</label>
                    <input
                      type="text"
                      value={formData.specialties}
                      onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                      placeholder="مثلاً: رنگ مو، کوتاهی، مش"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">بیوگرافی</label>
                    <textarea
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all resize-none"
                      placeholder="توضیحات کوتاه درباره کارمند..."
                    />
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
                      کارمند فعال باشد
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
                      {isEditing ? "ذخیره تغییرات" : "ایجاد کارمند"}
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
