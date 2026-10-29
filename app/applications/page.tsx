"use client";

import { useState, useEffect } from "react";
import { PortalShell } from "@/components/layout/PortalShell";
import { applications as initialApplications } from "@/data/demo-applications";
import { Search, Filter, ArrowRight, Database } from "lucide-react";
import { useLanguage } from "@/lib/language/LanguageContext";
import { localizeName, localizeService } from "@/lib/language/translations";
import type { Application } from "@/lib/types";

const statusColors: Record<string, string> = {
  PENDING_REVIEW: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  RETURNED: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  APPROVED: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  REJECTED: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
};

export default function ApplicationsPage() {
  const { t, language } = useLanguage();
  const [apps, setApps] = useState<Application[]>(initialApplications);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [filterOpen, setFilterOpen] = useState(false);
  const [isLiveDb, setIsLiveDb] = useState(false);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && Array.isArray(data.applications)) {
          setApps(data.applications);
          if (data.source === "neon_postgresql") {
            setIsLiveDb(true);
          }
        }
      })
      .catch((err) => console.log("DB applications fetch notice:", err));
  }, []);

  function getStatusLabel(status: string): string {
    if (status === "PENDING_REVIEW") return t("status_pending");
    if (status === "RETURNED") return t("status_returned");
    if (status === "APPROVED") return t("status_approved");
    if (status === "REJECTED") return t("status_rejected");
    return status;
  }

  const filteredApps = apps.filter((app) => {
    const matchesSearch =
      !searchQuery ||
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.service && app.service.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      selectedStatus === "ALL" || app.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <PortalShell active="applications">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">{t("app_list_title")}</h1>
              {isLiveDb && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  <Database className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> Live DB
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t("total_displayed_count")} {filteredApps.length} ({t("total_count_label")} {apps.length})
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t("search_placeholder")}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 border px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                filterOpen || selectedStatus !== "ALL"
                  ? "bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                  : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span className="hidden sm:inline">
                {filterOpen || selectedStatus !== "ALL" ? t("filter_active") : t("filter_btn")}
              </span>
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        {filterOpen && (
          <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-wrap items-center gap-2 transition-colors">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mr-2">
              {language === "hi" ? "स्थिति अनुसार:" : "By Status:"}
            </span>
            {[
              { id: "ALL", label: language === "hi" ? "सभी" : "All" },
              { id: "PENDING_REVIEW", label: t("status_pending") },
              { id: "RETURNED", label: t("status_returned") },
              { id: "APPROVED", label: t("status_approved") },
              { id: "REJECTED", label: t("status_rejected") },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  selectedStatus === st.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-5">{t("th_serial")}</th>
                  <th className="py-3 px-5">{t("th_app_no")}</th>
                  <th className="py-3 px-5">{t("th_applicant")}</th>
                  <th className="py-3 px-5">{t("th_service")}</th>
                  <th className="py-3 px-5">{t("th_income")}</th>
                  <th className="py-3 px-5">{t("th_status")}</th>
                  <th className="py-3 px-5">{t("th_date")}</th>
                  <th className="py-3 px-5 text-center">{t("th_action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {filteredApps.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-slate-400">
                      {language === "hi" ? "कोई आवेदन नहीं मिला।" : "No applications found."}
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app, idx) => (
                    <tr
                      key={app.id}
                      onClick={() => {
                        window.location.href = `/applications/${app.referenceNumber}`;
                      }}
                      className="hover:bg-blue-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-5 text-slate-400">{idx + 1}</td>
                      <td className="py-3.5 px-5 font-bold text-slate-800 dark:text-slate-100">
                        {app.referenceNumber}
                      </td>
                      <td className="py-3.5 px-5 text-slate-700 dark:text-slate-300">{localizeName(app.name, language)}</td>
                      <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400 text-xs max-w-[150px] truncate">
                        {localizeService(app.service, language)}
                      </td>
                      <td className="py-3.5 px-5 font-medium text-slate-800 dark:text-slate-200">
                        ₹ {app.declaredIncome.toLocaleString("en-IN")}
                      </td>
                      <td className="py-3.5 px-5">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[app.status] || ""}`}
                        >
                          {getStatusLabel(app.status)}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400 text-xs">{app.submittedAt}</td>
                      <td className="py-3.5 px-5 text-center">
                        <a
                          href={`/applications/${app.referenceNumber}`}
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                          className="inline-flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-sm transition-all"
                        >
                          {t("btn_review")} <ArrowRight className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
