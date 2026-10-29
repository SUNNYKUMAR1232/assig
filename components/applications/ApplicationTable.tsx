"use client";

import { Application } from "@/lib/types";

export function ApplicationTable({
  applications,
  onSelect,
}: {
  applications: Application[];
  onSelect: (id: string) => void;
}) {
  const statusLabels = {
    PENDING_REVIEW: "लंबित",
    RETURNED: "वापस किया गया",
    APPROVED: "स्वीकृत",
    REJECTED: "अस्वीकृत",
  } as const;

  const statusColors = {
    PENDING_REVIEW: "bg-amber-100 text-amber-800 border-amber-200",
    RETURNED: "bg-purple-100 text-purple-700 border-purple-200",
    APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    REJECTED: "bg-rose-100 text-rose-700 border-rose-200",
  } as const;

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-200">
          <th className="py-3 px-5">#</th>
          <th className="py-3 px-5">आवेदन संख्या</th>
          <th className="py-3 px-5">आवेदक का नाम</th>
          <th className="py-3 px-5">सेवा प्रकार</th>
          <th className="py-3 px-5">आय (घोषित)</th>
          <th className="py-3 px-5">स्थिति</th>
          <th className="py-3 px-5">दिनांक</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 text-sm cursor-pointer">
        {applications.map((application, idx) => (
          <tr
            key={application.id}
            onClick={() => onSelect(application.referenceNumber || application.id)}
            className="hover:bg-blue-50/50 transition-colors"
          >
            <td className="py-3.5 px-5 text-slate-400">{idx + 1}</td>
            <td className="py-3.5 px-5 font-bold text-slate-800">
              {application.referenceNumber}
            </td>
            <td className="py-3.5 px-5 text-slate-700">
              <div className="font-semibold">{application.name}</div>
              <div className="text-xs text-slate-400">{application.village}</div>
            </td>
            <td className="py-3.5 px-5 text-slate-500 text-xs max-w-[150px] truncate">
              {application.service || "सामान्य आय प्रमाण पत्र"}
            </td>
            <td className="py-3.5 px-5 font-medium">
              ₹ {application.declaredIncome.toLocaleString("en-IN")}
            </td>
            <td className="py-3.5 px-5">
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${statusColors[application.status] || ""}`}
              >
                {statusLabels[application.status] || application.status}
              </span>
            </td>
            <td className="py-3.5 px-5 text-slate-500 text-xs">{application.submittedAt}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
