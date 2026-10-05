"use client";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("task-board-theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      onClick={toggle}
      title={dark ? "Light mode" : "Dark mode"}
      className="rounded-full p-2 text-board-subtle hover:bg-board-bg dark:text-[#9FADBC] dark:hover:bg-white/10"
    >
      {dark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
