"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  CheckSquare,
  History,
  BookOpen,
  User,
  Headphones,
} from "lucide-react";
import { usePathname } from "next/navigation";

type SidebarProps = {
  active?: "dashboard" | "applications" | "review" | "audit" | "ai" | "profile";
  isOpen?: boolean;
  onClose?: () => void;
};

const menuItems = [
  { name: "डैशबोर्ड", href: "/dashboard", icon: LayoutDashboard, key: "dashboard" },
  { name: "आवेदन सूची", href: "/applications", icon: FileText, key: "applications" },
  { name: "समीक्षा हेतु", href: "/applications/BR-IC-1007", icon: CheckSquare, key: "review" },
  { name: "निर्णय इतिहास", href: "/applications/BR-IC-1007/audit", icon: History, key: "audit" },
  { name: "नियम एवं दिशानिर्देश", href: "/applications/BR-IC-1007/ai-review", icon: BookOpen, key: "ai" },
  { name: "प्रोफ़ाइल", href: "/profile", icon: User, key: "profile" },
];

export function Sidebar({ active = "dashboard", isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        w-64 bg-[#0f3057] text-slate-200 border-r border-blue-900/80 flex flex-col justify-between shrink-0
        ${isOpen !== undefined ? (isOpen ? "flex fixed inset-y-0 left-0 z-50 shadow-2xl" : "hidden lg:flex") : "flex h-full"}
      `}
    >
      <nav className="p-3 space-y-1.5 mt-3 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
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
              onClick={onClose}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                ${isActive
                  ? "bg-blue-600 text-white shadow-md font-semibold"
                  : "text-blue-100 hover:bg-blue-900/60 hover:text-white"
                }
              `}
            >
              <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-blue-300"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3.5 m-3 bg-blue-900/40 rounded-xl border border-blue-800/60 text-center text-xs">
        <div className="flex items-center justify-center gap-1.5 text-blue-300 font-semibold">
          <Headphones className="w-3.5 h-3.5" /> सहायता एवं समर्थन
        </div>
        <div className="text-sm font-bold text-white mt-1">1800-123-4567</div>
        <div className="text-[10px] text-blue-400 mt-0.5">सोम - शुक्र (9:00 AM - 6:00 PM)</div>
      </div>
    </aside>
  );
}
