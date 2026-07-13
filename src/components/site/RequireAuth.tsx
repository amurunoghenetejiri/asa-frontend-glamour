import { useNavigate } from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { useAuth, type AppRole } from "@/hooks/use-auth";

export function RequireAuth({ children, roles }: { children: ReactNode; roles?: AppRole[] }) {
  const { user, roles: userRoles, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/login", replace: true });
      return;
    }
    if (roles && roles.length > 0 && !roles.some((r) => userRoles.includes(r))) {
      navigate({ to: "/access-denied", replace: true });
    }
  }, [user, userRoles, loading, roles, navigate]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }
  if (roles && roles.length > 0 && !roles.some((r) => userRoles.includes(r))) return null;
  return <>{children}</>;
}
