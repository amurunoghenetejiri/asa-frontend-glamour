import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/become-a-provider")({
  component: () => <Outlet />,
});
