import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? searchParams.get("redirectTo") ?? null;

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // سینک کردن user در جدول users
      let appUser = await supabase
        .from("users")
        .select("id, role")
        .eq("auth_id", data.user.id)
        .single();

      if (!appUser.data) {
        // اولین بار لاگین — کاربر جدید میسازیم
        await supabase.from("users").insert({
          auth_id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name ?? null,
          avatar_url: data.user.user_metadata?.avatar_url ?? null,
          role: "customer",
        });
        // re-fetch
        appUser = await supabase
          .from("users")
          .select("id, role")
          .eq("auth_id", data.user.id)
          .single();
      }

      const role = appUser.data?.role ?? "customer";

      // اگر redirectTo صریحاً داده شده
      if (next && next.startsWith("/")) {
        return NextResponse.redirect(`${origin}${next}`);
      }

      // بر اساس رل redirect کن
      if (role === "superadmin" || role === "owner") {
        return NextResponse.redirect(`${origin}/admin`);
      }

      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
