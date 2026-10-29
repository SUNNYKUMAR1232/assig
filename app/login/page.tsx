"use client";

import { useState } from "react";
import { User, Lock, Landmark } from "lucide-react";
import { useLanguage } from "@/lib/language/LanguageContext";
import { LanguageToggle } from "@/components/common/LanguageToggle";

export default function LoginPage() {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);

  function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      window.location.href = "/dashboard";
    }, 300);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 flex flex-col justify-center items-center p-4 font-sans text-slate-800">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 relative">
        {/* Language Toggle in Login View */}
        <div className="absolute top-4 right-4 z-10">
          <LanguageToggle />
        </div>

        <div className="p-8 pb-6 flex flex-col items-center border-b border-slate-50 bg-slate-50/50">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center border border-blue-100 mb-4 shadow-inner">
            <Landmark className="w-8 h-8 text-blue-900" />
          </div>
          <h1 className="text-xl font-bold text-center text-slate-900 leading-tight">
            {t("gov_bihar")}
          </h1>
          <p className="text-sm font-semibold text-slate-600 mb-4">
            {t("dept_name")}
          </p>
          <h2 className="text-2xl font-black text-blue-700 tracking-tight text-center">
            {t("app_title")}
          </h2>
          <p className="text-sm font-medium text-slate-500 mt-1 text-center">
            {t("app_subtitle")}
          </p>
        </div>

        <div className="p-8 pt-6">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide ml-1">
                {t("username")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  defaultValue="rajesh.kumar"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  required
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wide ml-1">
                {t("password")}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  defaultValue="password123"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-sm"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow transition-all transform active:scale-[0.99] mt-2 disabled:opacity-70 cursor-pointer"
            >
              {isLoading ? t("btn_submitting") : t("login")}
            </button>
          </form>
          <p className="text-xs text-center text-slate-400 mt-6 font-medium">
            {t("demo_hint")}
          </p>
        </div>
      </div>
    </div>
  );
}
