"use client";

import { useState } from "react";
import { Application } from "@/lib/types";
import { verifyApplication } from "@/lib/validation/verification.service";
import { X, CheckCircle2, AlertTriangle, FileWarning, BrainCircuit } from "lucide-react";

export function ReviewPanel({
  application,
  onClose,
}: {
  application: Application;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const findings = verifyApplication(application);

  async function decide(action: "RETURN" | "REJECT" | "APPROVE") {
    if (action === "APPROVE" && findings.findings.length > 0) {
      setMessage("स्वीकृति से पहले सभी आवश्यक दस्तावेज़ एवं जांच पूरी करें।");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/applications/${application.id}/decision`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          reason:
            action === "RETURN"
              ? "आय संबंधी आवश्यक दस्तावेज़ उपलब्ध नहीं है।"
              : action === "APPROVE"
                ? "सभी संलग्न दस्तावेज़ संतोषजनक पाए गए।"
                : "अधिकारी द्वारा प्रक्रिया के आधार पर आवेदन अस्वीकृत किया गया।",
          correctionItems:
            action === "RETURN" ? ["आवश्यक आय-संबंधी दस्तावेज़ प्रस्तुत करें"] : undefined,
        }),
      });
      const result = await response.json();
      setMessage(response.ok ? "निर्णय सुरक्षित किया गया और ऑडिट लॉग में दर्ज है।" : result.error);
    } catch {
      setMessage("निर्णय सबमिट करने में त्रुटि हुई।");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs">
      <section className="w-full max-w-xl h-full bg-white dark:bg-slate-900 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between transition-colors">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                आवेदन समीक्षा
              </span>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">{application.name}</h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                आवेदन संख्या: {application.referenceNumber}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 my-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block">सेवा</span>
              <strong className="text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
                {application.service || "आय प्रमाण-पत्र"}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block">वित्तीय वर्ष</span>
              <strong className="text-slate-800 dark:text-slate-200 text-sm mt-0.5 block">
                {application.financialYear}
              </strong>
            </div>
            <div>
              <span className="text-slate-400 dark:text-slate-500 block">घोषित वार्षिक आय</span>
              <strong className="text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">
                ₹ {application.declaredIncome.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">दस्तावेज़ और सत्यापन स्थिति</h3>
          <div className="space-y-2 mb-4">
            {application.documents.map((doc) => (
              <div
                key={doc.type}
                className="flex items-center justify-between p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  {doc.supplied ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <FileWarning className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  )}
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{doc.type}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                    doc.supplied
                      ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300"
                      : "bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300"
                  }`}
                >
                  {doc.supplied ? "उपलब्ध" : "अनुपलब्ध"}
                </span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-xs space-y-1">
            <div className="font-bold text-blue-900 dark:text-blue-300 flex items-center gap-1.5">
              <BrainCircuit className="w-4 h-4 text-blue-600 dark:text-blue-400" /> AI समीक्षा सहायक
            </div>
            <p className="text-blue-800 dark:text-blue-200">
              {findings.findings.length > 0
                ? "आय का प्रमाण प्रस्तुत नहीं किया गया है, इसलिए आवश्यक दस्तावेज़ मांगना उचित होगा।"
                : "सभी आवश्यक दस्तावेज़ उपलब्ध हैं। अंतिम निर्णय नामित अधिकारी द्वारा लिया जाएगा।"}
            </p>
          </div>

          {message && (
            <div className="mt-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{message}</span>
            </div>
          )}
        </div>

        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
          <button
            onClick={() => decide("RETURN")}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800 cursor-pointer disabled:opacity-50"
          >
            ↩ वापस करें
          </button>
          <button
            onClick={() => decide("REJECT")}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800 cursor-pointer disabled:opacity-50"
          >
            अस्वीकृत
          </button>
          <button
            onClick={() => decide("APPROVE")}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm cursor-pointer disabled:opacity-50"
          >
            स्वीकृत करें
          </button>
        </div>
      </section>
    </div>
  );
}
