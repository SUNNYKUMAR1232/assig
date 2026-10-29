"use client";

import React from "react";
import { useLanguage } from "@/lib/language/LanguageContext";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center bg-blue-900/80 p-0.5 rounded-xl border border-blue-800 text-xs font-bold shadow-xs shrink-0 ${className}`}
      role="group"
      aria-label="Language selection"
    >
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer select-none ${
          language === "hi"
            ? "bg-amber-400 text-blue-950 font-extrabold shadow-sm"
            : "text-blue-200 hover:text-white hover:bg-blue-800/40"
        }`}
        title="हिंदी भाषा चुनें"
      >
        हिंदी
      </button>
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer select-none ${
          language === "en"
            ? "bg-amber-400 text-blue-950 font-extrabold shadow-sm"
            : "text-blue-200 hover:text-white hover:bg-blue-800/40"
        }`}
        title="Select English Language"
      >
        English
      </button>
    </div>
  );
}

