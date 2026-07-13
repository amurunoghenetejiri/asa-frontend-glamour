import { createFileRoute } from "@tanstack/react-router";
import { Route as AppsRoute } from "./admin.applications";

export const Route = createFileRoute("/super-admin/applications")({
  component: AppsRoute.options.component!,
});
