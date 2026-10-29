import { applications } from "@/data/demo-applications";
import { Application } from "@/lib/types";
import {
  getApplicationByIdFromDb,
  getApplicationsFromDb,
  getDashboardStatsFromDb,
} from "@/lib/db";

export function getApplication(id: string): Application | undefined {
  if (!id) return undefined;
  const cleanId = decodeURIComponent(id).trim().toLowerCase();

  // Legacy fallback support for rtps-inc-2026-00128
  if (cleanId === "rtps-inc-2026-00128") {
    return applications[0];
  }

  return applications.find((app) => {
    return (
      app.id.toLowerCase() === cleanId ||
      app.referenceNumber.toLowerCase() === cleanId ||
      String(app.numericId) === cleanId ||
      app.referenceNumber.toLowerCase().replace(/[^a-z0-9]/g, "") === cleanId.replace(/[^a-z0-9]/g, "")
    );
  });
}

export async function getApplicationAsync(id: string): Promise<Application | undefined> {
  const dbApp = await getApplicationByIdFromDb(id);
  if (dbApp) return dbApp;
  return getApplication(id);
}

export async function getAllApplicationsAsync(): Promise<Application[]> {
  const dbApps = await getApplicationsFromDb();
  if (dbApps && dbApps.length > 0) return dbApps;
  return applications;
}

export function getDashboardStats() {
  return {
    total: 48,
    pendingReview: applications.filter((app) => app.status === "PENDING_REVIEW").length,
    approvedThisMonth: applications.filter((app) => app.status === "APPROVED").length,
    attentionRequired: applications.filter((app) => app.priority === "तात्कालिक").length,
  };
}

export async function getDashboardStatsAsync() {
  return getDashboardStatsFromDb();
}
