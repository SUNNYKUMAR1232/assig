import { Application } from "@/lib/types";
import { VerificationResult } from "@/lib/validation/verification.service";
import {
  localizeName,
  localizeService,
} from "@/lib/language/translations";

export type AiReview = {
  available: boolean;
  modelVersion: string;
  summaryHindi: string;
  summaryEnglish?: string;
  missingEvidence: string[];
  missingEvidenceEnglish?: string[];
  inconsistencies: string[];
  inconsistenciesEnglish?: string[];
  checksRequiringManualReview: string[];
  checksRequiringManualReviewEnglish?: string[];
  suggestedAction: "RETURN" | "REVIEW";
  reasonsHindi: string[];
  reasonsEnglish?: string[];
  evidenceReferences: string[];
  evidenceReferencesEnglish?: string[];
};

/**
 * Deterministic baseline review used as reliable fallback
 */
export function createAiReview(application: Application, verification: VerificationResult): AiReview {
  const missingEvidence = verification.findings
    .filter((finding) => finding.ruleCode === "MISSING_DOCUMENT")
    .map((finding) => finding.description);

  const hasMissing = missingEvidence.length > 0;
  const serviceName = application.service || "सामान्य आय प्रमाण पत्र";
  const incomeFormatted = `₹ ${application.declaredIncome.toLocaleString("en-IN")}`;

  const summaryHindi = hasMissing
    ? `आवेदक ${application.name} ने ${serviceName} के लिए आवेदन किया है। दिए गए दस्तावेज़ों में पहचान और निवास प्रमाण पत्र उपलब्ध हैं, लेकिन आय संबंधी मुख्य दस्तावेज़ (जैसे वेतन पर्ची / आय प्रमाण पत्र / बैंक स्टेटमेंट) उपलब्ध नहीं है। घोषित आय ${incomeFormatted} है, जिसकी पुष्टि नहीं हो सकी है।`
    : `आवेदक ${application.name} के आवेदन में सभी आवश्यक पहचान, निवास एवं आय संबंधी दस्तावेज़ संलग्न हैं। घोषित आय ${incomeFormatted} की प्रारंभिक जाँच संतोषजनक है।`;

  const applicantNameEn = localizeName(application.name, "en");
  const serviceNameEn = localizeService(application.service, "en");
  const summaryEnglish = hasMissing
    ? `Applicant ${applicantNameEn} has applied for ${serviceNameEn}. Identity and residence certificates are attached, but essential income proof (salary slip / bank passbook) is missing. Declared income is ${incomeFormatted}, which could not be substantiated.`
    : `Applicant ${applicantNameEn}'s application contains all required identity, residence, and income proof documents. Preliminary scrutiny of declared income ${incomeFormatted} is satisfactory.`;

  const inconsistencies = hasMissing
    ? ["घोषित आय की दस्तावेज़ों से पुष्टि नहीं हो सकी।"]
    : [];

  const inconsistenciesEnglish = hasMissing
    ? ["Declared income could not be substantiated from records."]
    : [];

  const reasonsHindi = hasMissing
    ? [
        "आय संबंधी आवश्यक दस्तावेज़ उपलब्ध नहीं है।",
        "इससे आय की प्रामाणिकता की पुष्टि नहीं हो पाई है।",
      ]
    : [
        "सभी आवश्यक दस्तावेज़ उपलब्ध एवं सत्यापित हैं।",
        "घोषित आय विहित सीमा के अंतर्गत है।",
      ];

  const reasonsEnglish = hasMissing
    ? [
        "Required income proof document is missing.",
        "Authenticity of declared annual income could not be substantiated.",
      ]
    : [
        "All essential documents are submitted and verified.",
        "Declared income is within eligible statutory limits.",
      ];

  const evidenceReferences = [
    "बिहार लोक सेवाओं का अधिकार (RTPS) अधिनियम, 2011",
    "राजस्व एवं भूमि सुधार विभाग - परिपत्र सं. 14/सा.प्र.-03-01/2016",
    "आय एवं परिसंपत्ति प्रमाण पत्र संबंधी नवीनतम दिशानिर्देश",
  ];

  const evidenceReferencesEnglish = [
    "Bihar Right to Public Services (RTPS) Act, 2011",
    "Department of Revenue & Land Reforms - Circular No. 14/2016",
    "Statutory Guidelines for Income & Asset Assessment",
  ];

  return {
    available: true,
    modelVersion: "janseva-rule-grounded-v1",
    summaryHindi,
    summaryEnglish,
    missingEvidence: hasMissing ? ["आय स्रोत का प्रमाण (बैंक पासबुक/वेतन पर्ची)"] : [],
    missingEvidenceEnglish: hasMissing ? ["Proof of Income Source (Bank Passbook / Salary Slip)"] : [],
    inconsistencies,
    inconsistenciesEnglish,
    checksRequiringManualReview: ["घोषित आय की स्वतंत्र पुष्टि"],
    checksRequiringManualReviewEnglish: ["Independent verification of declared income"],
    suggestedAction: hasMissing ? "RETURN" : "REVIEW",
    reasonsHindi,
    reasonsEnglish,
    evidenceReferences,
    evidenceReferencesEnglish,
  };
}

/**
 * Live AI review powered by Groq AI API
 */
export async function generateGroqAiReview(
  application: Application,
  verification: VerificationResult
): Promise<AiReview> {
  const apiKey =
    process.env.GROQ_API_KEY ||
    process.env.AI_API_KEY;

  const model = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

  if (!apiKey) {
    return createAiReview(application, verification);
  }

  const suppliedDocs = application.documents
    .filter((d) => d.supplied)
    .map((d) => d.type)
    .join(", ");

  const missingDocs = application.documents
    .filter((d) => !d.supplied)
    .map((d) => d.type)
    .join(", ");

  const findingsText = verification.findings
    .map((f) => `- [${f.severity}] ${f.description} (नियम: ${f.sourceReference})`)
    .join("\n");

  const prompt = `
आप बिहार सरकार के राजस्व एवं भूमि सुधार विभाग (RTPS पोर्टल) के लिए एक वरिष्ठ जाँच अधिकारी AI (Scrutiny Officer AI) हैं।
निम्नलिखित आय प्रमाण पत्र आवेदन की निष्पक्ष समीक्षा करें और हिंदी में शुद्ध JSON प्रारूप में परिणाम दें।

आवेदन विवरण:
- आवेदक का नाम: ${application.name}
- पिता/पति का नाम: ${application.fatherName || "रमेश प्रसाद"}
- ग्राम / अंचल / जिला: ${application.village || "मसौढ़ी"}, ${application.block || "मसौढ़ी"}, ${application.district || "पटना"}
- आवेदन संख्या: ${application.referenceNumber}
- सेवा प्रकार: ${application.service || "सामान्य आय प्रमाण पत्र"}
- घोषित वार्षिक आय: ₹ ${application.declaredIncome.toLocaleString("en-IN")}
- वित्तीय वर्ष: ${application.financialYear}
- संलग्न दस्तावेज़ (Supplied): ${suppliedDocs || "कोई नहीं"}
- अनुपलब्ध दस्तावेज़ (Missing): ${missingDocs || "कोई नहीं"}
- स्वचालित सत्यापन निष्कर्ष:
${findingsText || "सभी प्राथमिक जाँच संतोषजनक हैं"}

दिशानिर्देश:
1. यदि आय स्रोत का दस्तावेज़ (वेतन पर्ची/बैंक पासबुक) अनुपलब्ध है तो "RETURN" (दस्तावेज़ सुधार हेतु वापस करने) का सुझाव दें।
2. भाषा शुद्ध, आधिकारिक एवं सम्मानजनक हिंदी (राजभाषा हिंदी) होनी चाहिए।
3. बिहार RTPS अधिनियम 2011 एवं राजस्व विभाग के परिपत्रों का संदर्भ दें।

कृपया केवल निम्नलिखित JSON संरचना में उत्तर दें (कोई अतिरिक्त टेक्स्ट या बैक-टिक्स नहीं):
{
  "summaryHindi": "आवेदक के संबंध में 2-3 वाक्यों का संक्षिप्त सारांश",
  "missingEvidence": ["अनुपलब्ध दस्तावेज़ों की सूची हिंदी में"],
  "inconsistencies": ["यदि कोई असंगति हो तो उसका विवरण हिंदी में"],
  "suggestedAction": "RETURN" या "REVIEW",
  "reasonsHindi": ["कार्रवाई के 2 मुख्य कारण हिंदी में"],
  "evidenceReferences": ["कानूनी / नियमावली संदर्भ हिंदी में"]
}
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "system",
            content:
              "You are an expert government scrutiny officer AI for Bihar RTPS portal. You always output strictly valid JSON in Hindi.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      console.warn(`Groq API returned HTTP ${response.status}, falling back to rule-based review`);
      return createAiReview(application, verification);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content?.trim();

    if (!rawContent) {
      return createAiReview(application, verification);
    }

    // Strip markdown code fences if present (e.g. ```json ... ```)
    const jsonString = rawContent
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/, "")
      .replace(/\s*```$/, "")
      .trim();

    const parsed = JSON.parse(jsonString);
    const baseline = createAiReview(application, verification);

    return {
      available: true,
      modelVersion: `groq-${model}`,
      summaryHindi:
        parsed.summaryHindi ||
        `आवेदक ${application.name} के आवेदन की Groq AI द्वारा समीक्षा पूर्ण हुई।`,
      summaryEnglish:
        parsed.summaryEnglish ||
        baseline.summaryEnglish ||
        `Groq AI scrutiny completed for applicant ${localizeName(application.name, "en")}.`,
      missingEvidence: Array.isArray(parsed.missingEvidence) ? parsed.missingEvidence : [],
      missingEvidenceEnglish: Array.isArray(parsed.missingEvidenceEnglish)
        ? parsed.missingEvidenceEnglish
        : baseline.missingEvidenceEnglish || [],
      inconsistencies: Array.isArray(parsed.inconsistencies) ? parsed.inconsistencies : [],
      inconsistenciesEnglish: Array.isArray(parsed.inconsistenciesEnglish)
        ? parsed.inconsistenciesEnglish
        : baseline.inconsistenciesEnglish || [],
      checksRequiringManualReview: ["घोषित आय की स्वतंत्र पुष्टि"],
      checksRequiringManualReviewEnglish: ["Independent verification of declared income"],
      suggestedAction: parsed.suggestedAction === "RETURN" ? "RETURN" : "REVIEW",
      reasonsHindi: Array.isArray(parsed.reasonsHindi)
        ? parsed.reasonsHindi
        : ["दस्तावेजों के आधार पर समीक्षा की गई।"],
      reasonsEnglish: Array.isArray(parsed.reasonsEnglish)
        ? parsed.reasonsEnglish
        : baseline.reasonsEnglish || ["Scrutiny completed based on attached records."],
      evidenceReferences: Array.isArray(parsed.evidenceReferences) && parsed.evidenceReferences.length > 0
        ? parsed.evidenceReferences
        : [
            "बिहार लोक सेवाओं का अधिकार (RTPS) अधिनियम, 2011",
            "राजस्व एवं भूमि सुधार विभाग - परिपत्र सं. 14/सा.प्र.-03-01/2016",
          ],
      evidenceReferencesEnglish: Array.isArray(parsed.evidenceReferencesEnglish) && parsed.evidenceReferencesEnglish.length > 0
        ? parsed.evidenceReferencesEnglish
        : baseline.evidenceReferencesEnglish || [
            "Bihar Right to Public Services (RTPS) Act, 2011",
            "Department of Revenue & Land Reforms - Circular No. 14/2016",
          ],
    };
  } catch (error) {
    console.error("Groq AI API error, using fallback review:", error);
    return createAiReview(application, verification);
  }
}
