"use client";

import {
  User,
  ShieldCheck,
  Building,
  MapPin,
  Mail,
  Phone,
  CheckCircle2,
  Clock,
  Award,
  KeyRound,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { PortalShell } from "@/components/layout/PortalShell";
import { useLanguage } from "@/lib/language/LanguageContext";

export default function ProfilePage() {
  const { t } = useLanguage();

  return (
    <PortalShell active="profile">
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Profile Header Banner */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
          <div className="h-28 bg-gradient-to-r from-blue-900 via-blue-800 to-[#0f3057]" />
          <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center text-white text-3xl font-bold shrink-0">
                <User className="w-12 h-12" />
              </div>
              <div className="pt-2">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("officer_name")}</h1>
                  <span title="सत्यापित अधिकारी">
                    <BadgeCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </span>
                </div>
                <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">{t("officer_full_role")}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {t("profile_office_desc")}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {t("active_duty_badge")}
              </span>
            </div>
          </div>
        </div>

        {/* Officer Performance Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-xs font-semibold">{t("stat_disposed_title")}</span>
              <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">412</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">{t("stat_disposed_sub")}</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-xs font-semibold">{t("stat_approved_title")}</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">45</div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">{t("stat_approved_sub")}</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-xs font-semibold">{t("stat_avg_time_title")}</span>
              <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("stat_avg_time_val")}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">{t("stat_avg_time_sub")}</div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
              <span className="text-xs font-semibold">{t("stat_compliance_title")}</span>
              <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t("stat_compliance_val")}</div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">{t("stat_compliance_sub")}</div>
          </div>
        </div>

        {/* Detailed Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Official Information */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" /> {t("profile_official_heading")}
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-500 dark:text-slate-400">{t("emp_code_label")}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">BR-REV-2019-8472</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-500 dark:text-slate-400">{t("cadre_label")}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{t("cadre_val")}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-500 dark:text-slate-400">{t("office_label")}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{t("office_val")}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-500 dark:text-slate-400">{t("district_zone_label")}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{t("district_zone_val")}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400">{t("posting_date_label")}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{t("posting_date_val")}</span>
              </div>
            </div>
          </div>

          {/* Contact & Security */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {t("profile_security_heading")}
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {t("email_label")}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">rajesh.kumar@bihar.gov.in</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {t("mobile_label")}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">+91 98351 04829</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {t("dsc_label")}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                  {t("dsc_val")}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-850">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {t("last_login_label")}
                </span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">27-10-2026, 09:42 AM</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {t("network_label")}
                </span>
                <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">10.142.68.22 (NICNET)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Authorized Roles & Permissions */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4 transition-colors">
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
            {t("auth_services_heading")}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900/60">
              <div className="text-xs font-bold text-blue-900 dark:text-blue-300">{t("auth_service_1_title")}</div>
              <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-1">{t("auth_service_1_desc")}</p>
            </div>
            <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900/60">
              <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300">{t("auth_service_2_title")}</div>
              <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">{t("auth_service_2_desc")}</p>
            </div>
            <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/60">
              <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300">{t("auth_service_3_title")}</div>
              <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-1">{t("auth_service_3_desc")}</p>
            </div>
          </div>
        </div>
      </div>
    </PortalShell>
  );
}
