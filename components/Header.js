"use client";
import { Layers } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  return (
    <header className="bg-white dark:bg-[#1D2125]">
      {/* top nav */}
      <div className="flex h-14 items-center gap-2 border-b border-board-border px-3 dark:border-[#2C333A] sm:px-4">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-board-blue text-white">
          <Layers size={18} />
        </span>

        <div className="ml-auto flex items-center gap-1">
          <ThemeToggle />
          <div className="ml-1 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-sm font-semibold text-white">
            S
          </div>
        </div>
      </div>

      {/* project row */}
      <div className="border-b border-board-border bg-white px-4 py-3 dark:border-[#2C333A] dark:bg-[#1D2125] sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-board-blue text-sm font-bold text-white shadow-card">
            TB
          </span>
          <div className="min-w-0">
            <p className="text-xs text-board-subtle dark:text-[#9FADBC]">Workspace / Board</p>
            <h1 className="mt-0.5 truncate text-xl font-semibold text-board-navy dark:text-[#DEE4EA] sm:text-2xl">
              Task Board
            </h1>
          </div>
        </div>
      </div>
    </header>
  );
}
