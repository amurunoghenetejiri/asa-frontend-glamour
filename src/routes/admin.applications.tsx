import { createFileRoute } from "@tanstack/react-router";
import { ApplicationsManagement } from "@/components/admin/ApplicationsManagement";

export const Route = createFileRoute("/admin/applications")({
  component: ApplicationsManagement,
});
