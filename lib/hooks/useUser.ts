"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import type { User } from "@/lib/supabase/types";

interface UseUserReturn {
  authUser: SupabaseUser | null;
  profile: User | null;
  loading: boolean;
  isLoggedIn: boolean;
}

export function useUser(): UseUserReturn {
  const [authUser, setAuthUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthUser(user);

      if (user) {
        const { data } = await supabase
          .from("users")
          .select("*")
          .eq("auth_id", user.id)
          .single();
        setProfile(data);
      }

      setLoading(false);
    }

    fetchUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setAuthUser(session?.user ?? null);
        if (session?.user) {
          const { data } = await supabase
            .from("users")
            .select("*")
            .eq("auth_id", session.user.id)
            .single();
          setProfile(data);
        } else {
          setProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return {
    authUser,
    profile,
    loading,
    isLoggedIn: !!authUser,
  };
}
