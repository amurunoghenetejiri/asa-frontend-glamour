import { createFileRoute } from "@tanstack/react-router";
import { Route as UsersRoute } from "./admin.users";

// Super Admin reuses the same rich user management UI (they see the same admin actions plus role management).
export const Route = createFileRoute("/super-admin/users")({
  component: UsersRoute.options.component!,
});
