import { createFileRoute } from "@tanstack/react-router";
import { UsersManagement } from "@/components/admin/UsersManagement";

export const Route = createFileRoute("/admin/users")({
  component: UsersManagement,
});
