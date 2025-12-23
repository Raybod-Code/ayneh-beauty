"use server";

import { createClient } from "@/lib/supabase/server";

export async function getNotifications() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return { success: true, data };
  } catch (error: any) {
    console.error("Get notifications error:", error);
    return { success: false, error: error.message };
  }
}

export async function markAsRead(notificationId: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq("id", notificationId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Mark as read error:", error);
    return { success: false, error: error.message };
  }
}

export async function markAllAsRead() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return { success: false, error: "Not authenticated" };
    }

    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
        read_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Mark all as read error:", error);
    return { success: false, error: error.message };
  }
}

export async function deleteNotification(notificationId: string) {
  try {
    const supabase = await createClient();

    const { error } = await supabase
      .from("notifications")
      .delete()
      .eq("id", notificationId);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    console.error("Delete notification error:", error);
    return { success: false, error: error.message };
  }
}
