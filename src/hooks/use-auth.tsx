import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "customer" | "provider" | "admin" | "super_admin" | "support_agent";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  status: "active" | "suspended";
};

type Ctx = {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: AppRole[];
  activeMode: AppRole;
  loading: boolean;
  setActiveMode: (r: AppRole) => void;
  refresh: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<Ctx | null>(null);

const MODE_KEY = "asa_active_mode";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [activeMode, setActiveModeState] = useState<AppRole>("customer");
  const [loading, setLoading] = useState(true);

  const loadUserData = useCallback(async (u: User | null) => {
    if (!u) {
      setProfile(null);
      setRoles([]);
      return;
    }
    const [{ data: p }, { data: r }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", u.id).maybeSingle(),
      supabase.from("user_roles").select("role").eq("user_id", u.id),
    ]);
    setProfile((p as Profile) ?? null);
    const rs = (r ?? []).map((x: { role: AppRole }) => x.role);
    setRoles(rs);
    // Choose active mode: saved preference if still valid, else highest priority role
    const saved = typeof window !== "undefined" ? (localStorage.getItem(MODE_KEY) as AppRole | null) : null;
    const priority: AppRole[] = ["super_admin", "admin", "support_agent", "provider", "customer"];
    const initial = saved && rs.includes(saved) ? saved : priority.find((x) => rs.includes(x)) ?? "customer";
    setActiveModeState(initial);
  }, []);

  useEffect(() => {
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      loadUserData(data.session?.user ?? null).finally(() => setLoading(false));
    });
    const { data: sub } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        loadUserData(s?.user ?? null);
      }
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [loadUserData]);

  const setActiveMode = useCallback((r: AppRole) => {
    setActiveModeState(r);
    if (typeof window !== "undefined") localStorage.setItem(MODE_KEY, r);
  }, []);

  const refresh = useCallback(async () => {
    await loadUserData(user);
  }, [user, loadUserData]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    if (typeof window !== "undefined") localStorage.removeItem(MODE_KEY);
    setActiveModeState("customer");
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, profile, roles, activeMode, loading, setActiveMode, refresh, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
