"use client";

import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/lib/theme/ThemeContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`p-2 rounded-xl bg-blue-900/60 hover:bg-blue-900 border border-blue-800 transition-all cursor-pointer shadow-xs flex items-center justify-center shrink-0 ${className}`}
      title={theme === "dark" ? "Light Mode (लाइट मोड चालू करें)" : "Dark Mode (डार्क मोड चालू करें)"}
      aria-label="Toggle Dark Mode"
    >
      {theme === "dark" ? (
        <Sun className="w-4 h-4 text-amber-400" />
      ) : (
        <Moon className="w-4 h-4 text-blue-200 hover:text-white" />
      )}
    </button>
  );
}

