"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  User, Lock, Landmark, LayoutDashboard, FileText, CheckSquare, 
  History, BookOpen, LogOut, Users, Clock, CheckCircle2, 
  XCircle, RotateCcw, Search, Filter, Menu, X, ArrowLeft, 
  BrainCircuit, FileSearch, ShieldAlert, AlertTriangle,
  ChevronDown, Check, Info, FileWarning, Database,
  Building, MapPin, Mail, Phone, Award, KeyRound, BadgeCheck, ShieldCheck,
  Scale, FileCheck
} from 'lucide-react';
import { useLanguage } from '@/lib/language/LanguageContext';
import { LanguageToggle } from '@/components/common/LanguageToggle';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import {
  type TranslationKey,
  localizeName,
  localizeService,
  localizeDocument,
  localizeLocation,
  localizeStatus,
} from '@/lib/language/translations';

interface AppItem {
  id: number;
  appNo: string;
  name: string;
  service: string;
  income: string;
  status: string;
  statusColor: string;
  date: string;
}

interface FullApplication {
  id: string;
  numericId?: number;
  name: string;
  fatherName?: string;
  village?: string;
  district?: string;
  block?: string;
  referenceNumber: string;
  service?: string;
  submittedAt?: string;
  status: string;
  priority?: string;
  financialYear?: string;
  declaredIncome: number;
  documents: Array<{
    type: string;
    supplied: boolean;
    verificationStatus: string;
    finding?: string;
  }>;
}

interface GroqReviewData {
  available: boolean;
  modelVersion: string;
  summaryHindi: string;
  summaryEnglish?: string;
  missingEvidence: string[];
  missingEvidenceEnglish?: string[];
  inconsistencies: string[];
  inconsistenciesEnglish?: string[];
  checksRequiringManualReview: string[];
  suggestedAction: 'RETURN' | 'REVIEW';
  reasonsHindi: string[];
  reasonsEnglish?: string[];
  evidenceReferences: string[];
  evidenceReferencesEnglish?: string[];
}

interface AuditEventItem {
  applicationId: string;
  actorId: string;
  eventType: string;
  previousStatus: string;
  newStatus: string;
  reason: string;
  createdAt: string;
}

const defaultStatsConfig = [
  { key: 'total_apps' as const, count: 48, icon: Users, bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-900', iconBg: 'bg-blue-100 dark:bg-blue-900/60' },
  { key: 'pending_apps' as const, count: 32, icon: Clock, bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-900', iconBg: 'bg-amber-100 dark:bg-amber-900/60' },
  { key: 'approved_apps' as const, count: 10, icon: CheckCircle2, bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-900', iconBg: 'bg-emerald-100 dark:bg-emerald-900/60' },
  { key: 'rejected_apps' as const, count: 3, icon: XCircle, bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-900', iconBg: 'bg-rose-100 dark:bg-rose-900/60' },
  { key: 'returned_apps' as const, count: 3, icon: RotateCcw, bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-900', iconBg: 'bg-indigo-100 dark:bg-indigo-900/60' },
];

const fallbackApplications: AppItem[] = [
  { id: 1, appNo: 'BR-IC-1007', name: 'संदीप कुमार', service: 'सामान्य आय प्रमाण पत्र', income: '₹ 2,40,000', status: 'जाँच आवश्यक', statusColor: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800', date: '25-10-2026' },
  { id: 2, appNo: 'BR-IC-1012', name: 'रीना देवी', service: 'सामान्य आय प्रमाण पत्र', income: '₹ 1,80,000', status: 'लंबित', statusColor: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800', date: '24-10-2026' },
  { id: 3, appNo: 'BR-IC-1003', name: 'मोहन पासवान', service: 'सामान्य आय प्रमाण पत्र', income: '₹ 3,20,000', status: 'लंबित', statusColor: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800', date: '23-10-2026' },
  { id: 4, appNo: 'BR-IC-1018', name: 'अनिता कुमारी', service: 'EWS आय एवं संपत्ति प्रमाण पत्र', income: '₹ 90,000', status: 'वापस किया गया', statusColor: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800', date: '22-10-2026' },
  { id: 5, appNo: 'BR-IC-1016', name: 'विकास सिंह', service: 'सामान्य आय प्रमाण पत्र', income: '₹ 4,50,000', status: 'लंबित', statusColor: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800', date: '22-10-2026' },
  { id: 6, appNo: 'BR-IC-1009', name: 'सुनील कुमार', service: 'EWS आय एवं संपत्ति प्रमाण पत्र', income: '₹ 6,80,000', status: 'लंबित', statusColor: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800', date: '21-10-2026' },
  { id: 7, appNo: 'BR-IC-1014', name: 'पूजा कुमारी', service: 'सामान्य आय प्रमाण पत्र', income: '₹ 1,20,000', status: 'स्वीकृत', statusColor: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800', date: '20-10-2026' },
  { id: 8, appNo: 'BR-IC-1005', name: 'रवि रंजन', service: 'सामान्य आय प्रमाण पत्र', income: '₹ 5,10,000', status: 'अस्वीकृत', statusColor: 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800', date: '19-10-2026' },
];

export default function JanSevaSahayakApp() {
  const { t, language } = useLanguage();

  // --- Global State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'app_list' | 'app_details' | 'profile' | 'guidelines'>('dashboard');
  const [activeTab, setActiveTab] = useState<'verification' | 'ai_review' | 'decision'>('verification');
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [selectedFullApp, setSelectedFullApp] = useState<FullApplication | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'DECIDED'>('ALL');
  const [isLiveDb, setIsLiveDb] = useState(false);

  // Stats & Applications from Neon DB
  const [stats, setStats] = useState(defaultStatsConfig);
  const [applications, setApplications] = useState<AppItem[]>(fallbackApplications);

  // AI & Audit State
  const [groqReview, setGroqReview] = useState<GroqReviewData | null>(null);
  const [isLoadingGroq, setIsLoadingGroq] = useState(false);
  const [auditEvents, setAuditEvents] = useState<AuditEventItem[]>([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  // Dynamic Decision Form State
  const [appDecisionAction, setAppDecisionAction] = useState<'RETURN' | 'APPROVE' | 'REJECT'>('APPROVE');
  const [appDecisionReason, setAppDecisionReason] = useState<string>('');
  const [appDecisionCorrections, setAppDecisionCorrections] = useState<string>('');

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3500);
  };

  function getLocalizedStatus(statusText: string): string {
    return localizeStatus(statusText, language);
  }

  // --- Fetch Stats from Neon DB ---
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/dashboard/stats', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.source === 'neon_postgresql') {
          setIsLiveDb(true);
          setStats([
            { key: 'total_apps', count: data.total || 48, icon: Users, bg: 'bg-blue-50 dark:bg-blue-950/40', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-900', iconBg: 'bg-blue-100 dark:bg-blue-900/60' },
            { key: 'pending_apps', count: data.pendingReview || 32, icon: Clock, bg: 'bg-amber-50 dark:bg-amber-950/40', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-900', iconBg: 'bg-amber-100 dark:bg-amber-900/60' },
            { key: 'approved_apps', count: data.approvedThisMonth || 10, icon: CheckCircle2, bg: 'bg-emerald-50 dark:bg-emerald-950/40', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-900', iconBg: 'bg-emerald-100 dark:bg-emerald-900/60' },
            { key: 'rejected_apps', count: data.rejected !== undefined ? data.rejected : 3, icon: XCircle, bg: 'bg-rose-50 dark:bg-rose-950/40', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-200 dark:border-rose-900', iconBg: 'bg-rose-100 dark:bg-rose-900/60' },
            { key: 'returned_apps', count: data.returned !== undefined ? data.returned : 3, icon: RotateCcw, bg: 'bg-indigo-50 dark:bg-indigo-950/40', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-900', iconBg: 'bg-indigo-100 dark:bg-indigo-900/60' },
          ]);
        }
      }
    } catch (e) {
      console.log('Stats fetch note:', e);
    }
  }, []);

  // --- Fetch Applications from Neon DB ---
  const fetchApplicationsList = useCallback(async () => {
    try {
      const res = await fetch('/api/applications', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.applications && Array.isArray(data.applications)) {
          const mapped: AppItem[] = data.applications.map((a: FullApplication, idx: number) => {
            let statusColor = 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
            let statusLabel = 'लंबित';

            if (a.status === 'PENDING_REVIEW') {
              statusLabel = a.priority === 'तात्कालिक' ? 'जाँच आवश्यक' : 'लंबित';
              statusColor = a.priority === 'तात्कालिक'
                ? 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800'
                : 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
            } else if (a.status === 'RETURNED') {
              statusLabel = 'वापस किया गया';
              statusColor = 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
            } else if (a.status === 'APPROVED') {
              statusLabel = 'स्वीकृत';
              statusColor = 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
            } else if (a.status === 'REJECTED') {
              statusLabel = 'अस्वीकृत';
              statusColor = 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
            }

            return {
              id: a.numericId || idx + 1,
              appNo: a.referenceNumber,
              name: a.name,
              service: a.service || 'सामान्य आय प्रमाण पत्र',
              income: `₹ ${Number(a.declaredIncome || 0).toLocaleString('en-IN')}`,
              status: statusLabel,
              statusColor,
              date: a.submittedAt || '25-10-2026',
            };
          });

          setApplications(mapped);
          setIsLiveDb(true);
        }
      }
    } catch (e) {
      console.log('Applications fetch note:', e);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    fetchApplicationsList();
  }, [fetchStats, fetchApplicationsList]);

  // --- Load Full App Data ---
  const loadFullApp = async (appNo: string) => {
    try {
      const res = await fetch(`/api/applications/${appNo}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setSelectedFullApp(data);
        const hasMissing = data.documents && data.documents.some((d: { supplied: boolean }) => !d.supplied);
        setAppDecisionAction(hasMissing ? 'RETURN' : 'APPROVE');
        setAppDecisionReason(hasMissing ? t('default_return_reason') : t('default_approve_reason'));
        setAppDecisionCorrections(hasMissing ? t('default_correction_request') : '');
      }
    } catch (e) {
      console.error('Error fetching full application:', e);
    }
  };

  // --- Load Groq AI Review ---
  const loadGroqReview = async (appNo: string, force = false) => {
    setIsLoadingGroq(true);
    try {
      const res = await fetch(`/api/applications/${appNo}/ai-review`, {
        method: force ? 'POST' : 'GET',
        cache: 'no-store',
      });
      if (res.ok) {
        const data = await res.json();
        setGroqReview(data);
      }
    } catch (e) {
      console.error('Error fetching Groq AI review:', e);
    } finally {
      setIsLoadingGroq(false);
    }
  };

  // --- Load Audit History from Neon DB ---
  const loadAuditHistory = async (appNo: string) => {
    setLoadingAudit(true);
    try {
      const res = await fetch(`/api/applications/${appNo}/audit`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.events && Array.isArray(data.events)) {
          setAuditEvents(data.events);
        }
      }
    } catch (e) {
      console.error('Error fetching audit events:', e);
    } finally {
      setLoadingAudit(false);
    }
  };

  const openAppDetails = (app: AppItem) => {
    setSelectedApp(app);
    setCurrentView('app_details');
    setActiveTab('verification');
    const isMissing = app.id === 1 || app.id === 4;
    setAppDecisionAction(isMissing ? 'RETURN' : 'APPROVE');
    setAppDecisionReason(isMissing ? t('default_return_reason') : t('default_approve_reason'));
    setAppDecisionCorrections(isMissing ? t('default_correction_request') : '');
    loadFullApp(app.appNo);
    loadGroqReview(app.appNo);
    loadAuditHistory(app.appNo);
  };

  const handleAppDecisionActionChange = (val: string) => {
    if (val.includes('स्वीकृत') || val.toLowerCase().includes('approve')) {
      setAppDecisionAction('APPROVE');
      setAppDecisionReason(t('default_approve_reason'));
      setAppDecisionCorrections('');
    } else if (val.includes('अस्वीकृत') || val.toLowerCase().includes('reject')) {
      setAppDecisionAction('REJECT');
      setAppDecisionReason(t('default_reject_reason'));
      setAppDecisionCorrections('');
    } else {
      setAppDecisionAction('RETURN');
      setAppDecisionReason(t('default_return_reason'));
      setAppDecisionCorrections(t('default_correction_request'));
    }
  };

  const menuItems = [
    { tKey: 'nav_dashboard' as TranslationKey, view: 'dashboard' as const, icon: LayoutDashboard },
    { tKey: 'nav_applications' as TranslationKey, view: 'app_list' as const, icon: FileText, filter: 'ALL' as const },
    { tKey: 'nav_scrutiny' as TranslationKey, view: 'app_list' as const, icon: CheckSquare, filter: 'PENDING' as const },
    { tKey: 'nav_decisions' as TranslationKey, view: 'app_list' as const, icon: History, filter: 'DECIDED' as const },
    { tKey: 'nav_guidelines' as TranslationKey, view: 'guidelines' as const, icon: BookOpen },
    { tKey: 'nav_profile' as TranslationKey, view: 'profile' as const, icon: User },
  ];

  // --- Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setSelectedApp(null);
  };

  const handleDecisionSubmit = async () => {
    if (!selectedApp) return;

    const mappedAction = appDecisionAction;
    let newStatus = 'स्वीकृत';
    let newStatusColor = 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';

    if (mappedAction === 'RETURN') {
      newStatus = 'वापस किया गया';
      newStatusColor = 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
    } else if (mappedAction === 'REJECT') {
      newStatus = 'अस्वीकृत';
      newStatusColor = 'bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800';
    }

    const reason = appDecisionReason || (mappedAction === 'APPROVE' ? t('default_approve_reason') : t('default_return_reason'));
    const correctionList = appDecisionCorrections
      ? appDecisionCorrections.split('\n').filter(Boolean)
      : ['आवश्यक आय-संबंधी दस्तावेज़ प्रस्तुत करें'];

    setIsSubmittingDecision(true);
    try {
      const payload: Record<string, unknown> = {
        action: mappedAction,
        reason,
      };
      if (mappedAction === 'RETURN') {
        payload.correctionItems = correctionList;
      }

      const res = await fetch(`/api/applications/${selectedApp.appNo}/decision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((a) =>
            a.appNo === selectedApp.appNo
              ? { ...a, status: newStatus, statusColor: newStatusColor }
              : a
          )
        );

        setSelectedApp((prev) =>
          prev ? { ...prev, status: newStatus, statusColor: newStatusColor } : null
        );

        showNotification(`${t('msg_decision_success')} ${getLocalizedStatus(newStatus)}`);
        await loadAuditHistory(selectedApp.appNo);
        await fetchStats();
      } else {
        const err = await res.json();
        showNotification(`Error: ${err.error || 'Decision could not be submitted'}`);
      }
    } catch {
      showNotification('Network error while submitting decision.');
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    // Status filter
    if (statusFilter === 'PENDING') {
      if (app.status !== 'लंबित' && app.status !== 'जाँच आवश्यक') return false;
    } else if (statusFilter === 'DECIDED') {
      if (app.status === 'लंबित' || app.status === 'जाँच आवश्यक') return false;
    }

    // Query filter
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      app.name.toLowerCase().includes(query) ||
      app.appNo.toLowerCase().includes(query) ||
      app.service.toLowerCase().includes(query)
    );
  });

  // --- Render Login Screen ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 dark:from-slate-950 dark:to-blue-950 flex flex-col justify-center items-center p-4 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
        <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-100 dark:border-slate-800 relative">
          {/* Top Controls in Login View */}
          <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
          </div>

          <div className="p-8 pb-6 flex flex-col items-center border-b border-slate-50 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/60">
            <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center border border-blue-100 dark:border-blue-900 mb-4 shadow-inner">
              <Landmark className="w-8 h-8 text-blue-900 dark:text-blue-300" />
            </div>
            <h1 className="text-xl font-bold text-center text-slate-900 dark:text-slate-100 leading-tight">{t('gov_bihar')}</h1>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mb-4">{t('dept_name')}</p>
            <h2 className="text-2xl font-black text-blue-700 dark:text-blue-400 tracking-tight text-center">{t('app_title')}</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mt-1 text-center">{t('app_subtitle')}</p>
          </div>
          
          <div className="p-8 pt-6">
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide ml-1">{t('username')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input type="text" defaultValue="rajesh.kumar" className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-slate-900 dark:text-slate-100" required />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide ml-1">{t('password')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                  </div>
                  <input type="password" defaultValue="password123" className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 dark:focus:ring-blue-500 focus:border-transparent transition-all shadow-sm text-slate-900 dark:text-slate-100" required />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow transition-all transform active:scale-[0.99] mt-2 cursor-pointer">
                {t('login')}
              </button>
            </form>
            <p className="text-xs text-center text-slate-400 dark:text-slate-500 mt-6 font-medium">{t('demo_hint')}</p>
          </div>
        </div>
      </div>
    );
  }

  // --- Render Layout & Navigation ---
  return (
    <div className="h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100 overflow-hidden selection:bg-blue-200 transition-colors duration-200">
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-slate-900 text-white px-6 py-3 rounded-full shadow-lg z-50 flex items-center gap-2 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium">{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <header className="h-14 bg-blue-950 dark:bg-[#071324] text-white px-4 md:px-6 flex items-center justify-between shadow-md shrink-0 z-40 border-b border-transparent dark:border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 rounded-lg hover:bg-blue-900 text-white transition-colors cursor-pointer"
            aria-label="मेनू खोलें"
          >
            <Menu className="w-5 h-5" />
          </button>
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-400 flex items-center justify-center text-blue-950 shadow-inner shrink-0">
              <Landmark className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight flex items-center gap-2 leading-none">
                {t('app_title')}
                <span className="text-[10px] bg-blue-800 text-blue-200 px-1.5 py-0.5 rounded font-semibold tracking-wider uppercase border border-blue-700">Govt</span>
                {isLiveDb && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded font-semibold border border-emerald-800">
                    <Database className="w-2.5 h-2.5 text-emerald-400" /> {t('neon_db')}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-blue-300 font-medium mt-0.5">{t('app_subtitle')}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Toggle in Main Header */}
          <LanguageToggle />

          {/* Dark Mode Toggle in Main Header */}
          <ThemeToggle />

          <div
            onClick={() => setCurrentView('profile')}
            className="hidden sm:flex items-center gap-2.5 bg-blue-900/60 hover:bg-blue-900 px-3 py-1.5 rounded-xl border border-blue-800 transition-colors cursor-pointer"
            title={t('nav_profile')}
          >
            <div className="w-7 h-7 rounded-lg bg-blue-700 flex items-center justify-center text-white text-xs font-bold shadow-sm">
              <User className="w-4 h-4" />
            </div>
            <div className="text-left leading-tight pr-1">
              <div className="text-xs font-bold text-white">{t('officer_name')}</div>
              <div className="text-[10px] text-blue-300 font-medium">{t('officer_role')}</div>
            </div>
          </div>
          
          <button onClick={handleLogout} className="p-2 rounded-xl hover:bg-rose-600/90 hover:text-white text-blue-200 transition-all flex items-center justify-center shadow-sm border border-transparent hover:border-rose-500 cursor-pointer" title={t('logout')}>
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Mobile Sidebar Backdrop */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 z-50 lg:hidden backdrop-blur-xs transition-opacity"
          />
        )}

        {/* Mobile Sidebar Drawer */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-72 bg-[#0f3057] dark:bg-[#0a1a2f] text-slate-200 flex flex-col shadow-2xl
            transform transition-transform duration-300 ease-in-out lg:hidden
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="h-14 px-4 flex items-center justify-between border-b border-blue-900/80 bg-blue-950 dark:bg-[#071324]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-amber-400 flex items-center justify-center text-blue-950">
                <Landmark className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-bold text-sm text-white">{t('app_title')}</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg hover:bg-blue-900 text-blue-300 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = (currentView === item.view && (!item.filter || statusFilter === item.filter));
              
              return (
                <button
                  key={item.tKey}
                  onClick={() => {
                    setCurrentView(item.view);
                    if (item.filter) setStatusFilter(item.filter);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer
                    ${isActive ? 'bg-blue-600 text-white shadow-md font-semibold' : 'text-blue-100 hover:bg-blue-900/60 hover:text-white'}
                  `}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                  <span>{t(item.tKey)}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-3.5 m-3 bg-blue-900/40 dark:bg-slate-900/80 rounded-xl border border-blue-800/60 dark:border-slate-800 text-center text-xs">
            <div className="text-blue-300 font-medium">{t('support_title')}</div>
            <div className="text-sm font-bold text-white mt-1">1800-123-4567</div>
            <div className="text-[10px] text-blue-400 mt-0.5">{t('support_timing')}</div>
          </div>
        </div>

        {/* Desktop Fixed Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-[#0f3057] dark:bg-[#0a1a2f] text-slate-200 border-r border-blue-900/80 dark:border-slate-800 shrink-0 h-full justify-between">
          <nav className="p-3 space-y-1.5 mt-3 flex-1 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = (currentView === item.view && (!item.filter || statusFilter === item.filter));
              
              return (
                <button
                  key={item.tKey}
                  onClick={() => {
                    setCurrentView(item.view);
                    if (item.filter) setStatusFilter(item.filter);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer
                    ${isActive ? 'bg-blue-600 text-white shadow-md font-semibold' : 'text-blue-100 hover:bg-blue-900/60 hover:text-white'}
                  `}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                  <span>{t(item.tKey)}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-3.5 m-3 bg-blue-900/40 dark:bg-slate-900/80 rounded-xl border border-blue-800/60 dark:border-slate-800 text-center text-xs">
            <div className="text-blue-300 font-medium">{t('support_title')}</div>
            <div className="text-sm font-bold text-white mt-1">1800-123-4567</div>
            <div className="text-[10px] text-blue-400 mt-0.5">{t('support_timing')}</div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          
          {/* --- VIEW: DASHBOARD --- */}
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('dashboard_title')}</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{t('dashboard_subtitle')}</p>
                </div>

                {isLiveDb && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    {t('neon_connected')}
                  </span>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {stats.map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className={`${stat.bg} ${stat.border} border rounded-2xl p-4 shadow-sm flex flex-col justify-between relative`}>
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
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 flex items-center justify-between">
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">{t('today_priority_sub')}</h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{t('displayed_apps')} ({t('total_count_label')} {applications.length})</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                        <th className="py-3 px-5">{t('th_serial')}</th>
                        <th className="py-3 px-5">{t('th_app_no')}</th>
                        <th className="py-3 px-5">{t('th_applicant')}</th>
                        <th className="py-3 px-5">{t('th_income')}</th>
                        <th className="py-3 px-5">{t('th_status')}</th>
                        <th className="py-3 px-5">{t('th_date')}</th>
                        <th className="py-3 px-5 text-center">{t('th_action')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                      {applications.slice(0, 5).map((app, idx) => (
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
                            <button
                              onClick={() => openAppDetails(app)}
                              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-lg shadow-sm transition-all cursor-pointer"
                            >
                              {t('btn_review')}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW: APPLICATION LIST --- */}
          {currentView === 'app_list' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    {statusFilter === 'PENDING'
                      ? t('app_list_pending_title')
                      : statusFilter === 'DECIDED'
                        ? t('app_list_decided_title')
                        : t('app_list_all_title')}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {t('total_displayed_count')} {filteredApplications.length}
                  </p>
                </div>
                
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('search_placeholder')} 
                      className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <button 
                    onClick={() => {
                      setStatusFilter(statusFilter === 'ALL' ? 'PENDING' : 'ALL');
                    }}
                    className={`flex items-center gap-2 border text-sm font-medium px-4 py-2 rounded-xl transition-colors cursor-pointer ${
                      statusFilter !== 'ALL'
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                        : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      {statusFilter === 'ALL' ? t('filter_btn') : t('filter_active')}
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-xs uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
                        <th className="py-3 px-5">{t('th_serial')}</th>
                        <th className="py-3 px-5">{t('th_app_no')}</th>
                        <th className="py-3 px-5">{t('th_applicant')}</th>
                        <th className="py-3 px-5">{t('th_service')}</th>
                        <th className="py-3 px-5">{t('th_income')}</th>
                        <th className="py-3 px-5">{t('th_status')}</th>
                        <th className="py-3 px-5">{t('th_date')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm cursor-pointer">
                      {filteredApplications.map((app, idx) => (
                        <tr key={app.id} onClick={() => openAppDetails(app)} className="hover:bg-blue-50/50 dark:hover:bg-slate-800/50 transition-colors">
                          <td className="py-3.5 px-5 text-slate-400 dark:text-slate-500">{idx + 1}</td>
                          <td className="py-3.5 px-5 font-bold text-slate-800 dark:text-slate-200">{app.appNo}</td>
                          <td className="py-3.5 px-5 text-slate-700 dark:text-slate-300">{localizeName(app.name, language)}</td>
                          <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400 text-xs max-w-[150px] truncate">{localizeService(app.service, language)}</td>
                          <td className="py-3.5 px-5 font-medium text-slate-800 dark:text-slate-200">{app.income}</td>
                          <td className="py-3.5 px-5">
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${app.statusColor}`}>
                              {getLocalizedStatus(app.status)}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-slate-500 dark:text-slate-400 text-xs">{app.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW: APPLICATION DETAILS / SCRUTINY --- */}
          {currentView === 'app_details' && selectedApp && (
            <div className="space-y-6">
              
              {/* Top Bar */}
              <div className="flex items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 transition-colors cursor-pointer">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-0.5">{t('details_crumb')}</div>
                    <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                      {t('app_no_label')} {selectedApp.appNo}
                    </h1>
                  </div>
                  <span className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${selectedApp.statusColor}`}>
                    {getLocalizedStatus(selectedApp.status)}
                  </span>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
                  {[
                    { id: 'verification' as const, label: t('tab_verification'), icon: FileSearch },
                    { id: 'ai_review' as const, label: t('tab_ai_review'), icon: BrainCircuit },
                    { id: 'decision' as const, label: t('tab_decision'), icon: CheckSquare }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer
                        ${activeTab === tab.id 
                          ? 'border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-400 bg-blue-50/30 dark:bg-blue-950/30' 
                          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/40'}
                      `}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content Container */}
                <div className="p-5 md:p-6 bg-slate-50/50 dark:bg-slate-950/50 min-h-[400px]">
                  
                  {/* --- TAB: VERIFICATION --- */}
                  {activeTab === 'verification' && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        
                        {/* Application Details Grid */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">{t('applicant_details_heading')}</h3>
                          <div className="grid grid-cols-3 gap-y-4 text-sm">
                            <div className="text-slate-500 dark:text-slate-400 font-medium">{t('applicant_name')}</div>
                            <div className="col-span-2 font-semibold text-slate-900 dark:text-slate-100">{localizeName(selectedApp.name, language)}</div>
                            
                            <div className="text-slate-500 dark:text-slate-400 font-medium">{t('father_name')}</div>
                            <div className="col-span-2 font-semibold text-slate-900 dark:text-slate-100">
                              {localizeName(selectedFullApp?.fatherName || 'रमेश प्रसाद', language)}
                            </div>
                            
                            <div className="text-slate-500 dark:text-slate-400 font-medium">{t('service_type')}</div>
                            <div className="col-span-2 font-semibold text-slate-900 dark:text-slate-100">{localizeService(selectedApp.service, language)}</div>
                            
                            <div className="text-slate-500 dark:text-slate-400 font-medium">{t('declared_income')}</div>
                            <div className="col-span-2 font-bold text-emerald-600 dark:text-emerald-400">{selectedApp.income} {t('per_year')}</div>
                            
                            <div className="text-slate-500 dark:text-slate-400 font-medium">{t('financial_year')}</div>
                            <div className="col-span-2 font-semibold text-slate-900 dark:text-slate-100">
                              {selectedFullApp?.financialYear || '2025-26'}
                            </div>
                            
                            <div className="text-slate-500 dark:text-slate-400 font-medium">{t('application_date')}</div>
                            <div className="col-span-2 font-semibold text-slate-900 dark:text-slate-100">{selectedApp.date}</div>
                            
                            <div className="text-slate-500 dark:text-slate-400 font-medium">{t('district_block')}</div>
                            <div className="col-span-2 font-semibold text-slate-900 dark:text-slate-100">
                              {localizeLocation(selectedFullApp?.district || 'पटना', language)} / {localizeLocation(selectedFullApp?.block || 'मसौढ़ी', language)}
                            </div>
                          </div>
                        </div>

                        {/* Document Status */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">{t('document_status_heading')}</h3>
                          <div className="space-y-3">
                            {(selectedFullApp?.documents && selectedFullApp.documents.length > 0
                              ? selectedFullApp.documents
                              : [
                                  { type: 'आवेदन पत्र', supplied: true },
                                  { type: 'पहचान पत्र (आधार)', supplied: true },
                                  { type: 'निवास प्रमाण पत्र', supplied: true },
                                  { type: 'बैंक पासबुक / वेतन पर्ची', supplied: !(selectedApp.id === 1 || selectedApp.id === 4) },
                                ]
                            ).map((doc, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/40">
                                <span className="font-medium text-slate-700 dark:text-slate-300">{localizeDocument(doc.type, language)}</span>
                                <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border
                                  ${doc.supplied ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800' : 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'}
                                `}>
                                  {doc.supplied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
                                  {doc.supplied ? t('doc_available') : t('doc_missing')}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Verification Results Summaries */}
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mb-3">{t('verification_results_heading')}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900 rounded-xl p-3 flex flex-col gap-1">
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">{t('income_declaration')}</span>
                            <span className="text-sm font-semibold text-emerald-800 dark:text-emerald-300 flex items-center gap-1"><Check className="w-4 h-4"/> {t('verified')}</span>
                          </div>
                          <div className={`${selectedApp.id === 1 || selectedApp.id === 4 ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900' : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900'} rounded-xl p-3 flex flex-col gap-1 border`}>
                            <span className={`text-[10px] ${selectedApp.id === 1 || selectedApp.id === 4 ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'} font-bold uppercase`}>{t('income_proof_source')}</span>
                            <span className={`text-sm font-semibold ${selectedApp.id === 1 || selectedApp.id === 4 ? 'text-rose-800 dark:text-rose-300' : 'text-emerald-800 dark:text-emerald-300'} flex items-center gap-1`}>
                              {selectedApp.id === 1 || selectedApp.id === 4 ? <><FileWarning className="w-4 h-4"/> {t('unverified')}</> : <><Check className="w-4 h-4"/> {t('doc_available')}</>}
                            </span>
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-100 dark:border-amber-900 rounded-xl p-3 flex flex-col gap-1">
                            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold uppercase">{t('income_authenticity')}</span>
                            <span className="text-sm font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-1"><AlertTriangle className="w-4 h-4"/> {t('needs_check')}</span>
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 rounded-xl p-3 text-xs text-amber-800 dark:text-amber-300 font-medium">
                            <span className="font-bold">{t('remark_heading')}</span> {selectedApp.id === 1 || selectedApp.id === 4 ? t('remark_missing_docs') : t('remark_docs_ok')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- TAB: AI REVIEW (Groq Powered) --- */}
                  {activeTab === 'ai_review' && (
                    <div className="space-y-4">
                      {/* Groq Header Status */}
                      <div className="flex items-center justify-between flex-wrap gap-2 px-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-700">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            {t('groq_badge')}
                          </span>
                          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                            {t('groq_model')}: {groqReview?.modelVersion || 'groq-openai/gpt-oss-120b'}
                          </span>
                        </div>

                        <button
                          onClick={() => loadGroqReview(selectedApp.appNo, true)}
                          disabled={isLoadingGroq}
                          className="inline-flex items-center gap-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg shadow-xs transition-all cursor-pointer disabled:opacity-60"
                        >
                          <BrainCircuit className={`w-3.5 h-3.5 text-blue-600 dark:text-blue-400 ${isLoadingGroq ? 'animate-spin' : ''}`} />
                          {isLoadingGroq ? t('groq_checking_btn') : t('groq_recheck_btn')}
                        </button>
                      </div>

                      {/* AI Summary Header */}
                      <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900 rounded-xl p-5 shadow-sm flex items-start gap-4">
                        <div className="p-3 bg-blue-600 text-white rounded-xl shadow-sm shrink-0">
                          <BrainCircuit className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-sm font-bold text-blue-900 dark:text-blue-300">{t('ai_summary_heading')}</h3>
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold bg-blue-100/60 dark:bg-blue-900/60 px-2 py-0.5 rounded">
                              {t('ai_report_pill')}
                            </span>
                          </div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                            {language === 'en' && groqReview?.summaryEnglish ? (
                              groqReview.summaryEnglish
                            ) : groqReview?.summaryHindi ? (
                              groqReview.summaryHindi
                            ) : language === 'en' ? (
                              <>
                                Applicant <strong>{localizeName(selectedApp.name, 'en')}</strong> has applied for {localizeService(selectedApp.service, 'en')}.
                                Declared annual income is <strong>{selectedApp.income}</strong>. {selectedApp.id === 1 || selectedApp.id === 4
                                  ? 'Primary proof of income source (salary slip / bank passbook) is not attached.'
                                  : 'All attached verification records are valid.'}
                              </>
                            ) : (
                              <>
                                आवेदक <strong>{selectedApp.name}</strong> ने {selectedApp.service} के लिए आवेदन किया है।
                                घोषित आय <strong>{selectedApp.income}</strong> है। {selectedApp.id === 1 || selectedApp.id === 4
                                  ? 'आय संबंधी मुख्य साक्ष्य (वेतन पर्ची / बैंक पासबुक) संलग्न नहीं पाया गया।'
                                  : 'सभी संलग्न साक्ष्य सत्यापन योग्य हैं।'}
                              </>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* AI Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Left: Issues */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5">
                          <div>
                            <h4 className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-sm mb-2">
                              <ShieldAlert className="w-4 h-4" /> {t('main_issues_heading')}
                            </h4>
                            {groqReview && (groqReview.missingEvidence?.length > 0 || (language === 'en' && groqReview.missingEvidenceEnglish?.length)) ? (
                              <div className="bg-rose-50 dark:bg-rose-950/40 rounded-lg p-3 text-sm text-rose-900 dark:text-rose-300 border border-rose-100 dark:border-rose-900">
                                <div className="font-semibold mb-1">{t('missing_docs_label')}</div>
                                <ul className="list-disc pl-5 space-y-1 text-rose-800 dark:text-rose-300">
                                  {(language === 'en' && groqReview.missingEvidenceEnglish?.length
                                    ? groqReview.missingEvidenceEnglish
                                    : groqReview.missingEvidence
                                  ).map((item, idx) => (
                                    <li key={idx}>{localizeDocument(item, language)}</li>
                                  ))}
                                </ul>
                              </div>
                            ) : (
                              <div className="bg-emerald-50 dark:bg-emerald-950/40 rounded-lg p-3 text-sm text-emerald-900 dark:text-emerald-300 border border-emerald-100 dark:border-emerald-900">
                                {t('no_issues_found')}
                              </div>
                            )}
                          </div>

                          <div>
                            <h4 className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-sm mb-2">
                              <AlertTriangle className="w-4 h-4" /> {t('inconsistencies_heading')}
                            </h4>
                            <div className="text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                              {groqReview && (groqReview.inconsistencies?.length > 0 || (language === 'en' && groqReview.inconsistenciesEnglish?.length)) ? (
                                <ul className="list-disc pl-5 space-y-1 text-slate-700 dark:text-slate-300">
                                  {(language === 'en' && groqReview.inconsistenciesEnglish?.length
                                    ? groqReview.inconsistenciesEnglish
                                    : groqReview.inconsistencies
                                  ).map((inc, idx) => (
                                    <li key={idx}>{inc}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p>{t('no_inconsistencies')}</p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-5">
                          <div>
                            <h4 className="flex items-center gap-2 text-blue-800 dark:text-blue-400 font-bold text-sm mb-2">
                              <CheckCircle2 className="w-4 h-4" /> {t('suggested_action_heading')}
                            </h4>
                            <div className="bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900 rounded-lg p-3 text-sm text-blue-900 dark:text-blue-300 font-medium">
                              {groqReview?.suggestedAction === 'RETURN' || selectedApp.id === 1 || selectedApp.id === 4 ? (
                                t('suggest_return_msg')
                              ) : (
                                t('suggest_approve_msg')
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-slate-600 dark:text-slate-400 font-bold text-sm mb-1">{t('reasons_heading')}</h4>
                            <ul className="text-sm text-slate-700 dark:text-slate-300 list-disc pl-5 space-y-1">
                              {(language === 'en' && groqReview?.reasonsEnglish?.length
                                ? groqReview.reasonsEnglish
                                : groqReview?.reasonsHindi?.length
                                ? groqReview.reasonsHindi
                                : [t('reason_all_ok')]
                              ).map((reason, idx) => (
                                <li key={idx}>{reason}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-slate-100 dark:bg-slate-800/80 p-3 rounded-lg flex gap-2 items-start text-xs text-slate-500 dark:text-slate-400">
                            <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400 dark:text-slate-500" />
                            <p>
                              {t('ai_note')} {t('ai_citation_prefix')}{' '}
                              {(language === 'en' && groqReview?.evidenceReferencesEnglish?.length
                                ? groqReview.evidenceReferencesEnglish
                                : groqReview?.evidenceReferences
                              )?.join(' | ') || (language === 'en' ? 'Bihar RTPS Act, 2011' : 'बिहार RTPS अधिनियम 2011')}।
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* --- TAB: DECISION & HISTORY (Neon DB Connected) --- */}
                  {activeTab === 'decision' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      
                      {/* Left: Decision Form */}
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col overflow-hidden">
                        <div className="bg-[#0f3057] dark:bg-[#081b33] px-5 py-3 text-white flex justify-between items-center">
                          <h3 className="font-bold text-base">{t('decision_form_heading')}</h3>
                          <span className="text-xs bg-blue-800 text-blue-100 px-2 py-0.5 rounded font-medium">
                            {t('dsc_badge')}
                          </span>
                        </div>
                        <div className="p-5 space-y-4 flex-1">
                          
                          <div className="grid grid-cols-2 gap-2 text-sm bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                            <div className="text-slate-500 dark:text-slate-400 font-medium">{t('app_no_label')}</div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">{selectedApp.appNo}</div>
                            <div className="text-slate-500 dark:text-slate-400 font-medium">{t('applicant_name')}:</div>
                            <div className="font-bold text-slate-900 dark:text-slate-100">{localizeName(selectedApp.name, language)}</div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('decision_action_label')} <span className="text-rose-500">*</span></label>
                            <div className="relative">
                              <select 
                                id="app-decision-select"
                                value={
                                  appDecisionAction === 'APPROVE'
                                    ? t('opt_approve')
                                    : appDecisionAction === 'REJECT'
                                    ? t('opt_reject')
                                    : t('opt_return')
                                }
                                onChange={(e) => handleAppDecisionActionChange(e.target.value)}
                                className="w-full appearance-none bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-2.5 shadow-sm font-medium"
                              >
                                <option>{t('opt_approve')}</option>
                                <option>{t('opt_return')}</option>
                                <option>{t('opt_reject')}</option>
                              </select>
                              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('decision_reason_label')} <span className="text-rose-500">*</span></label>
                            <textarea 
                              id="app-decision-reason"
                              className="w-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block px-3 py-2.5 shadow-sm"
                              rows={3}
                              value={appDecisionReason}
                              onChange={(e) => setAppDecisionReason(e.target.value)}
                            />
                          </div>

                          {appDecisionAction === 'RETURN' ? (
                            <div className="space-y-1.5">
                              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">{t('applicant_instructions_label')}</label>
                              <textarea 
                                id="app-decision-corrections"
                                className="w-full bg-amber-50/50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-slate-800 dark:text-slate-100 text-sm rounded-lg focus:ring-amber-500 focus:border-amber-500 block px-3 py-2.5 shadow-sm"
                                rows={3}
                                value={appDecisionCorrections}
                                onChange={(e) => setAppDecisionCorrections(e.target.value)}
                              />
                            </div>
                          ) : (
                            <div className="p-3 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/50 text-xs text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-2">
                              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
                              <span>{t('no_correction_needed')}</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-slate-50 dark:bg-slate-850 p-4 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3">
                          <button 
                            onClick={() => setCurrentView('dashboard')}
                            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 shadow-sm cursor-pointer"
                          >
                            {t('btn_cancel')}
                          </button>
                          <button 
                            onClick={handleDecisionSubmit}
                            disabled={isSubmittingDecision}
                            className="px-5 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-700 shadow-sm cursor-pointer disabled:opacity-60"
                          >
                            {isSubmittingDecision ? t('btn_submitting') : t('btn_submit_decision')}
                          </button>
                        </div>
                      </div>

                      {/* Right: Dynamic Decision History Timeline */}
                      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 flex flex-col">
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-6">
                          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
                            <History className="w-5 h-5 text-slate-400" /> {t('history_heading')}
                          </h3>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {loadingAudit ? t('loading_history') : `${t('entries_count')} ${auditEvents.length}`}
                          </span>
                        </div>
                        
                        {loadingAudit && auditEvents.length === 0 ? (
                          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                            {t('loading_history')}
                          </div>
                        ) : auditEvents.length === 0 ? (
                          <div className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                            {t('no_history')}
                          </div>
                        ) : (
                          <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-3 md:ml-4 space-y-7 pb-4">
                            {auditEvents.map((event, idx) => {
                              const type = event.eventType.toUpperCase();
                              const isReturn = type.includes('RETURN');
                              const isApprove = type.includes('APPROV');
                              const isReject = type.includes('REJECT');
                              const isAi = type.includes('AI');

                              const dateStr = event.createdAt
                                ? new Date(event.createdAt).toLocaleString(language === 'hi' ? 'hi-IN' : 'en-US', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })
                                : selectedApp.date;

                              return (
                                <div key={idx} className="relative pl-6 md:pl-8">
                                  <div
                                    className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                      isReturn
                                        ? 'border-indigo-500 bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:border-indigo-400'
                                        : isApprove
                                          ? 'border-emerald-500 bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:border-emerald-400'
                                          : isReject
                                            ? 'border-rose-500 bg-rose-100 text-rose-600 dark:bg-rose-950 dark:border-rose-400'
                                            : isAi
                                              ? 'border-blue-500 bg-blue-100 text-blue-600 dark:bg-blue-950 dark:border-blue-400'
                                              : 'border-slate-400 bg-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-500'
                                    }`}
                                  >
                                    {isReturn ? (
                                      <RotateCcw className="w-3 h-3" />
                                    ) : isApprove ? (
                                      <CheckCircle2 className="w-3 h-3" />
                                    ) : isReject ? (
                                      <XCircle className="w-3 h-3" />
                                    ) : isAi ? (
                                      <BrainCircuit className="w-3 h-3" />
                                    ) : (
                                      <Clock className="w-3 h-3" />
                                    )}
                                  </div>

                                  <div className="mb-1">
                                    <span
                                      className={`font-bold text-xs px-2 py-0.5 rounded border ${
                                        isReturn
                                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800'
                                          : isApprove
                                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800'
                                            : isReject
                                              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800'
                                              : isAi
                                                ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800'
                                                : 'bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700'
                                      }`}
                                    >
                                      {isReturn
                                        ? t('event_return_badge')
                                        : isApprove
                                          ? t('event_approve_badge')
                                          : isReject
                                            ? t('event_reject_badge')
                                            : isAi
                                              ? t('event_ai_badge')
                                              : t('event_received_badge')}
                                    </span>
                                  </div>

                                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 space-y-0.5">
                                    <div>{dateStr}</div>
                                    <div className="font-medium text-slate-600 dark:text-slate-300">{t('actor_label')} {localizeName(event.actorId, language)}</div>
                                  </div>

                                  {event.reason && (
                                    <div className="bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300">
                                      <span className="font-semibold text-slate-800 dark:text-slate-200">{t('details_label')}</span> {event.reason}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              </div>
            </div>
          )}

          {/* --- VIEW: GUIDELINES & RULES --- */}
          {currentView === 'guidelines' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400" /> {t('guidelines_page_title')}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {t('guidelines_page_sub')}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                  <Scale className="w-4 h-4" /> {t('statutory_badge')}
                </span>
              </div>

              {/* Service SLA & Authority Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('sla_label')}</div>
                  <div className="text-2xl font-black text-blue-700 dark:text-blue-400">{t('sla_val')}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t('sla_desc')}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('authority_label')}</div>
                  <div className="text-2xl font-black text-slate-800 dark:text-slate-200">{t('authority_val')}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t('authority_desc')}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                  <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{t('appellate_label')}</div>
                  <div className="text-2xl font-black text-emerald-700 dark:text-emerald-400">{t('appellate_val')}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{t('appellate_desc')}</p>
                </div>
              </div>

              {/* Legal Guidelines List */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> {t('guidelines_sec1_title')}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{t('guidelines_general_title')}</div>
                      <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400 text-xs">
                        <li>{language === 'hi' ? 'स्वघोषणा पत्र (Form I) विधिवत हस्ताक्षरित।' : 'Self-declaration affidavit (Form I) duly signed.'}</li>
                        <li>{language === 'hi' ? 'पहचान पत्र (आधार कार्ड / मतदाता पहचान पत्र)।' : 'Identity proof (Aadhaar Card / Voter ID).'}</li>
                        <li>{language === 'hi' ? 'निवास प्रमाण पत्र (अद्यतन)।' : 'Proof of residence (updated).'}</li>
                        <li>{language === 'hi' ? 'वेतन भोगी होने की स्थिति में फॉर्म 16 / वेतन पर्ची।' : 'Form 16 / Salary slip for salaried applicants.'}</li>
                        <li>{language === 'hi' ? 'कृषि/व्यवसाय हेतु अंचल अमीन / राजस्व कर्मचारी का प्रतिवेदन।' : 'Revenue Karamchari inquiry report for agriculture/business.'}</li>
                      </ul>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 space-y-2">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{t('guidelines_ews_title')}</div>
                      <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-400 text-xs">
                        <li>{language === 'hi' ? 'पारिवारिक सकल वार्षिक आय ₹ 8,00,000/- से कम हो।' : 'Gross annual family income must be below ₹ 8,00,000.'}</li>
                        <li>{language === 'hi' ? '5 एकड़ अथवा उससे अधिक कृषि भूमि न हो।' : 'Must not possess 5 acres or more agricultural land.'}</li>
                        <li>{language === 'hi' ? '1,000 वर्ग फुट अथवा अधिक का आवासीय फ्लैट न हो।' : 'Must not possess residential flat of 1,000 sq.ft. or above.'}</li>
                        <li>{language === 'hi' ? 'अधिसूचित नगरपालिकाओं में 100 वर्ग गज से अधिक का भूखंड न हो।' : 'Plot ceiling: under 100 sq.yards in notified municipalities.'}</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">{t('guidelines_sec2_title')}</h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                    {t('guidelines_sec2_desc')}
                  </p>
                  <div className="bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-xl text-xs text-amber-900 dark:text-amber-300 space-y-1.5">
                    <div className="font-bold">{t('guidelines_return_rule_title')}</div>
                    <p>{t('guidelines_return_rule_1')}</p>
                    <p>{t('guidelines_return_rule_2')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- VIEW: PROFILE --- */}
          {currentView === 'profile' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              {/* Profile Header Banner */}
              <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="h-28 bg-gradient-to-r from-blue-900 via-blue-800 to-[#0f3057]" />
                <div className="px-6 pb-6 pt-0 relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12">
                  <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 border-4 border-white dark:border-slate-900 shadow-md flex items-center justify-center text-white text-3xl font-bold shrink-0">
                      <User className="w-12 h-12" />
                    </div>
                    <div className="pt-2">
                      <div className="flex items-center justify-center sm:justify-start gap-2">
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('officer_name')}</h1>
                        <span title="सत्यापित अधिकारी">
                          <BadgeCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-blue-700 dark:text-blue-400">{t('officer_full_role')}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {t('profile_office_desc')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      {t('active_duty_badge')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Officer Performance Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-semibold">{t('stat_disposed_title')}</span>
                    <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">412</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">{t('stat_disposed_sub')}</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-semibold">{t('stat_approved_title')}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats[2].count}</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-1">{t('stat_approved_sub')}</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-semibold">{t('stat_avg_time_title')}</span>
                    <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('stat_avg_time_val')}</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">{t('stat_avg_time_sub')}</div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-1">
                    <span className="text-xs font-semibold">{t('stat_compliance_title')}</span>
                    <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('stat_compliance_val')}</div>
                  <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium mt-1">{t('stat_compliance_sub')}</div>
                </div>
              </div>

              {/* Detailed Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Official Information */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" /> {t('profile_official_heading')}
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">{t('emp_code_label')}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">BR-REV-2019-8472</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">{t('cadre_label')}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{t('cadre_val')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">{t('office_label')}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{t('office_val')}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400">{t('district_zone_label')}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{t('district_zone_val')}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500 dark:text-slate-400">{t('posting_date_label')}</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{t('posting_date_val')}</span>
                    </div>
                  </div>
                </div>

                {/* Contact & Security */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> {t('profile_security_heading')}
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {t('email_label')}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">rajesh.kumar@bihar.gov.in</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {t('mobile_label')}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">+91 98351 04829</span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {t('dsc_label')}
                      </span>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300">
                        {t('dsc_val')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-1 border-b border-slate-50 dark:border-slate-800">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {t('last_login_label')}
                      </span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200 text-xs">27-10-2026, 09:42 AM</span>
                    </div>
                    <div className="flex items-center justify-between py-1">
                      <span className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400 dark:text-slate-500" /> {t('network_label')}
                      </span>
                      <span className="font-semibold text-slate-700 dark:text-slate-300 text-xs">10.142.68.22 (NICNET)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Authorized Roles & Permissions */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 pb-2 border-b border-slate-100 dark:border-slate-800">
                  {t('auth_services_heading')}
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-blue-50/60 dark:bg-blue-950/40 rounded-xl border border-blue-100 dark:border-blue-900">
                    <div className="text-xs font-bold text-blue-900 dark:text-blue-300">{t('auth_service_1_title')}</div>
                    <p className="text-[11px] text-blue-700 dark:text-blue-400 mt-1">{t('auth_service_1_desc')}</p>
                  </div>
                  <div className="p-3 bg-emerald-50/60 dark:bg-emerald-950/40 rounded-xl border border-emerald-100 dark:border-emerald-900">
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-300">{t('auth_service_2_title')}</div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 mt-1">{t('auth_service_2_desc')}</p>
                  </div>
                  <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900">
                    <div className="text-xs font-bold text-indigo-900 dark:text-indigo-300">{t('auth_service_3_title')}</div>
                    <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mt-1">{t('auth_service_3_desc')}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
