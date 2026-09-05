import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * A native select. The Radix select is lovely but this form is submitted with
 * a plain server action, and a native control is smaller, accessible by
 * default, and better on mobile.
 */
function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-background px-3 text-sm",
        "disabled:cursor-not-allowed disabled:opacity-50 aria-[invalid=true]:border-destructive",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}

export { Select };
