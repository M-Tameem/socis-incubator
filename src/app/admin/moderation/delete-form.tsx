"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { deleteModerationItem } from "./actions";

export function DeleteForm({ kind, id }: { kind: "post" | "message"; id: string }) {
  const [state, action, pending] = useActionState(deleteModerationItem, {});
  return (
    <form
      action={action}
      className="mt-4 space-y-2"
      onSubmit={(event) => {
        const warning = kind === "post"
          ? "Permanently delete this idea post and all its interest messages? This cannot be undone."
          : "Permanently delete this interest message? This cannot be undone. Email notifications already sent will remain.";
        if (!window.confirm(warning)) event.preventDefault();
      }}
    >
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="id" value={id} />
      <Button type="submit" size="sm" variant="destructive" disabled={pending || state.deleted}>
        {pending ? "Deleting…" : state.deleted ? "Deleted" : `Delete ${kind}`}
      </Button>
      {state.error ? <p role="alert" className="text-sm text-destructive">{state.error}</p> : null}
      {state.deleted ? <p role="status" className="text-sm">Deleted.</p> : null}
    </form>
  );
}
