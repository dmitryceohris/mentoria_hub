export type Theme = "light" | "dark";

const STORAGE_KEY = "mentoria.theme";

/** Read the saved theme, falling back to the OS preference, then light. */
export function getInitialTheme(): Theme {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null;
    if (saved === "light" || saved === "dark") return saved;
  } catch {
    // ignore
  }
  if (typeof window !== "undefined" && window.matchMedia?.("(prefers-color-scheme: dark)").matches) {
    return "dark";
  }
  return "light";
}

/** Apply a theme to <html> and persist it. */
export function applyTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // ignore
  }
}

/** Set the theme before React renders, to avoid a flash of the wrong theme. */
export function initTheme(): void {
  applyTheme(getInitialTheme());
}
