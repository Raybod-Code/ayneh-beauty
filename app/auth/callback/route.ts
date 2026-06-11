import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      // سینک کردن user در جدول users ما
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("auth_id", data.user.id)
        .single();

      if (!existingUser) {
        // اولین بار لاگین — کاربر جدید میسازیم
        await supabase.from("users").insert({
          auth_id: data.user.id,
          email: data.user.email,
          full_name: data.user.user_metadata?.full_name ?? null,
          avatar_url: data.user.user_metadata?.avatar_url ?? null,
          role: "customer",
        });
      }

      // داشبورد با رول مختلف redirect میشه
      const destination =
        redirectTo.startsWith("/") ? `${origin}${redirectTo}` : origin + "/dashboard";

      return NextResponse.redirect(destination);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
