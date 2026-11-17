import { useCallback, useEffect, useState } from "react";

export type Theme = "dark" | "light";
export const THEME_KEY = "oq-theme";

/** Runs in <head> before paint so the stored theme never flickers. Default: dark. */
export const themeBootScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t!=="light"&&t!=="dark")t="dark";var d=document.documentElement;d.classList.toggle("dark",t==="dark");d.style.colorScheme=t;}catch(e){document.documentElement.classList.add("dark");}})();`;

export function useTheme() {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    setThemeState(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const setTheme = useCallback((t: Theme) => {
    const d = document.documentElement;
    d.classList.toggle("dark", t === "dark");
    d.style.colorScheme = t;
    try {
      localStorage.setItem(THEME_KEY, t);
    } catch {
      /* storage unavailable */
    }
    setThemeState(t);
  }, []);

  return { theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") };
}
