"use client";

import { useState, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  FileSearch,
  BrainCircuit,
  CheckSquare,
  CheckCircle2,
  XCircle,
  Check,
  FileWarning,
  AlertTriangle,
  ShieldAlert,
  Info,
  ChevronDown,
  History,
  RotateCcw,
  Clock,
} from "lucide-react";
import { getApplication } from "@/lib/applications/application.service";
import { verifyApplication } from "@/lib/validation/verification.service";
import { createAiReview } from "@/lib/ai/ai-review.service";
import { useLanguage } from "@/lib/language/LanguageContext";
import {
  localizeName,
  localizeService,
  localizeDocument,
  localizeLocation,
  localizeStatus,
} from "@/lib/language/translations";
import type { Application } from "@/lib/types";

type TabId = "verification" | "ai_review" | "decision";

interface AuditEventItem {
  applicationId: string;
  actorId: string;
  eventType: string;
  previousStatus: string;
  newStatus: string;
  reason: string;
  createdAt: string;
}

export function ReviewScreen({
  applicationId,
  initialTab = "verification",
}: {
  applicationId: string;
  initialTab?: TabId;
}) {
  const { t, language } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);
  const [notification, setNotification] = useState("");
  const [application, setApplication] = useState<Application | null>(
    () => getApplication(applicationId) || null
  );

  const fetchLatestApp = useCallback(async () => {
    try {
      const res = await fetch(`/api/applications/${applicationId}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data && data.id) {
          setApplication(data);
        }
      }
    } catch (e) {
      console.error("Failed to fetch fresh application:", e);
    }
  }, [applicationId]);

  useEffect(() => {
    fetchLatestApp();
  }, [fetchLatestApp]);

  if (!application) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-4 transition-colors">
        <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          {language === "hi" ? "आवेदन नहीं मिला" : "Application Not Found"}
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {language === "hi"
            ? `आवेदन संख्या "${applicationId}" के लिए कोई रिकॉर्ड उपलब्ध नहीं है।`
            : `No records found for application reference "${applicationId}".`}
        </p>
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> {language === "hi" ? "डैशबोर्ड पर वापस जाएं" : "Return to Dashboard"}
        </a>
      </div>
    );
  }

  const verification = verifyApplication(application);
  const aiReview = createAiReview(application, verification);

  function showNotification(msg: string) {
    setNotification(msg);
    setTimeout(() => setNotification(""), 3000);
  }

  const statusLabel =
    application.status === "PENDING_REVIEW"
      ? t("status_review_needed")
      : application.status === "RETURNED"
        ? t("status_returned")
        : application.status === "APPROVED"
          ? t("status_approved")
          : t("status_rejected");

  const statusColor =
    application.status === "PENDING_REVIEW"
      ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
      : application.status === "RETURNED"
        ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
        : application.status === "APPROVED"
          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
          : "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800";

  const incomeFormatted = `₹ ${application.declaredIncome.toLocaleString("en-IN")}`;
  const serviceName =
    application.service ||
    (application.declaredIncome <= 100000
      ? (language === "hi" ? "EWS आय एवं संपत्ति प्रमाण पत्र" : "EWS Income & Asset Certificate")
      : (language === "hi" ? "सामान्य आय प्रमाण पत्र" : "General Income Certificate"));

  const tabs = [
    { id: "verification" as const, label: t("tab_verification"), icon: FileSearch },
    { id: "ai_review" as const, label: t("tab_ai_review"), icon: BrainCircuit },
    { id: "decision" as const, label: t("tab_decision"), icon: CheckSquare },
  ];

  // Document status rows for the verification tab
  const documentRows = [
    ...application.documents.map((doc) => ({
      name: doc.type,
      status: doc.supplied ? t("doc_available") : t("doc_missing"),
      ok: doc.supplied,
    })),
  ];

  const standardDocs = ["आवेदन पत्र", "पहचान पत्र (आधार)", "निवास प्रमाण पत्र"];
  for (const docName of standardDocs) {
    if (!documentRows.some((d) => d.name === docName)) {
      documentRows.push({ name: docName, status: t("doc_available"), ok: true });
    }
  }

  return (
    <div className="space-y-6">
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
        <a
          href="/dashboard"
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </a>
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5">
              {t("details_crumb")}
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              {t("app_no_label")} {application.referenceNumber}
            </h1>
          </div>
          <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${statusColor}`}>
            {statusLabel}
          </span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer
                ${activeTab === tab.id
                  ? "border-blue-600 text-blue-700 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/30"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Container */}
        <div className="p-5 md:p-6 bg-slate-50/50 dark:bg-slate-950/50 min-h-[400px] transition-colors">
          {/* --- TAB: VERIFICATION --- */}
          {activeTab === "verification" && (
            <VerificationTab
              application={application}
              incomeFormatted={incomeFormatted}
              serviceName={serviceName}
              documentRows={documentRows}
              hasFindings={verification.findings.length > 0}
            />
          )}

          {/* --- TAB: AI REVIEW --- */}
          {activeTab === "ai_review" && (
            <AiReviewTab
              application={application}
              aiReview={aiReview}
            />
          )}

          {/* --- TAB: DECISION & HISTORY --- */}
          {activeTab === "decision" && (
            <DecisionTab
              application={application}
              onNotify={showNotification}
              onDecisionApplied={fetchLatestApp}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------- Verification Tab ---------- */

function VerificationTab({
  application,
  incomeFormatted,
  serviceName,
  documentRows,
  hasFindings,
}: {
  application: Application;
  incomeFormatted: string;
  serviceName: string;
  documentRows: Array<{ name: string; status: string; ok: boolean }>;
  hasFindings: boolean;
}) {
  const { t, language } = useLanguage();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Application Details Grid */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            {t("applicant_details_heading")}
          </h3>
          <div className="grid grid-cols-3 gap-y-4 text-sm">
            <div className="text-slate-500 dark:text-slate-400 font-medium">{t("applicant_name")}</div>
            <div className="col-span-2 font-semibold text-slate-900 dark:text-slate-100">{localizeName(application.name, language)}</div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">{t("father_name")}</div>
            <div className="col-span-2 font-semibold text-slate-900 dark:text-slate-100">
              {localizeName(application.fatherName || "रमेश प्रसाद", language)}
            </div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">{t("service_type")}</div>
            <div className="col-span-2 font-semibold text-slate-900 dark:text-slate-100">{localizeService(serviceName, language)}</div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">{t("declared_income")}</div>
            <div className="col-span-2 font-bold text-emerald-600 dark:text-emerald-400">{incomeFormatted} {t("per_year")}</div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">{t("financial_year")}</div>
            <div className="col-span-2 font-semibold text-slate-900 dark:text-slate-100">{application.financialYear}</div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">{t("application_date")}</div>
            <div className="col-span-2 font-semibold text-slate-900 dark:text-slate-100">{application.submittedAt}</div>

            <div className="text-slate-500 dark:text-slate-400 font-medium">{t("district_block")}</div>
            <div className="col-span-2 font-semibold text-slate-900 dark:text-slate-100">
              {localizeLocation(application.district || "पटना", language)} / {localizeLocation(application.block || application.village || "मसौढ़ी", language)}
            </div>
          </div>
        </div>

        {/* Document Status */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-colors">
          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">
            {t("document_status_heading")}
          </h3>
          <div className="space-y-3">
            {documentRows.map((doc, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <span className="font-medium text-slate-700 dark:text-slate-300">{localizeDocument(doc.name, language)}</span>
                <span
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border
                    ${doc.ok
                      ? "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                      : "bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800"
                    }
                  `}
                >
                  {doc.ok ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5" />
                  )}
                  {doc.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Verification Results Summaries */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-colors">
        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">{t("verification_results_heading")}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/60 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">{t("income_declaration")}</span>
            <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
              <Check className="w-4 h-4" /> {t("verified")}
            </span>
          </div>
          <div
            className={`${hasFindings ? "bg-rose-50 dark:bg-rose-950/30 border-rose-100 dark:border-rose-900/60" : "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-100 dark:border-emerald-900/60"} border rounded-xl p-3 flex flex-col gap-1`}
          >
            <span
              className={`text-[10px] ${hasFindings ? "text-rose-600 dark:text-rose-400" : "text-emerald-600 dark:text-emerald-400"} font-bold uppercase`}
            >
              {t("income_proof_source")}
            </span>
            <span
              className={`text-sm font-semibold ${hasFindings ? "text-rose-800 dark:text-rose-300" : "text-emerald-800 dark:text-emerald-300"} flex items-center gap-1`}
            >
              {hasFindings ? (
                <>
                  <FileWarning className="w-4 h-4" /> {t("unverified")}
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" /> {t("doc_available")}
                </>
              )}
            </span>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/60 rounded-xl p-3 flex flex-col gap-1">
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">{t("income_authenticity")}</span>
            <span className="text-sm font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" /> {t("needs_check")}
            </span>
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 font-medium leading-relaxed">
            <span className="font-bold">{t("remark_heading")}</span>{" "}
            {hasFindings ? t("remark_missing_docs") : t("remark_docs_ok")}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- AI Review Tab ---------- */

function AiReviewTab({
  application,
  aiReview: initialAiReview,
}: {
  application: Application;
  aiReview: ReturnType<typeof createAiReview>;
}) {
  const { t, language } = useLanguage();
  const [currentReview, setCurrentReview] = useState(initialAiReview);
  const [isLoading, setIsLoading] = useState(false);

  async function handleRefreshGroq() {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/applications/${application.referenceNumber || application.id}/ai-review`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentReview(data);
      }
    } catch (e) {
      console.error("Groq AI fetch error:", e);
    } finally {
      setIsLoading(false);
    }
  }

  const summaryText =
    language === "en" && currentReview.summaryEnglish
      ? currentReview.summaryEnglish
      : currentReview.summaryHindi;

  const missingList =
    language === "en" && currentReview.missingEvidenceEnglish?.length
      ? currentReview.missingEvidenceEnglish
      : currentReview.missingEvidence.map((m) => localizeDocument(m, language));

  const incList =
    language === "en" && currentReview.inconsistenciesEnglish?.length
      ? currentReview.inconsistenciesEnglish
      : currentReview.inconsistencies;

  const reasonsList =
    language === "en" && currentReview.reasonsEnglish?.length
      ? currentReview.reasonsEnglish
      : currentReview.reasonsHindi.length > 0
      ? currentReview.reasonsHindi
      : [t("reason_all_ok")];

  const referencesList =
    language === "en" && currentReview.evidenceReferencesEnglish?.length
      ? currentReview.evidenceReferencesEnglish
      : currentReview.evidenceReferences;

  return (
    <div className="space-y-4">
      {/* Groq AI Status Bar */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            {t("groq_badge")}
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {t("groq_model")}: {currentReview.modelVersion || "groq-openai/gpt-oss-120b"}
          </span>
        </div>

        <button
          onClick={handleRefreshGroq}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-60"
        >
          <BrainCircuit className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? t("groq_checking_btn") : t("groq_recheck_btn")}
        </button>
      </div>

      {/* AI Summary Header */}
      <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xl p-5 shadow-sm flex items-start gap-4 transition-colors">
        <div className="p-3 bg-blue-600 dark:bg-blue-700 text-white rounded-xl shadow-sm shrink-0">
          <BrainCircuit className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200">{t("ai_summary_heading")}</h3>
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-100/60 dark:bg-blue-900/50 px-2 py-0.5 rounded">
              {t("ai_report_pill")}
            </span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {summaryText}
          </p>
        </div>
      </div>

      {/* AI Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Issues */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5 transition-colors">
          <div>
            <h4 className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm mb-2">
              <ShieldAlert className="w-4 h-4" /> {t("main_issues_heading")}
            </h4>
            {missingList.length > 0 ? (
              <div className="bg-rose-50 dark:bg-rose-950/40 rounded-lg p-3 text-sm text-rose-900 dark:text-rose-200 border border-rose-100 dark:border-rose-900/60">
                <div className="font-semibold mb-1">{t("missing_docs_label")}</div>
                <ul className="list-disc pl-5 space-y-1 text-rose-800 dark:text-rose-300">
                  {missingList.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-lg p-3 text-sm text-emerald-900 dark:text-emerald-200 border border-emerald-100 dark:border-emerald-900/60">
                {t("no_issues_found")}
              </div>
            )}
          </div>

          <div>
            <h4 className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm mb-2">
              <AlertTriangle className="w-4 h-4" /> {t("inconsistencies_heading")}
            </h4>
            <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
              {incList.length > 0 ? (
                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                  {incList.map((inc, i) => (
                    <li key={i}>{inc}</li>
                  ))}
                </ul>
              ) : (
                <p>{t("no_inconsistencies")}</p>
              )}
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5 transition-colors">
          <div>
            <h4 className="flex items-center gap-2 text-blue-800 dark:text-blue-300 font-bold text-sm mb-2">
              <CheckCircle2 className="w-4 h-4" /> {t("suggested_action_heading")}
            </h4>
            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-lg p-3 text-sm text-blue-900 dark:text-blue-200 font-medium">
              {currentReview.suggestedAction === "RETURN"
                ? t("suggest_return_msg")
                : t("suggest_approve_msg")}
            </div>
          </div>

          <div>
            <h4 className="text-slate-600 dark:text-slate-400 font-bold text-sm mb-1">{t("reasons_heading")}</h4>
            <ul className="text-sm text-slate-700 dark:text-slate-300 list-disc pl-5 space-y-1">
              {reasonsList.map((reason, i) => (
                <li key={i}>{reason}</li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-lg flex gap-2 items-start text-xs text-slate-500 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/60">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400 dark:text-slate-500" />
            <p>
              {t("ai_note")} {t("ai_citation_prefix")}{" "}
              {referencesList?.join(" | ") || (language === "en" ? "Bihar RTPS Act, 2011" : "बिहार RTPS अधिनियम 2011")}।
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Decision & History Tab ---------- */

function DecisionTab({
  application,
  onNotify,
  onDecisionApplied,
}: {
  application: Application;
  onNotify: (msg: string) => void;
  onDecisionApplied?: () => void;
}) {
  const { t, language } = useLanguage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [auditEvents, setAuditEvents] = useState<AuditEventItem[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(true);

  // Determine whether this application has missing required documents
  const hasMissingDocs = application.documents.some((d) => !d.supplied);
  const initialAction: "RETURN" | "APPROVE" | "REJECT" = hasMissingDocs ? "RETURN" : "APPROVE";

  const [selectedAction, setSelectedAction] = useState<"RETURN" | "APPROVE" | "REJECT">(initialAction);
  const [reasonText, setReasonText] = useState<string>(
    hasMissingDocs ? t("default_return_reason") : t("default_approve_reason")
  );
  const [correctionText, setCorrectionText] = useState<string>(
    hasMissingDocs ? t("default_correction_request") : ""
  );

  const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val.includes("स्वीकृत") || val.toLowerCase().includes("approve")) {
      setSelectedAction("APPROVE");
      setReasonText(t("default_approve_reason"));
      setCorrectionText("");
    } else if (val.includes("अस्वीकृत") || val.toLowerCase().includes("reject")) {
      setSelectedAction("REJECT");
      setReasonText(t("default_reject_reason"));
      setCorrectionText("");
    } else {
      setSelectedAction("RETURN");
      setReasonText(t("default_return_reason"));
      setCorrectionText(t("default_correction_request"));
    }
  };

  const fetchAudit = useCallback(async () => {
    setLoadingAudit(true);
    try {
      const res = await fetch(`/api/applications/${application.referenceNumber || application.id}/audit`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.events && Array.isArray(data.events)) {
          setAuditEvents(data.events);
        }
      }
    } catch (err) {
      console.error("Audit load error:", err);
    } finally {
      setLoadingAudit(false);
    }
  }, [application.id, application.referenceNumber]);

  useEffect(() => {
    fetchAudit();
  }, [fetchAudit]);

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const mappedAction = selectedAction;
      const reason = reasonText || (selectedAction === "APPROVE" ? t("default_approve_reason") : t("default_return_reason"));
      const correctionItems = correctionText
        ? correctionText.split("\n").filter(Boolean)
        : undefined;

      const body: Record<string, unknown> = {
        action: mappedAction,
        reason,
      };
      if (mappedAction === "RETURN") {
        body.correctionItems = correctionItems?.length
          ? correctionItems
          : ["आवश्यक आय-संबंधी दस्तावेज़ प्रस्तुत करें"];
      }

      const response = await fetch(`/api/applications/${application.id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        onNotify(t("msg_decision_success") + " " + mappedAction);
        await fetchAudit();
        onDecisionApplied?.();
      } else {
        const result = await response.json();
        onNotify(`Error: ${result.error || "Decision could not be submitted."}`);
      }
    } catch {
      onNotify("Network error while submitting decision.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function renderEventBadge(eventType: string) {
    const type = eventType.toUpperCase();
    if (type.includes("RETURN")) {
      return {
        label: t("event_return_badge"),
        color: "text-indigo-700 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800",
        icon: RotateCcw,
        dotBorder: "border-indigo-500 bg-indigo-100 text-indigo-600 dark:border-indigo-500 dark:bg-indigo-950 dark:text-indigo-400",
      };
    }
    if (type.includes("APPROV")) {
      return {
        label: t("event_approve_badge"),
        color: "text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800",
        icon: CheckCircle2,
        dotBorder: "border-emerald-500 bg-emerald-100 text-emerald-600 dark:border-emerald-500 dark:bg-emerald-950 dark:text-emerald-400",
      };
    }
    if (type.includes("REJECT")) {
      return {
        label: t("event_reject_badge"),
        color: "text-rose-700 bg-rose-50 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800",
        icon: XCircle,
        dotBorder: "border-rose-500 bg-rose-100 text-rose-600 dark:border-rose-500 dark:bg-rose-950 dark:text-rose-400",
      };
    }
    if (type.includes("AI")) {
      return {
        label: t("event_ai_badge"),
        color: "text-blue-700 bg-blue-50 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800",
        icon: BrainCircuit,
        dotBorder: "border-blue-500 bg-blue-100 text-blue-600 dark:border-blue-500 dark:bg-blue-950 dark:text-blue-400",
      };
    }
    if (type.includes("VERIF")) {
      return {
        label: t("event_verif_badge"),
        color: "text-teal-700 bg-teal-50 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800",
        icon: CheckSquare,
        dotBorder: "border-teal-500 bg-teal-100 text-teal-600 dark:border-teal-500 dark:bg-teal-950 dark:text-teal-400",
      };
    }
    return {
      label: t("event_received_badge"),
      color: "text-slate-700 bg-slate-50 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
      icon: Clock,
      dotBorder: "border-slate-400 bg-slate-200 text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-400",
    };
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Decision Form */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col overflow-hidden transition-colors">
        <div className="bg-[#0f3057] dark:bg-[#081b33] px-5 py-3 text-white flex justify-between items-center">
          <h3 className="font-bold text-base">{t("decision_form_heading")}</h3>
          <span className="text-xs bg-blue-800 dark:bg-blue-900 text-blue-100 px-2 py-0.5 rounded font-medium">
            {t("dsc_badge")}
          </span>
        </div>
        <div className="p-5 space-y-4 flex-1">
          <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
            <div className="text-slate-500 dark:text-slate-400 font-medium">{t("app_no_label")}</div>
            <div className="font-bold text-slate-900 dark:text-slate-100">{application.referenceNumber}</div>
            <div className="text-slate-500 dark:text-slate-400 font-medium">{t("applicant_name")}:</div>
            <div className="font-bold text-slate-900 dark:text-slate-100">{localizeName(application.name, language)}</div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t("decision_action_label")} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <select
                id="decision-action"
                value={
                  selectedAction === "APPROVE"
                    ? t("opt_approve")
                    : selectedAction === "REJECT"
                    ? t("opt_reject")
                    : t("opt_return")
                }
                onChange={handleActionChange}
                className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-2.5 shadow-sm font-medium"
              >
                <option>{t("opt_approve")}</option>
                <option>{t("opt_return")}</option>
                <option>{t("opt_reject")}</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
              {t("decision_reason_label")} <span className="text-rose-500">*</span>
            </label>
            <textarea
              id="decision-reason"
              className="w-full bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-2.5 shadow-sm"
              rows={3}
              value={reasonText}
              onChange={(e) => setReasonText(e.target.value)}
            />
          </div>

          {selectedAction === "RETURN" ? (
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t("applicant_instructions_label")}
              </label>
              <textarea
                id="correction-items"
                className="w-full bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-slate-800 dark:text-slate-100 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block px-3 py-2.5 shadow-sm"
                rows={3}
                value={correctionText}
                onChange={(e) => setCorrectionText(e.target.value)}
              />
            </div>
          ) : (
            <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span>{t("no_correction_needed")}</span>
            </div>
          )}
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/80 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
          <a
            href="/dashboard"
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm"
          >
            {t("btn_cancel")}
          </a>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm disabled:opacity-70 cursor-pointer"
          >
            {isSubmitting ? t("btn_submitting") : t("btn_submit_decision")}
          </button>
        </div>
      </div>

      {/* Right: Decision History Timeline */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col transition-colors">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400 dark:text-slate-500" /> {t("history_heading")}
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {loadingAudit ? t("loading_history") : `${t("entries_count")} ${auditEvents.length}`}
          </span>
        </div>

        {loadingAudit && auditEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
            {t("loading_history")}
          </div>
        ) : auditEvents.length === 0 ? (
          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
            {t("no_history")}
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 md:ml-4 space-y-7 pb-4">
            {auditEvents.map((event, idx) => {
              const meta = renderEventBadge(event.eventType);
              const EventIcon = meta.icon;
              const dateStr = event.createdAt
                ? new Date(event.createdAt).toLocaleString("hi-IN", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : application.submittedAt;

              return (
                <div key={idx} className="relative pl-6 md:pl-8">
                  <div
                    className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${meta.dotBorder}`}
                  >
                    <EventIcon className="w-3 h-3" />
                  </div>
                  <div className="mb-1 flex items-center gap-2 flex-wrap">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded border ${meta.color}`}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 space-y-0.5">
                    <div>{dateStr}</div>
                    <div className="font-medium text-slate-600 dark:text-slate-300">
                      {t("actor_label")} {localizeName(event.actorId, language)}
                    </div>
                  </div>
                  {event.reason && (
                    <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{t("details_label")}</span> {event.reason}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
