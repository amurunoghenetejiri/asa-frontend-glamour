import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsManagement } from "@/components/admin/ApplicationsManagement";

export const Route = createFileRoute("/super-admin/applications")({
  component: ApplicationsManagement,
});
