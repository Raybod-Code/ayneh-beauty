"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import {
  Settings,
  Building,
  Clock,
  Phone,
  Mail,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Image as ImageIcon,
  Save,
  Check,
  X,
  Edit2,
  Bell,
  Shield,
  Palette,
  Languages,
  DollarSign,
  Calendar,
  Users,
  Sparkles,
  Zap,
  Crown,
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

type SettingsTab = "general" | "hours" | "contact" | "social" | "notifications" | "appearance";

export default function SettingsClient() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [tenant, setTenant] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  // Form state
  const [formData, setFormData] = useState({
    // General
    name: "",
    description: "",
    tagline: "",
    logo_url: "",
    cover_url: "",
    
    // Hours
    working_hours: {
      saturday: { open: "09:00", close: "21:00", closed: false },
      sunday: { open: "09:00", close: "21:00", closed: false },
      monday: { open: "09:00", close: "21:00", closed: false },
      tuesday: { open: "09:00", close: "21:00", closed: false },
      wednesday: { open: "09:00", close: "21:00", closed: false },
      thursday: { open: "09:00", close: "21:00", closed: false },
      friday: { open: "09:00", close: "21:00", closed: true },
    },
    
    // Contact
    phone: "",
    email: "",
    address: "",
    city: "",
    postal_code: "",
    
    // Social
    website: "",
    instagram: "",
    facebook: "",
    twitter: "",
    telegram: "",
    
    // Notifications
    email_notifications: true,
    sms_notifications: true,
    booking_reminders: true,
    
    // Appearance
    primary_color: "#D4AF37",
    theme: "dark",
  });

  // Tabs config
  const tabs = [
    { id: "general" as SettingsTab, label: "عمومی", icon: Building },
    { id: "hours" as SettingsTab, label: "ساعت کاری", icon: Clock },
    { id: "contact" as SettingsTab, label: "تماس", icon: Phone },
    { id: "social" as SettingsTab, label: "شبکه‌های اجتماعی", icon: Globe },
    { id: "notifications" as SettingsTab, label: "اعلان‌ها", icon: Bell },
    { id: "appearance" as SettingsTab, label: "ظاهر", icon: Palette },
  ];

  const weekDays = [
    { id: "saturday", label: "شنبه" },
    { id: "sunday", label: "یکشنبه" },
    { id: "monday", label: "دوشنبه" },
    { id: "tuesday", label: "سه‌شنبه" },
    { id: "wednesday", label: "چهارشنبه" },
    { id: "thursday", label: "پنج‌شنبه" },
    { id: "friday", label: "جمعه" },
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

        // Set form data from tenant
        setFormData({
          name: currentTenant.name || "",
          description: currentTenant.description || "",
          tagline: currentTenant.tagline || "",
          logo_url: currentTenant.logo_url || "",
          cover_url: currentTenant.cover_url || "",
          working_hours: currentTenant.working_hours || formData.working_hours,
          phone: currentTenant.phone || "",
          email: currentTenant.email || "",
          address: currentTenant.address || "",
          city: currentTenant.city || "",
          postal_code: currentTenant.postal_code || "",
          website: currentTenant.website || "",
          instagram: currentTenant.instagram || "",
          facebook: currentTenant.facebook || "",
          twitter: currentTenant.twitter || "",
          telegram: currentTenant.telegram || "",
          email_notifications: currentTenant.email_notifications ?? true,
          sms_notifications: currentTenant.sms_notifications ?? true,
          booking_reminders: currentTenant.booking_reminders ?? true,
          primary_color: currentTenant.primary_color || "#D4AF37",
          theme: currentTenant.theme || "dark",
        });

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle save
  const handleSave = async () => {
    setSaving(true);
    
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from("tenants")
        .update({
          name: formData.name,
          description: formData.description,
          tagline: formData.tagline,
          logo_url: formData.logo_url,
          cover_url: formData.cover_url,
          working_hours: formData.working_hours,
          phone: formData.phone,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postal_code: formData.postal_code,
          website: formData.website,
          instagram: formData.instagram,
          facebook: formData.facebook,
          twitter: formData.twitter,
          telegram: formData.telegram,
          email_notifications: formData.email_notifications,
          sms_notifications: formData.sms_notifications,
          booking_reminders: formData.booking_reminders,
          primary_color: formData.primary_color,
          theme: formData.theme,
        })
        .eq("id", tenant.id);

      if (error) throw error;

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
    } catch (error) {
      console.error("Error:", error);
      alert("خطا در ذخیره تنظیمات!");
    } finally {
      setSaving(false);
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white flex items-center gap-2">
                <Settings className="w-6 h-6 text-brand-gold" strokeWidth={2.5} />
                تنظیمات
              </h1>
              <p className="text-xs text-brand-gray mt-0.5">پیکربندی سالن {tenant.name}</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all ${
                saved
                  ? "bg-luxury-emerald-400/20 border-2 border-luxury-emerald-400 text-luxury-emerald-400"
                  : "bg-gradient-to-r from-brand-gold to-luxury-amber-500 text-black shadow-brand-gold/30"
              }`}
            >
              {saving ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                  />
                  در حال ذخیره...
                </>
              ) : saved ? (
                <>
                  <Check className="w-5 h-5" strokeWidth={2.5} />
                  ذخیره شد!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" strokeWidth={2.5} />
                  ذخیره تغییرات
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex">
        {/* Sidebar Tabs */}
        <div className="w-64 border-l border-white/10 p-6 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? "bg-brand-gold/10 border border-brand-gold/30 text-brand-gold"
                    : "bg-white/[0.02] border border-white/10 text-brand-gray hover:text-white hover:border-white/20"
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={2.5} />
                <span className="font-bold text-sm">{tab.label}</span>
              </motion.button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <AnimatePresence mode="wait">
            {/* General Tab */}
            {activeTab === "general" && (
              <motion.div
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-black text-white mb-2">اطلاعات عمومی</h2>
                  <p className="text-sm text-brand-gray">اطلاعات اصلی سالن خود را مدیریت کنید</p>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-6">
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">نام سالن *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                      placeholder="نام سالن زیبایی..."
                    />
                  </div>

                  {/* Tagline */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">شعار</label>
                    <input
                      type="text"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                      placeholder="شعار سالن شما..."
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">توضیحات</label>
                    <textarea
                      rows={4}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all resize-none"
                      placeholder="درباره سالن خود بنویسید..."
                    />
                  </div>

                  {/* Logo & Cover */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">لوگو URL</label>
                      <input
                        type="url"
                        value={formData.logo_url}
                        onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">کاور URL</label>
                      <input
                        type="url"
                        value={formData.cover_url}
                        onChange={(e) => setFormData({ ...formData, cover_url: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Hours Tab */}
            {activeTab === "hours" && (
              <motion.div
                key="hours"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-black text-white mb-2">ساعات کاری</h2>
                  <p className="text-sm text-brand-gray">ساعت باز و بسته شدن سالن را تنظیم کنید</p>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4">
                  {weekDays.map((day) => (
                    <div key={day.id} className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/10">
                      <div className="w-24 flex-shrink-0">
                        <p className="text-sm font-bold text-white">{day.label}</p>
                      </div>

                      <div className="flex-1 flex items-center gap-4">
                        <input
                          type="time"
                          value={formData.working_hours[day.id as keyof typeof formData.working_hours].open}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              working_hours: {
                                ...formData.working_hours,
                                [day.id]: {
                                  ...formData.working_hours[day.id as keyof typeof formData.working_hours],
                                  open: e.target.value,
                                },
                              },
                            })
                          }
                          disabled={formData.working_hours[day.id as keyof typeof formData.working_hours].closed}
                          className="flex-1 bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-all disabled:opacity-30"
                        />
                        <span className="text-brand-gray">تا</span>
                        <input
                          type="time"
                          value={formData.working_hours[day.id as keyof typeof formData.working_hours].close}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              working_hours: {
                                ...formData.working_hours,
                                [day.id]: {
                                  ...formData.working_hours[day.id as keyof typeof formData.working_hours],
                                  close: e.target.value,
                                },
                              },
                            })
                          }
                          disabled={formData.working_hours[day.id as keyof typeof formData.working_hours].closed}
                          className="flex-1 bg-white/[0.02] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-brand-gold/50 transition-all disabled:opacity-30"
                        />
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.working_hours[day.id as keyof typeof formData.working_hours].closed}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              working_hours: {
                                ...formData.working_hours,
                                [day.id]: {
                                  ...formData.working_hours[day.id as keyof typeof formData.working_hours],
                                  closed: e.target.checked,
                                },
                              },
                            })
                          }
                          className="w-5 h-5 rounded accent-brand-gold cursor-pointer"
                        />
                        <span className="text-sm text-brand-gray">تعطیل</span>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Contact Tab */}
            {activeTab === "contact" && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-black text-white mb-2">اطلاعات تماس</h2>
                  <p className="text-sm text-brand-gray">راه‌های ارتباطی سالن را مدیریت کنید</p>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-6">
                  {/* Phone & Email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Phone className="w-4 h-4" strokeWidth={2.5} />
                        شماره تماس
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="021-12345678"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <Mail className="w-4 h-4" strokeWidth={2.5} />
                        ایمیل
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="info@salon.com"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <MapPin className="w-4 h-4" strokeWidth={2.5} />
                      آدرس
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                      placeholder="آدرس کامل سالن..."
                    />
                  </div>

                  {/* City & Postal Code */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">شهر</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="تهران"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-white mb-2">کد پستی</label>
                      <input
                        type="text"
                        value={formData.postal_code}
                        onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                        className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="1234567890"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Social Tab */}
            {activeTab === "social" && (
              <motion.div
                key="social"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-black text-white mb-2">شبکه‌های اجتماعی</h2>
                  <p className="text-sm text-brand-gray">لینک صفحات اجتماعی سالن را اضافه کنید</p>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-6">
                  {/* Website */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-luxury-sky-400" strokeWidth={2.5} />
                      وبسایت
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                      placeholder="https://www.yoursalon.com"
                    />
                  </div>

                  {/* Instagram */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Instagram className="w-4 h-4 text-luxury-rose-400" strokeWidth={2.5} />
                      اینستاگرام
                    </label>
                    <input
                      type="text"
                      value={formData.instagram}
                      onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                      placeholder="@yoursalon"
                    />
                  </div>

                  {/* Facebook */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Facebook className="w-4 h-4 text-luxury-sky-400" strokeWidth={2.5} />
                      فیسبوک
                    </label>
                    <input
                      type="text"
                      value={formData.facebook}
                      onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                      placeholder="facebook.com/yoursalon"
                    />
                  </div>

                  {/* Twitter */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <Twitter className="w-4 h-4 text-luxury-sky-400" strokeWidth={2.5} />
                      توییتر / X
                    </label>
                    <input
                      type="text"
                      value={formData.twitter}
                      onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                      placeholder="@yoursalon"
                    />
                  </div>

                  {/* Telegram */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2 flex items-center gap-2">
                      <svg className="w-4 h-4 text-luxury-sky-400" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.693-1.653-1.124-2.678-1.8-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.479.329-.913.489-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                      </svg>
                      تلگرام
                    </label>
                    <input
                      type="text"
                      value={formData.telegram}
                      onChange={(e) => setFormData({ ...formData, telegram: e.target.value })}
                      className="w-full bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                      placeholder="@yoursalon"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-black text-white mb-2">تنظیمات اعلان‌ها</h2>
                  <p className="text-sm text-brand-gray">نحوه دریافت اعلان‌ها را تنظیم کنید</p>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-luxury-sky-400/10 border border-luxury-sky-400/30 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-luxury-sky-400" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">اعلان‌های ایمیل</p>
                        <p className="text-xs text-brand-gray">دریافت اعلان از طریق ایمیل</p>
                      </div>
                    </div>
                    <label className="relative inline-block w-12 h-6 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.email_notifications}
                        onChange={(e) => setFormData({ ...formData, email_notifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:bg-brand-gold transition-all"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                    </label>
                  </div>

                  {/* SMS Notifications */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-luxury-emerald-400/10 border border-luxury-emerald-400/30 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-luxury-emerald-400" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">اعلان‌های پیامکی</p>
                        <p className="text-xs text-brand-gray">دریافت اعلان از طریق SMS</p>
                      </div>
                    </div>
                    <label className="relative inline-block w-12 h-6 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.sms_notifications}
                        onChange={(e) => setFormData({ ...formData, sms_notifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:bg-brand-gold transition-all"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                    </label>
                  </div>

                  {/* Booking Reminders */}
                  <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-luxury-amber-400/10 border border-luxury-amber-400/30 flex items-center justify-center">
                        <Bell className="w-5 h-5 text-luxury-amber-400" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">یادآوری رزروها</p>
                        <p className="text-xs text-brand-gray">ارسال یادآوری به مشتریان</p>
                      </div>
                    </div>
                    <label className="relative inline-block w-12 h-6 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.booking_reminders}
                        onChange={(e) => setFormData({ ...formData, booking_reminders: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-white/10 rounded-full peer peer-checked:bg-brand-gold transition-all"></div>
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all peer-checked:translate-x-6"></div>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Appearance Tab */}
            {activeTab === "appearance" && (
              <motion.div
                key="appearance"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-black text-white mb-2">ظاهر و تم</h2>
                  <p className="text-sm text-brand-gray">تنظیمات نمایشی سیستم را شخصی‌سازی کنید</p>
                </div>

                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-6">
                  {/* Primary Color */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">رنگ اصلی</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="color"
                        value={formData.primary_color}
                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                        className="w-20 h-12 rounded-xl cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.primary_color}
                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                        className="flex-1 bg-white/[0.02] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-brand-gray focus:outline-none focus:border-brand-gold/50 transition-all"
                        placeholder="#D4AF37"
                      />
                    </div>
                  </div>

                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-bold text-white mb-2">تم رنگی</label>
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, theme: "dark" })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.theme === "dark"
                            ? "border-brand-gold bg-brand-gold/10"
                            : "border-white/10 bg-white/[0.02]"
                        }`}
                      >
                        <div className="w-full h-20 rounded-lg bg-gradient-to-br from-[#0a0a0a] to-[#1a1a1a] mb-3"></div>
                        <p className="text-sm font-bold text-white">تاریک</p>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setFormData({ ...formData, theme: "light" })}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          formData.theme === "light"
                            ? "border-brand-gold bg-brand-gold/10"
                            : "border-white/10 bg-white/[0.02]"
                        }`}
                      >
                        <div className="w-full h-20 rounded-lg bg-gradient-to-br from-white to-gray-100 mb-3"></div>
                        <p className="text-sm font-bold text-white">روشن</p>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
