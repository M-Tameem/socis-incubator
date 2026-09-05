"use client";

import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  function toggleTheme() {
    const root = document.documentElement;
    const dark = root.classList.toggle("dark");
    localStorage.setItem("theme", dark ? "dark" : "light");
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex size-8 items-center justify-center rounded-md border border-border text-muted-foreground hover:border-input hover:bg-secondary hover:text-foreground"
      aria-label="Change color theme"
      title="Change color theme"
    >
      <Moon className="size-4 dark:hidden" aria-hidden="true" />
      <Sun className="hidden size-4 dark:block" aria-hidden="true" />
    </button>
  );
}
