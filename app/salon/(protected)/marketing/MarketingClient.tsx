"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Send,
  Plus,
  Search,
  MessageSquare,
  Users,
  Calendar,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
  Edit2,
  Trash2,
  X,
  Copy,
  Eye,
  Sparkles,
  Target,
  Gift,
  Crown,
  Heart,
  Zap,
  Star,
  Filter,
  Download,
  BarChart3,
  Mail,
  Phone,
  FileText,
  Megaphone,
  BellRing,
  Tag,
  Percent,
  PartyPopper,
  Cake,
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

type CampaignStatus = "draft" | "scheduled" | "sent" | "failed";
type CampaignType = "promotional" | "birthday" | "reminder" | "announcement" | "special-offer";
type TabType = "campaigns" | "templates" | "segments" | "analytics";

const campaignTypeConfig = {
  promotional: {
    label: "تبلیغاتی",
    icon: Megaphone,
    color: "luxury-amber-400",
    bg: "bg-luxury-amber-400/10",
    border: "border-luxury-amber-400/30",
  },
  birthday: {
    label: "تولد",
    icon: Cake,
    color: "luxury-rose-400",
    bg: "bg-luxury-rose-400/10",
    border: "border-luxury-rose-400/30",
  },
  reminder: {
    label: "یادآوری",
    icon: BellRing,
    color: "luxury-sky-400",
    bg: "bg-luxury-sky-400/10",
    border: "border-luxury-sky-400/30",
  },
  announcement: {
    label: "اطلاعیه",
    icon: MessageSquare,
    color: "luxury-violet-400",
    bg: "bg-luxury-violet-400/10",
    border: "border-luxury-violet-400/30",
  },
  "special-offer": {
    label: "پیشنهاد ویژه",
    icon: Gift,
    color: "brand-gold",
    bg: "bg-brand-gold/10",
    border: "border-brand-gold/30",
  },
};

const statusConfig = {
  draft: {
    label: "پیش‌نویس",
    icon: FileText,
    color: "luxury-slate-400",
    bg: "bg-luxury-slate-400/10",
    border: "border-luxury-slate-400/30",
  },
  scheduled: {
    label: "زمان‌بندی شده",
    icon: Clock,
    color: "luxury-amber-400",
    bg: "bg-luxury-amber-400/10",
    border: "border-luxury-amber-400/30",
  },
  sent: {
    label: "ارسال شده",
    icon: CheckCircle,
    color: "luxury-emerald-400",
    bg: "bg-luxury-emerald-400/10",
    border: "border-luxury-emerald-400/30",
  },
  failed: {
    label: "ناموفق",
    icon: XCircle,
    color: "luxury-rose-400",
    bg: "bg-luxury-rose-400/10",
    border: "border-luxury-rose-400/30",
  },
};

export default function MarketingClient() {
  const [loading, setLoading] = useState(true);
  const [tenant, setTenant] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("campaigns");

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | CampaignStatus>("all");
  const [filterType, setFilterType] = useState<"all" | CampaignType>("all");
  const [showModal, setShowModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "promotional" as CampaignType,
    message: "",
    target_segment: "all",
    scheduled_date: "",
    scheduled_time: "",
  });

  // SMS Templates
  const smsTemplates = [
    {
      id: 1,
      name: "تخفیف ویژه",
      type: "promotional",
      message: "سلام {name} عزیز! تخفیف ویژه {discount}% برای شما! از {salon} رزرو کنید. 📞 {phone}",
      variables: ["name", "discount", "salon", "phone"],
    },
    {
      id: 2,
      name: "تبریک تولد",
      type: "birthday",
      message: "تولدت مبارک {name} جان! 🎂🎉 هدیه ویژه تولد در انتظار شماست. {salon}",
      variables: ["name", "salon"],
    },
    {
      id: 3,
      name: "یادآوری نوبت",
      type: "reminder",
      message: "{name} عزیز، نوبت شما {date} ساعت {time} می‌باشد. {salon} - {phone}",
      variables: ["name", "date", "time", "salon", "phone"],
    },
    {
      id: 4,
      name: "خدمات جدید",
      type: "announcement",
      message: "سلام {name}! خدمات جدید {service} در {salon} آغاز شد. 🌟 اطلاعات بیشتر: {phone}",
      variables: ["name", "service", "salon", "phone"],
    },
    {
      id: 5,
      name: "پیشنهاد ویژه VIP",
      type: "special-offer",
      message: "{name} گرامی، به عنوان مشتری VIP، {discount}% تخفیف ویژه برای شما! 👑 {salon}",
      variables: ["name", "discount", "salon"],
    },
  ];

  // Tabs
  const tabs = [
    { id: "campaigns" as TabType, label: "کمپین‌ها", icon: Megaphone },
    { id: "templates" as TabType, label: "تمپلیت‌ها", icon: FileText },
    { id: "segments" as TabType, label: "گروه‌بندی", icon: Users },
    { id: "analytics" as TabType, label: "آمار", icon: BarChart3 },
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

        // Fetch campaigns
        const { data: campaignsData } = await supabase
          .from("campaigns")
          .select("*")
          .eq("tenant_id", currentTenant.id)
          .order("created_at", { ascending: false });

        if (campaignsData) {
          setCampaigns(campaignsData);
        }

        // Fetch customers
        const { data: customersData } = await supabase
          .from("customers")
          .select("*")
          .eq("tenant_id", currentTenant.id);

        if (customersData) {
          setCustomers(customersData);
        }

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter campaigns
  const filteredCampaigns = useMemo(() => {
    let filtered = [...campaigns];

    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.message?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(c => c.status === filterStatus);
    }

    if (filterType !== "all") {
      filtered = filtered.filter(c => c.type === filterType);
    }

    return filtered;
  }, [campaigns, searchQuery, filterStatus, filterType]);

  // Customer segments
  const segments = useMemo(() => {
    return {
      all: {
        label: "همه مشتریان",
        count: customers.length,
        icon: Users,
        color: "luxury-sky-400",
      },
      vip: {
        label: "مشتریان VIP",
        count: customers.filter(c => c.customer_type === "vip").length,
        icon: Crown,
        color: "brand-gold",
      },
      premium: {
        label: "مشتریان پرمیوم",
        count: customers.filter(c => c.customer_type === "premium").length,
        icon: Star,
        color: "luxury-amber-400",
      },
      loyal: {
        label: "مشتریان وفادار",
        count: customers.filter(c => c.customer_type === "loyal").length,
        icon: Heart,
        color: "luxury-rose-400",
      },
      birthday: {
        label: "تولد این ماه",
        count: customers.filter(c => {
          if (!c.birthday) return false;
          const birthday = new Date(c.birthday);
          const now = new Date();
          return birthday.getMonth() === now.getMonth();
        }).length,
        icon: Cake,
        color: "luxury-violet-400",
      },
      inactive: {
        label: "غیرفعال (3+ ماه)",
        count: customers.filter(c => {
          if (!c.last_visit) return false;
          const lastVisit = new Date(c.last_visit);
          const monthsAgo = new Date();
          monthsAgo.setMonth(monthsAgo.getMonth() - 3);
          return lastVisit < monthsAgo;
        }).length,
        icon: AlertCircle,
        color: "luxury-slate-400",
      },
    };
  }, [customers]);

  // Stats
  const stats = useMemo(() => {
    const totalCampaigns = campaigns.length;
    const sentCampaigns = campaigns.filter(c => c.status === "sent").length;
    const scheduledCampaigns = campaigns.filter(c => c.status === "scheduled").length;
    const totalRecipients = campaigns.reduce((sum, c) => sum + (c.recipients_count || 0), 0);
    const successRate = sentCampaigns > 0 
      ? (campaigns.filter(c => c.status === "sent" && c.success_count).reduce((sum, c) => sum + c.success_count, 0) / totalRecipients * 100) || 0
      : 0;

    return {
      totalCampaigns,
      sentCampaigns,
      scheduledCampaigns,
      totalRecipients,
      successRate,
    };
  }, [campaigns]);

  // Handle modal
  const openModal = (campaign?: any) => {
    if (campaign) {
      setSelectedCampaign(campaign);
      setFormData({
        name: campaign.name || "",
        type: campaign.type || "promotional",
        message: campaign.message || "",
        target_segment: campaign.target_segment || "all",
        scheduled_date: campaign.scheduled_date || "",
        scheduled_time: campaign.scheduled_time || "",
      });
      setIsEditing(true);
    } else {
      setSelectedCampaign(null);
      setFormData({
        name: "",
        type: "promotional",
        message: "",
        target_segment: "all",
        scheduled_date: "",
        scheduled_time: "",
      });
      setIsEditing(false);
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedCampaign(null);
    setIsEditing(false);
  };

  // Use template
  const useTemplate = (template: any) => {
    setFormData({
      ...formData,
      type: template.type,
      message: template.message,
    });
    setShowTemplateModal(false);
  };

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const supabase = createClient();
      
      // Count recipients
      let recipientsCount = 0;
      if (formData.target_segment === "all") {
        recipientsCount = customers.length;
      } else {
        recipientsCount = customers.filter(c => c.customer_type === formData.target_segment).length;
      }

      if (isEditing && selectedCampaign) {
        // Update
        const { error } = await supabase
          .from("campaigns")
          .update({
            name: formData.name,
            type: formData.type,
            message: formData.message,
            target_segment: formData.target_segment,
            scheduled_date: formData.scheduled_date || null,
            scheduled_time: formData.scheduled_time || null,
            recipients_count: recipientsCount,
            status: formData.scheduled_date ? "scheduled" : "draft",
          })
          .eq("id", selectedCampaign.id);

        if (error) throw error;

        setCampaigns(campaigns.map(c => 
          c.id === selectedCampaign.id 
            ? { 
                ...c, 
                ...formData, 
                recipients_count: recipientsCount,
                status: formData.scheduled_date ? "scheduled" : "draft",
              }
            : c
        ));
      } else {
        // Create
        const { data, error } = await supabase
          .from("campaigns")
          .insert([{
            tenant_id: tenant.id,
            name: formData.name,
            type: formData.type,
            message: formData.message,
            target_segment: formData.target_segment,
            scheduled_date: formData.scheduled_date || null,
            scheduled_time: formData.scheduled_time || null,
            recipients_count: recipientsCount,
            status: formData.scheduled_date ? "scheduled" : "draft",
          }])
          .select();

        if (error) throw error;
        if (data) {
          setCampaigns([data[0], ...campaigns]);
        }
      }

      closeModal();
    } catch (error) {
      console.error("Error:", error);
      alert("خطا در ثبت کمپین!");
    }
  };

  // Handle send campaign
  const handleSendCampaign = async (campaignId: string) => {
    if (!confirm("آیا از ارسال این کمپین اطمینان دارید؟")) return;
    
    try {
      const supabase = createClient();
      
      const campaign = campaigns.find(c => c.id === campaignId);
      if (!campaign) return;

      // Simulate sending
      const { error } = await supabase
        .from("campaigns")
        .update({
          status: "sent",
          sent_at: new Date().toISOString(),
          success_count: campaign.recipients_count,
        })
        .eq("id", campaignId);

      if (error) throw error;

      setCampaigns(campaigns.map(c => 
        c.id === campaignId 
          ? { 
              ...c, 
              status: "sent",
              sent_at: new Date().toISOString(),
              success_count: c.recipients_count,
            }
          : c
      ));

      alert("کمپین با موفقیت ارسال شد!");
    } catch (error) {
      console.error("Error:", error);
      alert("خطا در ارسال کمپین!");
    }
  };

  // Handle delete
  const handleDelete = async (id: string) => {
    if (!confirm("آیا از حذف این کمپین اطمینان دارید؟")) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from("campaigns")
        .delete()
        .eq("id", id);

      if (error) throw error;
      
      setCampaigns(campaigns.filter(c => c.id !== id));
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
                <Send className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
                بازاریابی و پیامک
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
              <span className="text-sm">کمپین جدید</span>
            </motion.button>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <Megaphone className="w-3.5 h-3.5 text-luxury-sky-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-white">{stats.totalCampaigns}</span>
              <span className="text-xs text-brand-gray">کمپین</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-luxury-emerald-400/10 border border-luxury-emerald-400/30">
              <CheckCircle className="w-3.5 h-3.5 text-luxury-emerald-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-luxury-emerald-400">{stats.sentCampaigns}</span>
              <span className="text-xs text-brand-gray">ارسال شده</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-luxury-amber-400/10 border border-luxury-amber-400/30">
              <Clock className="w-3.5 h-3.5 text-luxury-amber-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-luxury-amber-400">{stats.scheduledCampaigns}</span>
              <span className="text-xs text-brand-gray">زمان‌بندی</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <Users className="w-3.5 h-3.5 text-brand-gold" strokeWidth={2.5} />
              <span className="text-xs font-bold text-brand-gold">{stats.totalRecipients}</span>
              <span className="text-xs text-brand-gray">مخاطب</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/10">
              <TrendingUp className="w-3.5 h-3.5 text-luxury-emerald-400" strokeWidth={2.5} />
              <span className="text-xs font-bold text-luxury-emerald-400">{stats.successRate.toFixed(1)}%</span>
              <span className="text-xs text-brand-gray">موفقیت</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                    activeTab === tab.id
                      ? "bg-brand-gold text-black font-bold"
                      : "bg-white/[0.02] border border-white/10 text-brand-gray hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" strokeWidth={2.5} />
                  <span className="text-sm">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Campaigns Tab */}
          {activeTab === "campaigns" && (
            <motion.div
              key="campaigns"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Filters */}
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray" strokeWidth={2.5} />
                  <input
                    type="text"
                    placeholder="جستجوی کمپین..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-10 py-2 text-sm text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                  />
                </div>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
                >
                  <option value="all" className="bg-[#1a1a1a]">همه وضعیت‌ها</option>
                  {Object.entries(statusConfig).map(([key, config]) => (
                    <option key={key} value={key} className="bg-[#1a1a1a]">{config.label}</option>
                  ))}
                </select>

                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-3 py-2 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-bold appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
                >
                  <option value="all" className="bg-[#1a1a1a]">همه انواع</option>
                  {Object.entries(campaignTypeConfig).map(([key, config]) => (
                    <option key={key} value={key} className="bg-[#1a1a1a]">{config.label}</option>
                  ))}
                </select>
              </div>

              {/* Campaigns List */}
              {filteredCampaigns.length === 0 ? (
                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                  <Megaphone className="w-20 h-20 mx-auto mb-4 text-brand-gray opacity-20" strokeWidth={1.5} />
                  <p className="text-xl font-bold text-white mb-2">کمپینی یافت نشد</p>
                  <p className="text-brand-gray mb-6">اولین کمپین پیامکی خود را ایجاد کنید</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => openModal()}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-gold to-luxury-amber-500 text-black font-bold"
                  >
                    <Plus className="w-4 h-4" strokeWidth={2.5} />
                    ایجاد کمپین
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredCampaigns.map((campaign, index) => {
                    const typeConfig = campaignTypeConfig[campaign.type as CampaignType];
                    const statusConf = statusConfig[campaign.status as CampaignStatus];
                    const TypeIcon = typeConfig.icon;
                    const StatusIcon = statusConf.icon;

                    return (
                      <motion.div
                        key={campaign.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        whileHover={{ scale: 1.005, x: 4 }}
                        className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all"
                      >
                        <div className="flex items-start gap-4">
                          {/* Icon */}
                          <div className={`w-14 h-14 rounded-xl ${typeConfig.bg} border ${typeConfig.border} flex items-center justify-center flex-shrink-0`}>
                            <TypeIcon className={`w-7 h-7 text-${typeConfig.color}`} strokeWidth={2.5} />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-white mb-1">{campaign.name}</h3>
                                <p className="text-sm text-brand-gray line-clamp-2">{campaign.message}</p>
                              </div>
                              <div className={`${statusConf.bg} border ${statusConf.border} px-3 py-1.5 rounded-lg flex items-center gap-2 ml-4`}>
                                <StatusIcon className={`w-4 h-4 text-${statusConf.color}`} strokeWidth={2.5} />
                                <span className={`text-xs font-bold text-${statusConf.color}`}>{statusConf.label}</span>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-brand-gray mb-3">
                              <span className="flex items-center gap-1.5">
                                <Users className="w-4 h-4" strokeWidth={2.5} />
                                {campaign.recipients_count} مخاطب
                              </span>
                              {campaign.scheduled_date && (
                                <span className="flex items-center gap-1.5">
                                  <Calendar className="w-4 h-4" strokeWidth={2.5} />
                                  {new Date(campaign.scheduled_date).toLocaleDateString("fa-IR")}
                                </span>
                              )}
                              {campaign.success_count && (
                                <span className="flex items-center gap-1.5 text-luxury-emerald-400">
                                  <CheckCircle className="w-4 h-4" strokeWidth={2.5} />
                                  {campaign.success_count} موفق
                                </span>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              {campaign.status === "draft" && (
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleSendCampaign(campaign.id)}
                                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-luxury-emerald-400/10 border border-luxury-emerald-400/30 text-luxury-emerald-400 text-sm font-bold hover:bg-luxury-emerald-400/20 transition-all"
                                >
                                  <Send className="w-4 h-4" strokeWidth={2.5} />
                                  ارسال
                                </motion.button>
                              )}
                              
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => openModal(campaign)}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-luxury-amber-400/10 border border-luxury-amber-400/30 text-luxury-amber-400 text-sm font-bold hover:bg-luxury-amber-400/20 transition-all"
                              >
                                <Edit2 className="w-4 h-4" strokeWidth={2.5} />
                                ویرایش
                              </motion.button>

                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDelete(campaign.id)}
                                className="w-10 h-10 rounded-lg bg-luxury-rose-400/10 border border-luxury-rose-400/30 flex items-center justify-center hover:bg-luxury-rose-400/20 transition-all"
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
            </motion.div>
          )}

          {/* Templates Tab */}
          {activeTab === "templates" && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                  تمپلیت‌های آماده
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {smsTemplates.map((template) => {
                    const typeConfig = campaignTypeConfig[template.type as CampaignType];
                    const TypeIcon = typeConfig.icon;

                    return (
                      <motion.div
                        key={template.id}
                        whileHover={{ scale: 1.02 }}
                        className="bg-white/[0.02] border border-white/10 rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/20 transition-all"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-lg ${typeConfig.bg} border ${typeConfig.border} flex items-center justify-center`}>
                              <TypeIcon className={`w-5 h-5 text-${typeConfig.color}`} strokeWidth={2.5} />
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-white">{template.name}</h4>
                              <p className={`text-xs text-${typeConfig.color}`}>{typeConfig.label}</p>
                            </div>
                          </div>
                        </div>

                        <p className="text-sm text-brand-gray mb-3 line-clamp-3">{template.message}</p>

                        <div className="flex items-center gap-2 mb-3 flex-wrap">
                          {template.variables.map((variable) => (
                            <span key={variable} className="px-2 py-1 rounded-lg bg-brand-gold/10 border border-brand-gold/30 text-xs font-bold text-brand-gold">
                              {`{${variable}}`}
                            </span>
                          ))}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            useTemplate(template);
                            openModal();
                          }}
                          className="w-full px-4 py-2 rounded-lg bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-sm font-bold hover:bg-brand-gold/20 transition-all flex items-center justify-center gap-2"
                        >
                          <Copy className="w-4 h-4" strokeWidth={2.5} />
                          استفاده از تمپلیت
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Segments Tab */}
          {activeTab === "segments" && (
            <motion.div
              key="segments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                  گروه‌بندی مشتریان
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(segments).map(([key, segment]) => {
                    const Icon = segment.icon;

                    return (
                      <motion.div
                        key={key}
                        whileHover={{ scale: 1.02, y: -4 }}
                        className="bg-white/[0.02] border border-white/10 rounded-xl p-5 hover:bg-white/[0.04] hover:border-white/20 transition-all"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-${segment.color}/10 border border-${segment.color}/30 flex items-center justify-center mb-4`}>
                          <Icon className={`w-6 h-6 text-${segment.color}`} strokeWidth={2.5} />
                        </div>

                        <h4 className="text-lg font-bold text-white mb-1">{segment.label}</h4>
                        <p className="text-3xl font-black text-brand-gold mb-4">{segment.count}</p>

                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setFormData({ ...formData, target_segment: key });
                            openModal();
                          }}
                          className={`w-full px-4 py-2 rounded-lg bg-${segment.color}/10 border border-${segment.color}/30 text-${segment.color} text-sm font-bold hover:bg-${segment.color}/20 transition-all flex items-center justify-center gap-2`}
                        >
                          <Send className="w-4 h-4" strokeWidth={2.5} />
                          ارسال پیامک
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}

          {/* Analytics Tab */}
          {activeTab === "analytics" && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-luxury-sky-400/10 border border-luxury-sky-400/30 flex items-center justify-center mb-4">
                    <Send className="w-6 h-6 text-luxury-sky-400" strokeWidth={2.5} />
                  </div>
                  <h4 className="text-3xl font-black text-white mb-1">{stats.totalCampaigns}</h4>
                  <p className="text-sm text-brand-gray">کل کمپین‌ها</p>
                </div>

                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-luxury-emerald-400/10 border border-luxury-emerald-400/30 flex items-center justify-center mb-4">
                    <CheckCircle className="w-6 h-6 text-luxury-emerald-400" strokeWidth={2.5} />
                  </div>
                  <h4 className="text-3xl font-black text-luxury-emerald-400 mb-1">{stats.sentCampaigns}</h4>
                  <p className="text-sm text-brand-gray">ارسال شده</p>
                </div>

                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-brand-gold/10 border border-brand-gold/30 flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
                  </div>
                  <h4 className="text-3xl font-black text-brand-gold mb-1">{stats.totalRecipients}</h4>
                  <p className="text-sm text-brand-gray">کل مخاطبان</p>
                </div>

                <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                  <div className="w-12 h-12 rounded-xl bg-luxury-emerald-400/10 border border-luxury-emerald-400/30 flex items-center justify-center mb-4">
                    <TrendingUp className="w-6 h-6 text-luxury-emerald-400" strokeWidth={2.5} />
                  </div>
                  <h4 className="text-3xl font-black text-luxury-emerald-400 mb-1">{stats.successRate.toFixed(1)}%</h4>
                  <p className="text-sm text-brand-gray">نرخ موفقیت</p>
                </div>
              </div>

              <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <h3 className="text-lg font-black text-white mb-4 flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-brand-gold" strokeWidth={2.5} />
                  عملکرد کمپین‌ها
                </h3>
                <p className="text-center text-brand-gray py-12">نمودار آماری به زودی...</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Add/Edit Campaign Modal */}
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
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-black text-white">
                    {isEditing ? "ویرایش کمپین" : "کمپین جدید"}
                  </h2>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowTemplateModal(true)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-brand-gold/10 border border-brand-gold/30 text-brand-gold text-sm font-bold"
                    >
                      <FileText className="w-4 h-4" strokeWidth={2.5} />
                      تمپلیت
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={closeModal}
                      className="w-8 h-8 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center hover:border-luxury-rose-400/50 transition-all"
                    >
                      <X className="w-4 h-4" strokeWidth={2.5} />
                    </motion.button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">نام کمپین *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="مثلاً: تخفیف نوروز"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">نوع کمپین *</label>
                      <select
                        required
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value as CampaignType })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
                      >
                        {Object.entries(campaignTypeConfig).map(([key, config]) => (
                          <option key={key} value={key} className="bg-[#1a1a1a]">{config.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">متن پیام *</label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all resize-none"
                      placeholder="متن پیامک خود را بنویسید..."
                    />
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-brand-gray">
                        متغیرها: {"{name}"}, {"{salon}"}, {"{phone}"}, {"{discount}"}
                      </p>
                      <p className="text-xs text-brand-gray">{formData.message.length}/160 کاراکتر</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-white mb-2">مخاطبان *</label>
                    <select
                      required
                      value={formData.target_segment}
                      onChange={(e) => setFormData({ ...formData, target_segment: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white appearance-none cursor-pointer focus:outline-none focus:border-brand-gold/50 transition-all"
                    >
                      {Object.entries(segments).map(([key, segment]) => (
                        <option key={key} value={key} className="bg-[#1a1a1a]">
                          {segment.label} ({segment.count} نفر)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">تاریخ ارسال</label>
                      <input
                        type="date"
                        value={formData.scheduled_date}
                        onChange={(e) => setFormData({ ...formData, scheduled_date: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">ساعت ارسال</label>
                      <input
                        type="time"
                        value={formData.scheduled_time}
                        onChange={(e) => setFormData({ ...formData, scheduled_time: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-gold/50 transition-all"
                      />
                    </div>
                  </div>

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
                      {isEditing ? "ذخیره تغییرات" : "ایجاد کمپین"}
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
