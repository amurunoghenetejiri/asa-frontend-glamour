import { createFileRoute, Link } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/dashboard/messages")({
  component: MessagesPage,
});

function MessagesPage() {
  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-border bg-card px-6 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <MessageSquare className="h-7 w-7" />
      </div>
      <h2 className="mt-5 font-display text-xl font-semibold">No messages yet</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        When you start a conversation with a provider, it will show up here.
      </p>
      <Link
        to="/find-professionals"
        className="btn-primary mt-6 px-6 py-2.5 text-sm"
      >
        Find professionals
      </Link>
    </div>
  );
}
