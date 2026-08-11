import { createFileRoute } from "@tanstack/react-router";
import { MessageSquare } from "lucide-react";

export const Route = createFileRoute("/provider/messages")({
  component: ProviderMessagesPage,
});

function ProviderMessagesPage() {
  return (
    <div className="flex h-[calc(100vh-11rem)] flex-col items-center justify-center overflow-hidden rounded-3xl border border-dashed border-border bg-card px-6 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
        <MessageSquare className="h-7 w-7" />
      </div>
      <h2 className="mt-5 font-display text-xl font-semibold">No client messages yet</h2>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Messages from customers will appear here once they reach out to you.
      </p>
    </div>
  );
}
