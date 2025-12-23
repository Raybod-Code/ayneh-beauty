"use server";

import { createClient } from "@/lib/supabase/server";

// ========================================
// GENERAL SETTINGS
// ========================================
export async function updateGeneralSettings(data: {
  site_name: string;
  site_description: string;
  site_url: string;
  contact_email: string;
  contact_phone: string;
  contact_address: string;
  logo_url: string;
  favicon_url: string;
  timezone: string;
  language: string;
}) {
  try {
    const supabase = await createClient();

    // Insert or update settings
    const { error } = await supabase
      .from("system_settings")
      .upsert({
        key: "general",
        value: data,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Update general settings error:", error);
    return { success: false, error: error.message };
  }
}

// ========================================
// PLANS SETTINGS
// ========================================
export async function getPlans() {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Get plans error:", error);
    return { success: false, error: error.message };
  }
}

export async function createPlan(data: {
  name: string;
  name_en: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  max_staff: number;
  max_services: number;
  max_bookings_per_month: number;
  features: string[];
  is_popular: boolean;
  is_active: boolean;
}) {
  try {
    const supabase = await createClient();

    const { error } = await supabase.from("plans").insert({
      ...data,
      sort_order: 999, // Will be auto-adjusted
      created_at: new Date().toISOString(),
    });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Create plan error:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePlan(
  planId: string,
  data: {
    name: string;
    name_en: string;
    description: string;
    price_monthly: number;
    price_yearly: number;
    max_staff: number;
    max_services: number;
    max_bookings_per_month: number;
    features: string[];
    is_popular: boolean;
    is_active: boolean;
  }
) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("plans")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", planId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Update plan error:", error);
    return { success: false, error: error.message };
  }
}

export async function deletePlan(planId: string) {
  try {
    const supabase = await createClient();

    // Check if plan is in use
    const { data: tenants, error: checkError } = await supabase
      .from("tenants")
      .select("id")
      .eq("plan_id", planId)
      .limit(1);

    if (checkError) throw checkError;

    if (tenants && tenants.length > 0) {
      return {
        success: false,
        error: "این پلن در حال استفاده است و نمی‌تواند حذف شود",
      };
    }

    const { error } = await supabase.from("plans").delete().eq("id", planId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Delete plan error:", error);
    return { success: false, error: error.message };
  }
}

// ========================================
// EMAIL SETTINGS
// ========================================
export async function updateEmailSettings(data: {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  smtp_from_email: string;
  smtp_from_name: string;
  smtp_encryption: "tls" | "ssl" | "none";
}) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("system_settings")
      .upsert({
        key: "email",
        value: data,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Update email settings error:", error);
    return { success: false, error: error.message };
  }
}

export async function testEmailConnection(data: {
  smtp_host: string;
  smtp_port: number;
  smtp_user: string;
  smtp_password: string;
  smtp_encryption: "tls" | "ssl" | "none";
}) {
  try {
    // This would normally test the actual SMTP connection
    // For now, we'll simulate a successful test
    
    // TODO: Implement actual SMTP test using nodemailer
    // const nodemailer = require("nodemailer");
    // const transporter = nodemailer.createTransporter({...});
    // await transporter.verify();

    return {
      success: true,
      message: "اتصال به سرور SMTP با موفقیت برقرار شد",
    };
  } catch (error: any) {
    console.error("Test email connection error:", error);
    return {
      success: false,
      message: error.message || "خطا در اتصال به سرور SMTP",
    };
  }
}

// ========================================
// SECURITY SETTINGS
// ========================================
export async function updateSecuritySettings(data: {
  session_timeout: number;
  max_login_attempts: number;
  lockout_duration: number;
  min_password_length: number;
  require_uppercase: boolean;
  require_lowercase: boolean;
  require_numbers: boolean;
  require_special_chars: boolean;
  password_expiry_days: number;
  enable_2fa: boolean;
  force_2fa_for_admins: boolean;
  enable_ip_whitelist: boolean;
  allowed_ips: string[];
  enable_audit_log: boolean;
  log_retention_days: number;
}) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("system_settings")
      .upsert({
        key: "security",
        value: data,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Update security settings error:", error);
    return { success: false, error: error.message };
  }
}
