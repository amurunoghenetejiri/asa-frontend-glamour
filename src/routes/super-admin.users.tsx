import { createFileRoute } from "@tanstack/react-router";
import { UsersManagement } from "@/components/admin/UsersManagement";

export const Route = createFileRoute("/super-admin/users")({
  component: UsersManagement,
});
