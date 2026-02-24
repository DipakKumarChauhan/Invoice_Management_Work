import { useState, useEffect } from "react";

export default function useTheme() {
  const [theme, setThemeState] = useState(() => {
    try {
      if (typeof window === "undefined") return "light";

      const savedTheme = window.localStorage.getItem("theme");
      if (savedTheme === "light" || savedTheme === "dark") {
        // Apply theme immediately on initialization
        const html = document.documentElement;
        if (savedTheme === "dark") {
          html.classList.add("dark");
        } else {
          html.classList.remove("dark");
        }
        return savedTheme;
      }

      // Default to light mode if no preference
      const html = document.documentElement;
      html.classList.remove("dark");
      return "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem("theme", theme);
    } catch {
      // ignore
    }

    const html = document.documentElement;
    const body = document.body;

    if (theme === "dark") {
      html.classList.add("dark");
      body.classList.add("dark");
    } else {
      html.classList.remove("dark");
      body.classList.remove("dark");
    }
  }, [theme]);

  const setTheme = (newTheme) => {
    if (newTheme === "light" || newTheme === "dark") {
      // Apply theme immediately before state update
      const html = document.documentElement;
      const body = document.body;
      if (newTheme === "dark") {
        html.classList.add("dark");
        body.classList.add("dark");
      } else {
        html.classList.remove("dark");
        body.classList.remove("dark");
      }
      // Update state
      setThemeState(newTheme);
    }
  };

  return { theme, setTheme };
}
