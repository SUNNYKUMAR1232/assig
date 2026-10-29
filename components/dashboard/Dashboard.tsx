"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Database,
} from "lucide-react";
import { PortalShell } from "@/components/layout/PortalShell";
import { useLanguage } from "@/lib/language/LanguageContext";
import { localizeName, localizeStatus } from "@/lib/language/translations";
import type { DashboardApplication, Application } from "@/lib/types";

const defaultStatsConfig = [
  { key: "total_apps" as const, count: 48, icon: Users, bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-900/60", iconBg: "bg-blue-100 dark:bg-blue-900/50" },
  { key: "pending_apps" as const, count: 32, icon: Clock, bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-900/60", iconBg: "bg-amber-100 dark:bg-amber-900/50" },
  { key: "approved_apps" as const, count: 10, icon: CheckCircle2, bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-900/60", iconBg: "bg-emerald-100 dark:bg-emerald-900/50" },
  { key: "rejected_apps" as const, count: 3, icon: XCircle, bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-700 dark:text-rose-300", border: "border-rose-200 dark:border-rose-900/60", iconBg: "bg-rose-100 dark:bg-rose-900/50" },
  { key: "returned_apps" as const, count: 3, icon: RotateCcw, bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-900/60", iconBg: "bg-indigo-100 dark:bg-indigo-900/50" },
];

const fallbackApplications: DashboardApplication[] = [
  { id: 1, appNo: "BR-IC-1007", name: "संदीप कुमार", service: "सामान्य आय प्रमाण पत्र", income: "₹ 2,40,000", status: "जाँच आवश्यक", statusColor: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800", date: "25-10-2026" },
  { id: 2, appNo: "BR-IC-1012", name: "रीना देवी", service: "सामान्य आय प्रमाण पत्र", income: "₹ 1,80,000", status: "लंबित", statusColor: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800", date: "24-10-2026" },
  { id: 3, appNo: "BR-IC-1003", name: "मोहन पासवान", service: "सामान्य आय प्रमाण पत्र", income: "₹ 3,20,000", status: "लंबित", statusColor: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800", date: "23-10-2026" },
  { id: 4, appNo: "BR-IC-1018", name: "अनिता कुमारी", service: "EWS आय एवं संपत्ति प्रमाण पत्र", income: "₹ 90,000", status: "वापस किया गया", statusColor: "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800", date: "22-10-2026" },
  { id: 5, appNo: "BR-IC-1016", name: "विकास सिंह", service: "सामान्य आय प्रमाण पत्र", income: "₹ 4,50,000", status: "लंबित", statusColor: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800", date: "22-10-2026" },
  { id: 6, appNo: "BR-IC-1009", name: "सुनील कुमार", service: "EWS आय एवं संपत्ति प्रमाण पत्र", income: "₹ 6,80,000", status: "लंबित", statusColor: "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800", date: "21-10-2026" },
  { id: 7, appNo: "BR-IC-1014", name: "पूजा कुमारी", service: "सामान्य आय प्रमाण पत्र", income: "₹ 1,20,000", status: "स्वीकृत", statusColor: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800", date: "20-10-2026" },
  { id: 8, appNo: "BR-IC-1005", name: "रवि रंजन", service: "सामान्य आय प्रमाण पत्र", income: "₹ 5,10,000", status: "अस्वीकृत", statusColor: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800", date: "19-10-2026" },
];

export function Dashboard() {
  const { t, language } = useLanguage();
  const [notification, setNotification] = useState("");
  const [stats, setStats] = useState(defaultStatsConfig);
  const [apps, setApps] = useState<DashboardApplication[]>(fallbackApplications);
  const [isLiveDb, setIsLiveDb] = useState(false);

  useEffect(() => {
    // Fetch live dashboard stats from Neon DB
    fetch("/api/dashboard/stats")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.source === "neon_postgresql") {
          setIsLiveDb(true);
          setStats([
            { key: "total_apps", count: data.total || 48, icon: Users, bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200 dark:border-blue-900/60", iconBg: "bg-blue-100 dark:bg-blue-900/50" },
            { key: "pending_apps", count: data.pendingReview || 32, icon: Clock, bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200 dark:border-amber-900/60", iconBg: "bg-amber-100 dark:bg-amber-900/50" },
            { key: "approved_apps", count: data.approvedThisMonth || 10, icon: CheckCircle2, bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200 dark:border-emerald-900/60", iconBg: "bg-emerald-100 dark:bg-emerald-900/50" },
            { key: "rejected_apps", count: data.rejected !== undefined ? data.rejected : 3, icon: XCircle, bg: "bg-rose-50 dark:bg-rose-950/40", text: "text-rose-700 dark:text-rose-300", border: "border-rose-200 dark:border-rose-900/60", iconBg: "bg-rose-100 dark:bg-rose-900/50" },
            { key: "returned_apps", count: data.returned !== undefined ? data.returned : 3, icon: RotateCcw, bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-700 dark:text-indigo-300", border: "border-indigo-200 dark:border-indigo-900/60", iconBg: "bg-indigo-100 dark:bg-indigo-900/50" },
          ]);
        }
      })
      .catch((err) => console.log("DB Stats fetch notice:", err));

    // Fetch live applications from Neon DB
    fetch("/api/applications")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data && data.applications && Array.isArray(data.applications)) {
          const mapped: DashboardApplication[] = data.applications.map((a: Application, idx: number) => {
            let statusColor = "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800";
            let statusLabel = "लंबित";

            if (a.status === "PENDING_REVIEW") {
              statusLabel = a.priority === "तात्कालिक" ? "जाँच आवश्यक" : "लंबित";
              statusColor = a.priority === "तात्कालिक"
                ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                : "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800";
            } else if (a.status === "RETURNED") {
              statusLabel = "वापस किया गया";
              statusColor = "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800";
            } else if (a.status === "APPROVED") {
              statusLabel = "स्वीकृत";
              statusColor = "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
            } else if (a.status === "REJECTED") {
              statusLabel = "अस्वीकृत";
              statusColor = "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";
            }

            return {
              id: a.numericId || idx + 1,
              appNo: a.referenceNumber,
              name: a.name,
              service: a.service || "सामान्य आय प्रमाण पत्र",
              income: `₹ ${Number(a.declaredIncome || 0).toLocaleString("en-IN")}`,
              status: statusLabel,
              statusColor,
              date: a.submittedAt || "25-10-2026",
            };
          });

          setApps(mapped);
          setIsLiveDb(true);
        }
      })
      .catch((err) => console.log("DB Applications fetch notice:", err));
  }, []);

  function getLocalizedStatus(statusText: string): string {
    return localizeStatus(statusText, language);
  }

  function showNotification(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  }

  return (
    <PortalShell active="dashboard">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("dashboard_title")}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t("dashboard_subtitle")}</p>
          </div>

          {isLiveDb && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 self-start sm:self-auto">
              <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {t("neon_connected")}
            </span>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className={`${stat.bg} ${stat.border} border rounded-2xl p-4 shadow-sm flex flex-col justify-between relative transition-colors`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`text-xs font-bold ${stat.text}`}>{t(stat.key)}</span>
                  <div className={`p-1.5 rounded-lg ${stat.iconBg} ${stat.text}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                </div>
                <span className={`text-3xl font-black ${stat.text}`}>{stat.count}</span>
              </div>
            );
          })}
        </div>

        {/* Priority Table */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{t("today_priority_sub")}</h2>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {t("displayed_apps")} ({t("total_count_label")} {apps.length})
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                  <th className="py-3 px-5">{t("th_serial")}</th>
                  <th className="py-3 px-5">{t("th_app_no")}</th>
                  <th className="py-3 px-5">{t("th_applicant")}</th>
                  <th className="py-3 px-5">{t("th_income")}</th>
                  <th className="py-3 px-5">{t("th_status")}</th>
                  <th className="py-3 px-5">{t("th_date")}</th>
                  <th className="py-3 px-5 text-center">{t("th_action")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {apps.slice(0, 5).map((app, idx) => (
                  <tr key={app.id} className="hover:bg-blue-50/30 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-5 text-slate-500 dark:text-slate-400 font-medium">{idx + 1}</td>
                    <td className="py-3 px-5 font-semibold text-slate-900 dark:text-slate-100">{app.appNo}</td>
                    <td className="py-3 px-5 text-slate-700 dark:text-slate-300">{localizeName(app.name, language)}</td>
                    <td className="py-3 px-5 font-medium text-slate-800 dark:text-slate-200">{app.income}</td>
                    <td className="py-3 px-5">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${app.statusColor}`}>
                        {getLocalizedStatus(app.status)}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-slate-500 dark:text-slate-400 text-xs">{app.date}</td>
                    <td className="py-3 px-5 text-center">
                      <a
                        href={`/applications/${app.appNo}`}
                        onClick={(e) => {
                          e.preventDefault();
                          showNotification(`${t("msg_review_opened")} ${app.appNo} - ${localizeName(app.name, language)}`);
                          window.location.href = `/applications/${app.appNo}`;
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm transition-all inline-block cursor-pointer"
                      >
                        {t("btn_review")}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
