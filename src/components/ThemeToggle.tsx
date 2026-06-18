import { useState } from "react";
import { Moon, Sun } from "@phosphor-icons/react";
import { applyTheme, getInitialTheme } from "../lib/theme";
import type { Theme } from "../lib/theme";
import { useT } from "../lib/i18n";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const t = useT();

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    applyTheme(next);
  }

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`}
      onClick={toggle}
      aria-label={theme === "dark" ? t.theme.light : t.theme.dark}
      title={theme === "dark" ? t.theme.lightTitle : t.theme.darkTitle}
    >
      {theme === "dark" ? <Sun size={18} weight="bold" /> : <Moon size={18} weight="bold" />}
    </button>
  );
}
