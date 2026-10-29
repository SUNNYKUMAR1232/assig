"use client";

import { Landmark, User, LogOut, Menu } from "lucide-react";

export function Navbar({ onToggleSidebar }: { onToggleSidebar?: () => void }) {
  const handleLogout = () => {
    window.location.href = "/login";
  };

  return (
    <header className="bg-blue-950 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-1.5 rounded-lg hover:bg-blue-900 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-blue-950 shadow-inner">
            <Landmark className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="text-base font-bold tracking-tight flex items-center gap-2">
              जनसेवा सहायक
              <span className="text-[10px] bg-blue-800 text-blue-200 px-1.5 py-0.5 rounded font-semibold tracking-wider uppercase border border-blue-700">
                Govt
              </span>
            </div>
            <div className="text-[11px] text-blue-300 font-medium">
              आय प्रमाण पत्र समीक्षा प्रणाली
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-2.5 bg-blue-900/60 px-3 py-1.5 rounded-xl border border-blue-800">
          <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            <User className="w-4 h-4" />
          </div>
          <div className="text-left leading-tight pr-1">
            <div className="text-xs font-bold text-white">राजेश कुमार</div>
            <div className="text-[10px] text-blue-300 font-medium">नामित अधिकारी</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 rounded-xl hover:bg-rose-600/90 hover:text-white text-blue-200 transition-all flex items-center justify-center shadow-sm border border-transparent hover:border-rose-500 cursor-pointer"
          title="लॉगआउट"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
