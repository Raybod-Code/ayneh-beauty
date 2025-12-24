// app/superadmin/(protected)/platform-signups/page.tsx
"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import NoiseTexture from "@/components/ui/NoiseTexture";
import { 
  Building2, 
  Mail, 
  Phone, 
  MapPin, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock,
  Trash2,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

interface Signup {
  id: string;
  salon_name: string;
  slug: string;
  owner_name: string;
  email: string;
  phone: string;
  city: string;
  staff_count: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  notes?: string;
}

export default function PlatformSignupsPage() {
  const [signups, setSignups] = useState<Signup[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchSignups();
  }, [filter]);

  const fetchSignups = async () => {
    setLoading(true);
    const supabase = createClient();
    
    let query = supabase
      .from('platform_signups')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching signups:', error);
    } else {
      setSignups(data || []);
    }
    
    setLoading(false);
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    if (status === 'approved') {
      if (!confirm('آیا از تایید این درخواست و ساخت سالن مطمئن هستید؟')) {
        return;
      }

      setActionLoading(true);

      try {
        const response = await fetch('/api/platform/approve', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ signupId: id }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(
            `✅ سالن با موفقیت ساخته شد!\n\n` +
            `نام سالن: ${data.tenant.name}\n` +
            `آدرس: ${data.tenant.slug}.ayneh.beauty\n\n` +
            `اطلاعات ورود:\n` +
            `ایمیل: ${data.credentials.email}\n` +
            `رمز موقت: ${data.credentials.tempPassword}\n\n` +
            `(این اطلاعات به ایمیل کاربر هم ارسال شد)`
          );
          fetchSignups();
        } else {
          alert('❌ خطا: ' + data.error);
        }
      } catch (error: any) {
        alert('❌ خطا: ' + error.message);
      } finally {
        setActionLoading(false);
      }

    } else {
      if (!confirm('آیا از رد این درخواست مطمئن هستید؟')) {
        return;
      }

      setActionLoading(true);

      try {
        const supabase = createClient();
        
        const { error } = await supabase
          .from('platform_signups')
          .update({ 
            status: 'rejected', 
            updated_at: new Date().toISOString() 
          })
          .eq('id', id);

        if (!error) {
          alert('✅ درخواست رد شد');
          fetchSignups();
        } else {
          alert('❌ خطا: ' + error.message);
        }
      } catch (error: any) {
        alert('❌ خطا: ' + error.message);
      } finally {
        setActionLoading(false);
      }
    }
  };

  const deleteSignup = async (id: string, salonName: string) => {
    if (!confirm(
      `⚠️ هشدار!\n\n` +
      `آیا از حذف کامل "${salonName}" مطمئن هستید؟\n\n` +
      `این عملیات برگشت‌ناپذیر است و موارد زیر حذف خواهند شد:\n` +
      `- درخواست ثبت نام\n` +
      `- سالن (Tenant)\n` +
      `- حساب کاربری\n` +
      `- تمام داده‌های مرتبط\n\n` +
      `برای ادامه "تایید" کنید.`
    )) {
      return;
    }

    const confirmText = prompt('لطفاً "حذف" را تایپ کنید:');
    
    if (confirmText !== 'حذف') {
      alert('عملیات لغو شد');
      return;
    }

    setActionLoading(true);

    try {
      const response = await fetch('/api/platform/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signupId: id }),
      });

      const data = await response.json();

      if (response.ok) {
        let message = '✅ حذف با موفقیت انجام شد:\n\n';
        
        if (data.deletedItems.user) message += '✓ کاربر حذف شد\n';
        if (data.deletedItems.tenant) message += '✓ سالن حذف شد\n';
        if (data.deletedItems.signup) message += '✓ درخواست حذف شد\n';
        
        alert(message);
        fetchSignups();
      } else {
        alert('❌ خطا: ' + data.error);
      }
    } catch (error: any) {
      alert('❌ خطا: ' + error.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      pending: { color: 'bg-luxury-amber-500/20 text-luxury-amber-400 border-luxury-amber-500/30', icon: Clock, label: 'در انتظار' },
      approved: { color: 'bg-luxury-emerald-500/20 text-luxury-emerald-400 border-luxury-emerald-500/30', icon: CheckCircle2, label: 'تایید شده' },
      rejected: { color: 'bg-luxury-rose-500/20 text-luxury-rose-400 border-luxury-rose-500/30', icon: XCircle, label: 'رد شده' },
    };
    const badge = badges[status as keyof typeof badges];
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${badge.color}`}>
        <Icon className="w-3.5 h-3.5" />
        {badge.label}
      </span>
    );
  };

  // Stats
  const stats = {
    total: signups.length,
    pending: signups.filter(s => s.status === 'pending').length,
    approved: signups.filter(s => s.status === 'approved').length,
    rejected: signups.filter(s => s.status === 'rejected').length,
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#050505] to-[#0a0a0a] p-4 sm:p-6 lg:p-8">
      <NoiseTexture />

      <div className="relative max-w-7xl mx-auto">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-gold to-luxury-gold-light flex items-center justify-center shadow-xl shadow-brand-gold/20">
              <Sparkles className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-white">
                درخواست‌های ثبت نام
              </h1>
              <p className="text-sm text-gray-400">مدیریت درخواست‌های ثبت نام سالن‌ها در پلتفرم</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: 'همه', value: stats.total, icon: Building2, color: 'from-brand-gold to-luxury-gold-light', key: 'all' },
            { label: 'در انتظار', value: stats.pending, icon: Clock, color: 'from-luxury-amber-500 to-luxury-amber-600', key: 'pending' },
            { label: 'تایید شده', value: stats.approved, icon: CheckCircle2, color: 'from-luxury-emerald-500 to-luxury-emerald-600', key: 'approved' },
            { label: 'رد شده', value: stats.rejected, icon: XCircle, color: 'from-luxury-rose-500 to-luxury-rose-600', key: 'rejected' },
          ].map((stat, i) => (
            <motion.button
              key={stat.key}
              onClick={() => setFilter(stat.key as any)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-4 rounded-2xl transition-all overflow-hidden ${
                filter === stat.key 
                  ? 'bg-white/10 border-2 border-white/20' 
                  : 'bg-white/[0.03] border border-white/10 hover:bg-white/[0.06]'
              }`}
            >
              <NoiseTexture />
              <div className="relative flex items-center gap-3">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Signups List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          {loading ? (
            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center overflow-hidden">
              <NoiseTexture />
              <Loader2 className="w-8 h-8 text-brand-gold animate-spin mx-auto mb-3" />
              <p className="text-gray-400">در حال بارگذاری...</p>
            </div>
          ) : signups.length === 0 ? (
            <div className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-12 text-center overflow-hidden">
              <NoiseTexture />
              <AlertCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">هیچ درخواستی یافت نشد</p>
            </div>
          ) : (
            signups.map((signup, index) => (
              <motion.div
                key={signup.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-3xl p-6 hover:border-white/20 hover:bg-white/[0.06] transition-all overflow-hidden group"
              >
                <NoiseTexture />

                <div className="relative grid lg:grid-cols-12 gap-6 items-center">
                  
                  {/* Info */}
                  <div className="lg:col-span-8 space-y-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-white mb-1">
                          {signup.salon_name}
                        </h3>
                        <p className="text-sm text-gray-400 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4" />
                          {signup.slug}.ayneh.beauty
                        </p>
                      </div>
                      {getStatusBadge(signup.status)}
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-brand-gold" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">صاحب سالن</p>
                          <p className="text-sm text-white font-medium truncate">{signup.owner_name}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Mail className="w-5 h-5 text-brand-gold" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">ایمیل</p>
                          <p className="text-sm text-white font-medium truncate">{signup.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Phone className="w-5 h-5 text-brand-gold" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">تلفن</p>
                          <p className="text-sm text-white font-medium" dir="ltr">{signup.phone}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                          <MapPin className="w-5 h-5 text-brand-gold" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">شهر</p>
                          <p className="text-sm text-white font-medium">{signup.city}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-brand-gold" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">تعداد پرسنل</p>
                          <p className="text-sm text-white font-medium">{signup.staff_count}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-brand-gold" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">تاریخ ثبت</p>
                          <p className="text-sm text-white font-medium">
                            {new Date(signup.created_at).toLocaleDateString('fa-IR')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="lg:col-span-4 flex flex-col gap-3">
                    {signup.status === 'pending' && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateStatus(signup.id, 'approved')}
                          disabled={actionLoading}
                          className="w-full px-6 py-3 bg-gradient-to-r from-luxury-emerald-500 to-luxury-emerald-600 text-white rounded-xl font-semibold hover:shadow-xl hover:shadow-luxury-emerald-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="w-5 h-5" />
                              <span>تایید</span>
                            </>
                          )}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => updateStatus(signup.id, 'rejected')}
                          disabled={actionLoading}
                          className="w-full px-6 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-semibold hover:bg-luxury-rose-500/20 hover:border-luxury-rose-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {actionLoading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <XCircle className="w-5 h-5" />
                              <span>رد</span>
                            </>
                          )}
                        </motion.button>
                      </>
                    )}

                    {/* Delete Button - برای همه */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => deleteSignup(signup.id, signup.salon_name)}
                      disabled={actionLoading}
                      className="w-full px-6 py-3 bg-luxury-rose-500/10 text-luxury-rose-400 border border-luxury-rose-500/30 rounded-xl font-semibold hover:bg-luxury-rose-500/20 hover:border-luxury-rose-500 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="w-5 h-5" />
                          <span>حذف کامل</span>
                        </>
                      )}
                    </motion.button>
                  </div>

                </div>
              </motion.div>
            ))
          )}
        </motion.div>

      </div>
    </div>
  );
}
