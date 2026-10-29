export type Language = "hi" | "en";

export const translations = {
  hi: {
    // Header & Branding
    gov_bihar: "बिहार सरकार",
    dept_name: "राजस्व एवं भूमि सुधार विभाग",
    app_title: "जनसेवा सहायक",
    app_subtitle: "आय प्रमाण पत्र समीक्षा प्रणाली",
    officer_name: "राजेश कुमार",
    officer_role: "नामित अधिकारी",
    officer_full_role: "नामित राजस्व अधिकारी (Designated Officer)",
    logout: "लॉगआउट",
    login: "लॉग इन करें",
    username: "उपयोगकर्ता नाम",
    password: "पासवर्ड",
    demo_hint: "डेमो के लिए: officer / officer123",
    neon_connected: "Neon PostgreSQL लाइव कनेक्टेड",
    neon_db: "Neon DB",

    // Navigation Menu
    nav_dashboard: "डैशबोर्ड",
    nav_applications: "आवेदन सूची",
    nav_scrutiny: "समीक्षा हेतु",
    nav_decisions: "निर्णय इतिहास",
    nav_guidelines: "नियम एवं दिशानिर्देश",
    nav_profile: "प्रोफ़ाइल",
    support_title: "सहायता एवं समर्थन",
    support_timing: "सोम - शुक्र (9:00 AM - 6:00 PM)",

    // Dashboard & Stats
    dashboard_title: "डैशबोर्ड",
    dashboard_subtitle: "आय प्रमाण पत्र आवेदनों की स्थिति एवं प्राथमिकता",
    total_apps: "कुल आवेदन",
    pending_apps: "लंबित (Pending)",
    approved_apps: "स्वीकृत",
    rejected_apps: "अस्वीकृत",
    returned_apps: "वापस किए गए",
    today_priority: "आज की प्राथमिकता",
    today_priority_sub: "आज की प्राथमिकता (Immediate Scrutiny)",
    displayed_apps: "प्रदर्शित: 5 आवेदन",
    total_count_label: "कुल",

    // Application List View
    app_list_title: "आवेदन सूची",
    app_list_pending_title: "समीक्षा हेतु लंबित आवेदन",
    app_list_decided_title: "निस्तारित निर्णय सूची",
    app_list_all_title: "समस्त आवेदन सूची",
    total_displayed_count: "कुल प्रदर्शित आवेदन:",
    search_placeholder: "आवेदन संख्या / आवेदक का नाम",
    filter_btn: "फ़िल्टर",
    filter_active: "फ़िल्टर सक्रिय",

    // Table Headers
    th_serial: "क्रम",
    th_app_no: "आवेदन संख्या",
    th_applicant: "आवेदक का नाम",
    th_service: "सेवा प्रकार",
    th_income: "आय (घोषित)",
    th_status: "स्थिति",
    th_date: "दिनांक",
    th_action: "कार्रवाई",
    btn_review: "समीक्षा करें",

    // Status Badges
    status_pending: "लंबित",
    status_review_needed: "जाँच आवश्यक",
    status_returned: "वापस किया गया",
    status_approved: "स्वीकृत",
    status_rejected: "अस्वीकृत",

    // Application Details / Scrutiny View
    details_crumb: "आवेदन विवरण / समीक्षा पृष्ठ",
    app_no_label: "आवेदन संख्या:",
    tab_verification: "सत्यापन",
    tab_ai_review: "AI समीक्षा (Groq)",
    tab_decision: "निर्णय / इतिहास",

    // Verification Tab
    applicant_details_heading: "आवेदन विवरण",
    applicant_name: "आवेदक का नाम",
    father_name: "पिता का नाम",
    service_type: "सेवा प्रकार",
    declared_income: "घोषित आय",
    per_year: "प्रति वर्ष",
    financial_year: "वित्तीय वर्ष",
    application_date: "आवेदन तिथि",
    district_block: "जिला / प्रखंड",
    document_status_heading: "दस्तावेज़ स्थिति",
    doc_available: "उपलब्ध",
    doc_missing: "मिल नहीं रहा",
    doc_form: "आवेदन पत्र",
    doc_aadhar: "पहचान पत्र (आधार)",
    doc_residence: "निवास प्रमाण पत्र",
    doc_income_proof: "बैंक पासबुक / वेतन पर्ची",
    doc_old_income: "आय प्रमाण पत्र (पुराना)",
    verification_results_heading: "सत्यापन परिणाम",
    income_declaration: "आय घोषणा",
    income_proof_source: "आय स्रोत दस्तावेज़",
    income_authenticity: "आय की प्रामाणिकता",
    verified: "सत्यापित",
    unverified: "अनुपलब्ध",
    needs_check: "जाँच आवश्यक",
    remark_heading: "टिप्पणी:",
    remark_missing_docs: "आय संबंधी आवश्यक दस्तावेज़ (पासबुक/वेतन पर्ची) उपलब्ध नहीं है। अतिरिक्त जाँच की आवश्यकता है।",
    remark_docs_ok: "दस्तावेज़ उपलब्ध हैं, अधिकारी द्वारा मानवीय समीक्षा अपेक्षित है।",

    // AI Review Tab (Groq)
    groq_badge: "Groq AI Llama / GPT-OSS सक्षम",
    groq_model: "मॉडल",
    groq_recheck_btn: "Groq AI से पुनः जाँच करें",
    groq_checking_btn: "Groq AI विश्लेषण कर रहा है...",
    ai_summary_heading: "संक्षिप्त सारांश (हिंदी)",
    ai_report_pill: "AI Scrutiny Report",
    main_issues_heading: "मुख्य मुद्दे",
    missing_docs_label: "अनुपलब्ध दस्तावेज़:",
    no_issues_found: "कोई गंभीर कमी नहीं पाई गई। सभी आवश्यक साक्ष्य संलग्न हैं।",
    inconsistencies_heading: "असंगतियां",
    no_inconsistencies: "घोषित आय एवं संलग्न साक्ष्यों में कोई प्रत्यक्ष असंगतता नहीं पाई गई।",
    suggested_action_heading: "सुझावित कार्रवाई",
    suggest_return_msg: "• आवेदन को दस्तावेज़ सुधार हेतु वापस करने (Return) पर विचार करें।",
    suggest_approve_msg: "• आवेदन की स्वीकृति (Approval) पर विचार किया जा सकता है।",
    reasons_heading: "कारण",
    reason_missing_proof: "आय संबंधी आवश्यक दस्तावेज़ उपलब्ध नहीं है।",
    reason_unverified_income: "इससे आय की प्रामाणिकता की पुष्टि नहीं हो पाई है।",
    reason_all_ok: "सभी आवश्यक दस्तावेज़ संलग्न पाए गए हैं एवं सत्यापन में कोई प्रतिकूल प्रविष्टि नहीं है।",
    ai_note: "नोट: Groq AI केवल उपलब्ध जानकारी के आधार पर सुझाव देता है। अंतिम निर्णय अधिकारी द्वारा लिया जाएगा।",
    ai_citation_prefix: "संदर्भ:",

    // Decision & History Tab
    decision_form_heading: "निर्णय लें",
    dsc_badge: "डिजिटल हस्ताक्षर सक्षम",
    decision_action_label: "कार्रवाई",
    opt_return: "वापस करें (Return for Correction)",
    opt_approve: "स्वीकृत करें (Approve)",
    opt_reject: "अस्वीकृत करें (Reject)",
    decision_reason_label: "कारण",
    default_return_reason: "आय संबंधी आवश्यक दस्तावेज़ (बैंक पासबुक / वेतन पर्ची) संलग्न नहीं है।",
    default_approve_reason: "सभी आवश्यक पहचान, निवास एवं आय संबंधी दस्तावेज़ संलग्न एवं सत्यापित पाए गए। घोषित आय विहित सीमा के अंतर्गत है।",
    default_reject_reason: "प्रस्तुत साक्ष्य एवं घोषित आय के आधार पर आवेदक निर्धारित पात्रता मानकों को पूरा नहीं करते हैं।",
    applicant_instructions_label: "सुधार हेतु अनुरोध (आवेदक के लिए)",
    no_correction_needed: "स्वीकृति अथवा अस्वीकृति के लिए सुधार अनुरोध आवश्यक नहीं है।",
    default_correction_request: "1. अद्यतन बैंक स्टेटमेंट या वेतन पर्ची की प्रति संलग्न करें।\n2. दस्तावेज़ स्पष्ट रूप से पठनीय होने चाहिए।",
    btn_cancel: "रद्द करें",
    btn_submit_decision: "निर्णय सबमिट करें",
    btn_submitting: "सबमिट हो रहा है...",
    history_heading: "निर्णय इतिहास",
    entries_count: "प्रविष्टियां:",
    loading_history: "निर्णय इतिहास लोड हो रहा है...",
    no_history: "कोई पूर्व निर्णय दर्ज नहीं है।",
    actor_label: "अधिकारी / कर्ता:",
    details_label: "विवरण:",
    event_return_badge: "वापस किया गया (Return)",
    event_approve_badge: "स्वीकृत (Approved)",
    event_reject_badge: "अस्वीकृत (Rejected)",
    event_ai_badge: "AI समीक्षा पूर्ण (Groq Scrutiny)",
    event_received_badge: "आवेदन प्राप्त (RTPS Portal)",
    event_verif_badge: "प्रारंभिक सत्यापन",

    // RTPS Guidelines View
    guidelines_page_title: "RTPS नियम एवं दिशानिर्देश",
    guidelines_page_sub: "बिहार लोक सेवाओं का अधिकार (RTPS) अधिनियम, 2011 · आय प्रमाण पत्र निर्गमन नियमावली",
    statutory_badge: "वैधानिक निर्देश",
    sla_label: "समय सीमा (SLA)",
    sla_val: "14 कार्य दिवस",
    sla_desc: "आवेदन प्राप्ति से प्रमाण पत्र निर्गमन की विहित अधिकतम सीमा।",
    authority_label: "नामित प्राधिकारी",
    authority_val: "राजस्व अधिकारी",
    authority_desc: "अंचल कार्यालय स्तर पर प्रमाण पत्र निर्गत करने हेतु सक्षम अधिकारी।",
    appellate_label: "प्रथम अपील प्राधिकारी",
    appellate_val: "अंचलाधिकारी (CO)",
    appellate_desc: "30 दिवस के भीतर निर्गमन न होने पर प्रथम अपीलीय मंच।",
    guidelines_sec1_title: "1. आवश्यक साक्ष्य एवं जाँच बिंदु",
    guidelines_general_title: "सामान्य आय प्रमाण पत्र",
    guidelines_ews_title: "EWS आय एवं संपत्ति प्रमाण पत्र",
    guidelines_sec2_title: "2. आवेदन अस्वीकृति एवं वापसी के नियम",
    guidelines_sec2_desc: "अधिनियम के तहत किसी भी आवेदन को बिना स्पष्ट एवं युक्तिसंगत कारण के अस्वीकृत नहीं किया जा सकता।",
    guidelines_return_rule_title: "वापसी (Return for Correction) की स्थिति में:",
    guidelines_return_rule_1: "• आवेदक को कौन-सा दस्तावेज़ संलग्न करना है, इसका स्पष्ट विवरण पोर्टल पर अंकित करना अनिवार्य है।",
    guidelines_return_rule_2: "• सुधार उपरांत प्राप्त आवेदन को मूल प्राथमिकता के अनुसार 7 दिवस के भीतर निस्तारित किया जाना चाहिए।",

    // Officer Profile View
    profile_office_desc: "राजस्व एवं भूमि सुधार विभाग · अंचल कार्यालय, मसौढ़ी (पटना)",
    active_duty_badge: "सक्रिय ड्यूटी (On Duty)",
    stat_disposed_title: "कुल निस्तारित",
    stat_disposed_sub: "आय प्रमाण पत्र आवेदन",
    stat_approved_title: "माह में स्वीकृत",
    stat_approved_sub: "अक्टूबर 2026",
    stat_avg_time_title: "औसत निस्तारण समय",
    stat_avg_time_val: "2.4 दिन",
    stat_avg_time_sub: "SLA सीमा: 14 दिन",
    stat_compliance_title: "समयबद्धता अनुपालन",
    stat_compliance_val: "98.6%",
    stat_compliance_sub: "RTPS श्रेणी A",
    profile_official_heading: "आधिकारिक एवं पदस्थापना विवरण",
    emp_code_label: "कर्मचारी कोड (Employee ID)",
    cadre_label: "संवर्ग (Cadre)",
    cadre_val: "बिहार प्रशासनिक सेवा / राजस्व संवर्ग",
    office_label: "कार्यालय (Posting Office)",
    office_val: "अंचल कार्यालय, मसौढ़ी",
    district_zone_label: "जिला / प्रमंडल",
    district_zone_val: "पटना / पटना प्रमंडल",
    posting_date_label: "वर्तमान पदस्थापन तिथि",
    posting_date_val: "12 जून 2023",
    profile_security_heading: "संपर्क एवं सुरक्षा साख",
    email_label: "ईमेल",
    mobile_label: "शासकीय मोबाइल",
    dsc_label: "डिजिटल हस्ताक्षर (DSC)",
    dsc_val: "सत्यापित (वैध: 2027)",
    last_login_label: "अंतिम लॉगिन",
    network_label: "आईपी / नेटवर्क",
    auth_services_heading: "अधिकृत सेवाएं एवं क्षेत्राधिकार (Authorized RTPS Services)",
    auth_service_1_title: "सामान्य आय प्रमाण पत्र",
    auth_service_1_desc: "अंतिम समीक्षा, स्वीकृति एवं डिजिटल निर्गमन प्राधिकार",
    auth_service_2_title: "EWS आय एवं संपत्ति प्रमाण पत्र",
    auth_service_2_desc: "परिसंपत्ति मूल्यांकन एवं सक्षम प्राधिकार अनुमोदन",
    auth_service_3_title: "दस्तावेज़ सुधार एवं अपील",
    auth_service_3_desc: "अपूर्ण आवेदनों पर पुनः समीक्षा एवं आपत्ति निराकरण",

    // Feedback messages
    msg_decision_success: "निर्णय सफलतापूर्वक सबमिट किया गया और Neon DB में दर्ज हुआ:",
    msg_review_opened: "समीक्षा पृष्ठ खुला:",
    toggle_hindi: "हिंदी",
    toggle_english: "English",
  },

  en: {
    // Header & Branding
    gov_bihar: "Government of Bihar",
    dept_name: "Department of Revenue & Land Reforms",
    app_title: "JanSeva Sahayak",
    app_subtitle: "Income Certificate Scrutiny Portal",
    officer_name: "Rajesh Kumar",
    officer_role: "Designated Officer",
    officer_full_role: "Designated Revenue Officer",
    logout: "Logout",
    login: "Log In",
    username: "Username",
    password: "Password",
    demo_hint: "For demo: officer / officer123",
    neon_connected: "Neon PostgreSQL Live Connected",
    neon_db: "Neon DB",

    // Navigation Menu
    nav_dashboard: "Dashboard",
    nav_applications: "Applications List",
    nav_scrutiny: "For Scrutiny",
    nav_decisions: "Decision History",
    nav_guidelines: "Rules & Guidelines",
    nav_profile: "Profile",
    support_title: "Help & Support",
    support_timing: "Mon - Fri (9:00 AM - 6:00 PM)",

    // Dashboard & Stats
    dashboard_title: "Dashboard",
    dashboard_subtitle: "Status and priority of income certificate applications",
    total_apps: "Total Applications",
    pending_apps: "Pending Scrutiny",
    approved_apps: "Approved",
    rejected_apps: "Rejected",
    returned_apps: "Returned for Correction",
    today_priority: "Today's Priority",
    today_priority_sub: "Today's Priority (Immediate Scrutiny)",
    displayed_apps: "Showing: 5 applications",
    total_count_label: "Total",

    // Application List View
    app_list_title: "Applications List",
    app_list_pending_title: "Pending Applications for Scrutiny",
    app_list_decided_title: "Disposed Decisions List",
    app_list_all_title: "All Applications List",
    total_displayed_count: "Total applications displayed:",
    search_placeholder: "Application No. / Applicant Name",
    filter_btn: "Filter",
    filter_active: "Filter Active",

    // Table Headers
    th_serial: "Sl.",
    th_app_no: "Application No.",
    th_applicant: "Applicant Name",
    th_service: "Service Type",
    th_income: "Declared Income",
    th_status: "Status",
    th_date: "Date",
    th_action: "Action",
    btn_review: "Review",

    // Status Badges
    status_pending: "Pending",
    status_review_needed: "Scrutiny Required",
    status_returned: "Returned",
    status_approved: "Approved",
    status_rejected: "Rejected",

    // Application Details / Scrutiny View
    details_crumb: "Application Details / Scrutiny View",
    app_no_label: "Application No.:",
    tab_verification: "Verification",
    tab_ai_review: "AI Scrutiny (Groq)",
    tab_decision: "Decision / History",

    // Verification Tab
    applicant_details_heading: "Application Details",
    applicant_name: "Applicant Name",
    father_name: "Father's Name",
    service_type: "Service Type",
    declared_income: "Declared Income",
    per_year: "per annum",
    financial_year: "Financial Year",
    application_date: "Submission Date",
    district_block: "District / Block",
    document_status_heading: "Document Status",
    doc_available: "Available",
    doc_missing: "Missing",
    doc_form: "Application Form",
    doc_aadhar: "Identity Proof (Aadhaar)",
    doc_residence: "Residence Certificate",
    doc_income_proof: "Bank Passbook / Salary Slip",
    doc_old_income: "Previous Income Certificate",
    verification_results_heading: "Verification Results",
    income_declaration: "Income Declaration",
    income_proof_source: "Income Proof Source",
    income_authenticity: "Income Authenticity",
    verified: "Verified",
    unverified: "Missing",
    needs_check: "Action Required",
    remark_heading: "Remark:",
    remark_missing_docs: "Required income proof document (passbook/salary slip) is not attached. Further scrutiny is required.",
    remark_docs_ok: "All documents attached. Officer manual scrutiny and approval recommended.",

    // AI Review Tab (Groq)
    groq_badge: "Groq AI Llama / GPT-OSS Enabled",
    groq_model: "Model",
    groq_recheck_btn: "Re-analyze with Groq AI",
    groq_checking_btn: "Groq AI is analyzing...",
    ai_summary_heading: "Executive Scrutiny Summary",
    ai_report_pill: "AI Scrutiny Report",
    main_issues_heading: "Key Issues",
    missing_docs_label: "Missing Documents:",
    no_issues_found: "No critical deficiencies found. All required documents are attached.",
    inconsistencies_heading: "Inconsistencies",
    no_inconsistencies: "No direct inconsistency found between declared income and attached records.",
    suggested_action_heading: "Suggested Action",
    suggest_return_msg: "• Consider Returning the application for applicant document correction.",
    suggest_approve_msg: "• Application is complete and eligible for Officer Approval.",
    reasons_heading: "Reasons",
    reason_missing_proof: "Required income proof document is not attached.",
    reason_unverified_income: "Declared annual income could not be substantiated from records.",
    reason_all_ok: "All essential identity, address, and income proofs are verified.",
    ai_note: "Note: Groq AI provides automated advisory recommendations. Final statutory decision rests with the designated officer.",
    ai_citation_prefix: "Statutory Reference:",

    // Decision & History Tab
    decision_form_heading: "Take Decision",
    dsc_badge: "Digital Signature (DSC) Enabled",
    decision_action_label: "Action",
    opt_return: "Return for Correction",
    opt_approve: "Approve",
    opt_reject: "Reject",
    decision_reason_label: "Reason",
    default_return_reason: "Required income proof document (bank passbook / salary slip) is not attached.",
    default_approve_reason: "All required identity, residence, and income proof documents verified. Declared income is within eligible limits.",
    default_reject_reason: "Applicant does not meet eligibility criteria based on submitted records and declared income.",
    applicant_instructions_label: "Instructions for Applicant (Correction Request)",
    no_correction_needed: "Correction request is not required for approval or rejection.",
    default_correction_request: "1. Please attach an updated bank statement or salary slip copy.\n2. Ensure all uploaded documents are clearly legible.",
    btn_cancel: "Cancel",
    btn_submit_decision: "Submit Decision",
    btn_submitting: "Submitting...",
    history_heading: "Decision History",
    entries_count: "Entries:",
    loading_history: "Loading decision history...",
    no_history: "No prior decisions recorded.",
    actor_label: "Officer / Actor:",
    details_label: "Details:",
    event_return_badge: "Returned for Correction",
    event_approve_badge: "Approved",
    event_reject_badge: "Rejected",
    event_ai_badge: "AI Scrutiny Completed (Groq)",
    event_received_badge: "Application Received (RTPS Portal)",
    event_verif_badge: "Initial Verification",

    // RTPS Guidelines View
    guidelines_page_title: "RTPS Rules & Statutory Guidelines",
    guidelines_page_sub: "Bihar Right to Public Services (RTPS) Act, 2011 · Income Certificate Issuance Guidelines",
    statutory_badge: "Statutory Directive",
    sla_label: "Service SLA",
    sla_val: "14 Working Days",
    sla_desc: "Statutory maximum limit from application receipt to certificate issuance.",
    authority_label: "Designated Authority",
    authority_val: "Revenue Officer",
    authority_desc: "Competent authority to issue income certificate at Circle level.",
    appellate_label: "First Appellate Authority",
    appellate_val: "Circle Officer (CO)",
    appellate_desc: "First appellate authority if certificate is not issued within 30 days.",
    guidelines_sec1_title: "1. Required Evidence & Verification Checklist",
    guidelines_general_title: "General Income Certificate",
    guidelines_ews_title: "EWS Income & Asset Certificate",
    guidelines_sec2_title: "2. Rejection & Return for Correction Rules",
    guidelines_sec2_desc: "Under the RTPS Act, no application can be rejected without clear, legally valid, and recorded reasons.",
    guidelines_return_rule_title: "In case of Return for Correction:",
    guidelines_return_rule_1: "• The officer must specify exactly which document is missing or deficient.",
    guidelines_return_rule_2: "• Resubmitted applications must be prioritized and disposed of within 7 days of resubmission.",

    // Officer Profile View
    profile_office_desc: "Department of Revenue & Land Reforms · Circle Office, Masaurhi (Patna)",
    active_duty_badge: "Active Duty (On Duty)",
    stat_disposed_title: "Total Disposed",
    stat_disposed_sub: "Income Certificate Applications",
    stat_approved_title: "Approved this Month",
    stat_approved_sub: "October 2026",
    stat_avg_time_title: "Avg. Turnaround Time",
    stat_avg_time_val: "2.4 Days",
    stat_avg_time_sub: "SLA Limit: 14 Days",
    stat_compliance_title: "SLA Timeliness Adherence",
    stat_compliance_val: "98.6%",
    stat_compliance_sub: "RTPS Grade A",
    profile_official_heading: "Official & Posting Information",
    emp_code_label: "Employee ID",
    cadre_label: "Cadre",
    cadre_val: "Bihar Administrative Service / Revenue Cadre",
    office_label: "Posting Office",
    office_val: "Circle Office, Masaurhi",
    district_zone_label: "District / Division",
    district_zone_val: "Patna / Patna Division",
    posting_date_label: "Posting Date",
    posting_date_val: "12 June 2023",
    profile_security_heading: "Contact & Security Credentials",
    email_label: "Official Email",
    mobile_label: "Official Mobile",
    dsc_label: "Digital Signature Certificate (DSC)",
    dsc_val: "Verified (Valid till 2027)",
    last_login_label: "Last Login",
    network_label: "IP / Network",
    auth_services_heading: "Authorized RTPS Services & Jurisdiction",
    auth_service_1_title: "General Income Certificate",
    auth_service_1_desc: "Final scrutiny, approval, and digital signing authority",
    auth_service_2_title: "EWS Income & Asset Certificate",
    auth_service_2_desc: "Asset assessment and competent statutory endorsement",
    auth_service_3_title: "Document Correction & Appeals",
    auth_service_3_desc: "Re-examination of resubmitted incomplete applications",

    // Feedback messages
    msg_decision_success: "Decision submitted successfully and recorded in Neon DB:",
    msg_review_opened: "Scrutiny view opened:",
    toggle_hindi: "हिंदी",
    toggle_english: "English",
  },
};

export type TranslationKey = keyof typeof translations.hi;

// --- Domain-Specific Localization Mappings ---

export const nameTranslations: Record<string, string> = {
  "संदीप कुमार": "Sandeep Kumar",
  "रीना देवी": "Reena Devi",
  "मोहन पासवान": "Mohan Paswan",
  "अनिता कुमारी": "Anita Kumari",
  "विकास सिंह": "Vikas Singh",
  "सुनील कुमार": "Sunil Kumar",
  "पूजा कुमारी": "Pooja Kumari",
  "रवि रंजन": "Ravi Ranjan",
  "रमेश प्रसाद": "Ramesh Prasad",
  "दिनेश साह": "Dinesh Sah",
  "रामवृक्ष पासवान": "Ramvriksh Paswan",
  "विनोद सिंह": "Vinod Singh",
  "शिवनाथ सिंह": "Shivnath Singh",
  "राजेश कुमार": "Rajesh Kumar",
  "महेश कुमार": "Mahesh Kumar",
  "संजय शर्मा": "Sanjay Sharma",
  "अजय वर्मा": "Ajay Verma",
};

export const serviceTranslations: Record<string, string> = {
  "सामान्य आय प्रमाण पत्र": "General Income Certificate",
  "EWS आय एवं संपत्ति प्रमाण पत्र": "EWS Income & Asset Certificate",
};

export const documentTranslations: Record<string, string> = {
  "आवेदन पत्र": "Application Form",
  "पहचान पत्र (आधार)": "Identity Proof (Aadhaar)",
  "पहचान पत्र": "Identity Proof",
  "निवास प्रमाण पत्र": "Residence Certificate",
  "बैंक पासबुक / वेतन पर्ची": "Bank Passbook / Salary Slip",
  "आय प्रमाण पत्र (पुराना)": "Previous Income Certificate",
  "जमीन का रसीद": "Land Revenue Receipt",
};

export const statusTranslations: Record<string, string> = {
  "लंबित": "Pending",
  "जाँच आवश्यक": "Scrutiny Required",
  "स्वीकृत": "Approved",
  "अस्वीकृत": "Rejected",
  "वापस किया गया": "Returned for Correction",
  "PENDING_REVIEW": "Pending Scrutiny",
  "APPROVED": "Approved",
  "REJECTED": "Rejected",
  "RETURNED": "Returned",
};

export const locationTranslations: Record<string, string> = {
  "पटना": "Patna",
  "मसौढ़ी": "Masaurhi",
  "फुलवारी शरीफ": "Phulwari Sharif",
  "फुलवारी": "Phulwari",
  "दानापुर": "Danapur",
  "मनेर": "Maner",
  "नौबतपुर": "Naubatpur",
};

export const priorityTranslations: Record<string, string> = {
  "तात्कालिक": "Immediate",
  "सामान्य": "Normal",
};

const reverseNameMap: Record<string, string> = Object.fromEntries(
  Object.entries(nameTranslations).map(([hi, en]) => [en.toLowerCase(), hi])
);
const reverseServiceMap: Record<string, string> = Object.fromEntries(
  Object.entries(serviceTranslations).map(([hi, en]) => [en.toLowerCase(), hi])
);
const reverseDocMap: Record<string, string> = Object.fromEntries(
  Object.entries(documentTranslations).map(([hi, en]) => [en.toLowerCase(), hi])
);
const reverseStatusMap: Record<string, string> = {
  "approved": "स्वीकृत",
  "rejected": "अस्वीकृत",
  "returned": "वापस किया गया",
  "returned for correction": "वापस किया गया",
  "pending": "लंबित",
  "pending scrutiny": "लंबित",
  "scrutiny required": "जाँच आवश्यक",
  "pending_review": "लंबित",
};
const reverseLocMap: Record<string, string> = Object.fromEntries(
  Object.entries(locationTranslations).map(([hi, en]) => [en.toLowerCase(), hi])
);
const reversePriorityMap: Record<string, string> = Object.fromEntries(
  Object.entries(priorityTranslations).map(([hi, en]) => [en.toLowerCase(), hi])
);

export function localizeName(name: string | undefined | null, lang: Language): string {
  if (!name) return "";
  if (lang === "en") return nameTranslations[name] || name;
  return reverseNameMap[name.toLowerCase()] || name;
}

export function localizeService(service: string | undefined | null, lang: Language): string {
  if (!service) return "";
  if (lang === "en") {
    if (service.includes("EWS")) return "EWS Income & Asset Certificate";
    return serviceTranslations[service] || "General Income Certificate";
  }
  if (service.toLowerCase().includes("ews")) return "EWS आय एवं संपत्ति प्रमाण पत्र";
  return reverseServiceMap[service.toLowerCase()] || "सामान्य आय प्रमाण पत्र";
}

export function localizeDocument(doc: string | undefined | null, lang: Language): string {
  if (!doc) return "";
  if (lang === "en") return documentTranslations[doc] || doc;
  return reverseDocMap[doc.toLowerCase()] || doc;
}

export function localizeStatus(status: string | undefined | null, lang: Language): string {
  if (!status) return "";
  if (lang === "en") {
    if (status.includes("आवश्यक")) return "Scrutiny Required";
    if (status.includes("वापस")) return "Returned for Correction";
    if (status.includes("स्वीकृत")) return "Approved";
    if (status.includes("अस्वीकृत")) return "Rejected";
    if (status.includes("लंबित")) return "Pending";
    return statusTranslations[status] || status;
  }
  return reverseStatusMap[status.toLowerCase()] || status;
}

export function localizeLocation(loc: string | undefined | null, lang: Language): string {
  if (!loc) return "";
  if (lang === "en") return locationTranslations[loc] || loc;
  return reverseLocMap[loc.toLowerCase()] || loc;
}

export function localizePriority(priority: string | undefined | null, lang: Language): string {
  if (!priority) return "";
  if (lang === "en") return priorityTranslations[priority] || priority;
  return reversePriorityMap[priority.toLowerCase()] || priority;
}


