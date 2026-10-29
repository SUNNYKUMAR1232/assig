"use client";

import { useState, useCallback } from "react";
import {
  Landmark,
  User,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  FileText,
  CheckSquare,
  History,
  BookOpen,
  Headphones,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/lib/language/LanguageContext";
import { LanguageToggle } from "@/components/common/LanguageToggle";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import type { TranslationKey } from "@/lib/language/translations";

type PortalShellProps = {
  children: React.ReactNode;
  active?: "dashboard" | "applications" | "review" | "audit" | "ai" | "profile";
};

interface MenuItemConfig {
  tKey: TranslationKey;
  href: string;
  icon: typeof LayoutDashboard;
  key: string;
}

const menuConfig: MenuItemConfig[] = [
  { tKey: "nav_dashboard", href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { tKey: "nav_applications", href: "/applications", icon: FileText, key: "applications" },
  { tKey: "nav_scrutiny", href: "/applications/BR-IC-1007", icon: CheckSquare, key: "review" },
  { tKey: "nav_decisions", href: "/applications/BR-IC-1007/audit", icon: History, key: "audit" },
  { tKey: "nav_guidelines", href: "/applications/BR-IC-1007/ai-review", icon: BookOpen, key: "ai" },
  { tKey: "nav_profile", href: "/profile", icon: User, key: "profile" },
];

export function PortalShell({ children, active = "dashboard" }: PortalShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { t } = useLanguage();

  const handleLogout = useCallback(() => {
    window.location.href = "/login";
  }, []);

  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden transition-colors duration-200">
      {/* Top Header */}
      <header className="h-14 bg-blue-950 dark:bg-[#071324] text-white px-4 md:px-6 flex items-center justify-between shadow-md shrink-0 z-40 border-b border-transparent dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-blue-900 text-white transition-colors cursor-pointer"
            aria-label="मेनू खोलें"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-95 transition-opacity">
            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-blue-950 shadow-inner shrink-0">
              <Landmark className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight flex items-center gap-2 leading-none">
                {t("app_title")}
                <span className="text-[10px] bg-blue-800 text-blue-200 px-1.5 py-0.5 rounded font-semibold tracking-wider uppercase border border-blue-700">
                  Govt
                </span>
              </div>
              <div className="text-[11px] text-blue-300 font-medium mt-0.5">
                {t("app_subtitle")}
              </div>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* English / Hindi Toggle */}
          <LanguageToggle />

          {/* Light / Dark Mode Toggle */}
          <ThemeToggle />

          <Link
            href="/profile"
            className="hidden sm:flex items-center gap-2.5 bg-blue-900/60 hover:bg-blue-900 px-3 py-1.5 rounded-xl border border-blue-800 transition-colors cursor-pointer"
            title={t("nav_profile")}
          >
            <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left leading-tight pr-1">
              <div className="text-xs font-bold text-white">{t("officer_name")}</div>
              <div className="text-[10px] text-blue-300 font-medium">{t("officer_role")}</div>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-rose-600/90 hover:text-white text-blue-200 transition-all flex items-center justify-center shadow-sm border border-transparent hover:border-rose-500 cursor-pointer"
            title={t("logout")}
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs transition-opacity"
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-[#0f3057] dark:bg-[#0a1a2f] text-slate-200 flex flex-col shadow-2xl
            transform transition-transform duration-300 ease-in-out lg:hidden
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          <div className="h-14 px-4 flex items-center justify-between border-b border-blue-900/80 bg-blue-950 dark:bg-[#071324]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-blue-950">
                <Landmark className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-sm text-white">{t("app_title")}</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-blue-900 text-blue-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
            {menuConfig.map((item) => {
              const Icon = item.icon;
              const isActive =
                active === item.key ||
                (item.key === "review" &&
                  pathname?.includes("/applications/") &&
                  !pathname?.includes("/audit") &&
                  !pathname?.includes("/ai-review") &&
                  active === "review");

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                    ${isActive
                      ? "bg-blue-600 text-white shadow-md font-semibold"
                      : "text-blue-100 hover:bg-blue-900/60 hover:text-white"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-blue-300"}`} />
                  <span>{t(item.tKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3.5 m-3 bg-blue-900/40 dark:bg-slate-900/80 rounded-xl border border-blue-800/60 dark:border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-blue-300 font-semibold">
              <Headphones className="w-3.5 h-3.5" /> {t("support_title")}
            </div>
            <div className="text-sm font-bold text-white mt-1">1800-123-4567</div>
            <div className="text-[10px] text-blue-400 mt-0.5">{t("support_timing")}</div>
          </div>
        </div>

        {/* Desktop Fixed Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0f3057] dark:bg-[#0a1a2f] text-slate-200 border-r border-blue-900/80 dark:border-slate-800 shrink-0 h-full justify-between">
          <nav className="p-3 space-y-1.5 mt-3 flex-1 overflow-y-auto">
            {menuConfig.map((item) => {
              const Icon = item.icon;
              const isActive =
                active === item.key ||
                (item.key === "review" &&
                  pathname?.includes("/applications/") &&
                  !pathname?.includes("/audit") &&
                  !pathname?.includes("/ai-review") &&
                  active === "review");

              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                    ${isActive
                      ? "bg-blue-600 text-white shadow-md font-semibold"
                      : "text-blue-100 hover:bg-blue-900/60 hover:text-white"
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-blue-300"}`} />
                  <span>{t(item.tKey)}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3.5 m-3 bg-blue-900/40 dark:bg-slate-900/80 rounded-xl border border-blue-800/60 dark:border-slate-800 text-center">
            <div className="flex items-center justify-center gap-1.5 text-xs text-blue-300 font-semibold">
              <Headphones className="w-3.5 h-3.5" /> {t("support_title")}
            </div>
            <div className="text-sm font-bold text-white mt-1">1800-123-4567</div>
            <div className="text-[10px] text-blue-400 mt-0.5">{t("support_timing")}</div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
