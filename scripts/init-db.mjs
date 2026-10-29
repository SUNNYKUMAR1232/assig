import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to initialize the database.");
}

console.log("Connecting to Neon PostgreSQL...");
const sql = neon(databaseUrl);

async function init() {
  try {
    console.log("Testing connection...");
    const testResult = await sql`SELECT NOW() AS current_time`;
    console.log("Connected successfully! Current DB Time:", testResult[0].current_time);

    console.log("Creating tables...");
    
    // Create applications table
    await sql`
      CREATE TABLE IF NOT EXISTS applications (
        id VARCHAR(64) PRIMARY KEY,
        numeric_id INTEGER,
        name VARCHAR(255) NOT NULL,
        father_name VARCHAR(255),
        village VARCHAR(255),
        district VARCHAR(255) DEFAULT 'पटना',
        block VARCHAR(255) DEFAULT 'मसौढ़ी',
        reference_number VARCHAR(64) UNIQUE NOT NULL,
        service VARCHAR(255) DEFAULT 'सामान्य आय प्रमाण पत्र',
        submitted_at VARCHAR(64),
        status VARCHAR(64) NOT NULL DEFAULT 'PENDING_REVIEW',
        priority VARCHAR(64) NOT NULL DEFAULT 'सामान्य',
        financial_year VARCHAR(64) DEFAULT '2025-26',
        declared_income INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create documents table
    await sql`
      CREATE TABLE IF NOT EXISTS documents (
        id SERIAL PRIMARY KEY,
        application_id VARCHAR(64) REFERENCES applications(id) ON DELETE CASCADE,
        type VARCHAR(255) NOT NULL,
        supplied BOOLEAN NOT NULL DEFAULT true,
        verification_status VARCHAR(64) NOT NULL DEFAULT 'PENDING',
        finding TEXT
      )
    `;

    // Create audit_events table
    await sql`
      CREATE TABLE IF NOT EXISTS audit_events (
        id SERIAL PRIMARY KEY,
        application_id VARCHAR(64) REFERENCES applications(id) ON DELETE CASCADE,
        actor_id VARCHAR(255) NOT NULL,
        event_type VARCHAR(64) NOT NULL,
        previous_status VARCHAR(64),
        new_status VARCHAR(64),
        reason TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    console.log("Tables created successfully.");

    // Check if applications table has data
    const existing = await sql`SELECT COUNT(*) AS count FROM applications`;
    console.log(`Current applications count in DB: ${existing[0].count}`);

    if (parseInt(existing[0].count, 10) === 0) {
      console.log("Seeding applications and documents...");

      const demoApps = [
        {
          id: "BR-IC-1007",
          numericId: 1,
          name: "संदीप कुमार",
          fatherName: "रमेश प्रसाद",
          village: "मसौढ़ी",
          district: "पटना",
          block: "मसौढ़ी",
          referenceNumber: "BR-IC-1007",
          service: "सामान्य आय प्रमाण पत्र",
          submittedAt: "25-10-2026",
          status: "PENDING_REVIEW",
          priority: "तात्कालिक",
          financialYear: "2025-26",
          declaredIncome: 240000,
          documents: [
            { type: "आवेदन पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "आय प्रमाण पत्र (पुराना)", supplied: true, verificationStatus: "VERIFIED" },
            { type: "पहचान पत्र (आधार)", supplied: true, verificationStatus: "VERIFIED" },
            { type: "निवास प्रमाण पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "बैंक पासबुक / वेतन पर्ची", supplied: false, verificationStatus: "MISSING", finding: "आय संबंधी आवश्यक दस्तावेज़ (बैंक पासबुक/वेतन पर्ची) उपलब्ध नहीं है।" },
          ],
        },
        {
          id: "BR-IC-1012",
          numericId: 2,
          name: "रीना देवी",
          fatherName: "दिनेश साह",
          village: "फुलवारी",
          district: "पटना",
          block: "फुलवारी शरीफ",
          referenceNumber: "BR-IC-1012",
          service: "सामान्य आय प्रमाण पत्र",
          submittedAt: "24-10-2026",
          status: "PENDING_REVIEW",
          priority: "सामान्य",
          financialYear: "2025-26",
          declaredIncome: 180000,
          documents: [
            { type: "आवेदन पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "पहचान पत्र (आधार)", supplied: true, verificationStatus: "VERIFIED" },
            { type: "निवास प्रमाण पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "बैंक पासबुक / वेतन पर्ची", supplied: true, verificationStatus: "PENDING" },
          ],
        },
        {
          id: "BR-IC-1003",
          numericId: 3,
          name: "मोहन पासवान",
          fatherName: "रामवृक्ष पासवान",
          village: "मनेर",
          district: "पटना",
          block: "मनेर",
          referenceNumber: "BR-IC-1003",
          service: "सामान्य आय प्रमाण पत्र",
          submittedAt: "23-10-2026",
          status: "PENDING_REVIEW",
          priority: "सामान्य",
          financialYear: "2025-26",
          declaredIncome: 320000,
          documents: [
            { type: "आवेदन पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "पहचान पत्र (आधार)", supplied: true, verificationStatus: "VERIFIED" },
            { type: "निवास प्रमाण पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "बैंक पासबुक / वेतन पर्ची", supplied: true, verificationStatus: "PENDING" },
          ],
        },
        {
          id: "BR-IC-1018",
          numericId: 4,
          name: "अनिता कुमारी",
          fatherName: "विनोद सिंह",
          village: "दानापुर",
          district: "पटना",
          block: "दानापुर",
          referenceNumber: "BR-IC-1018",
          service: "EWS आय एवं संपत्ति प्रमाण पत्र",
          submittedAt: "22-10-2026",
          status: "RETURNED",
          priority: "सामान्य",
          financialYear: "2025-26",
          declaredIncome: 90000,
          documents: [
            { type: "आवेदन पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "पहचान पत्र (आधार)", supplied: true, verificationStatus: "VERIFIED" },
            { type: "निवास प्रमाण पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "बैंक पासबुक / वेतन पर्ची", supplied: false, verificationStatus: "MISSING" },
          ],
        },
        {
          id: "BR-IC-1016",
          numericId: 5,
          name: "विकास सिंह",
          fatherName: "शिवनाथ सिंह",
          village: "नौबतपुर",
          district: "पटना",
          block: "नौबतपुर",
          referenceNumber: "BR-IC-1016",
          service: "सामान्य आय प्रमाण पत्र",
          submittedAt: "22-10-2026",
          status: "PENDING_REVIEW",
          priority: "सामान्य",
          financialYear: "2025-26",
          declaredIncome: 450000,
          documents: [
            { type: "आवेदन पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "पहचान पत्र (आधार)", supplied: true, verificationStatus: "VERIFIED" },
            { type: "निवास प्रमाण पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "बैंक पासबुक / वेतन पर्ची", supplied: true, verificationStatus: "PENDING" },
          ],
        },
        {
          id: "BR-IC-1009",
          numericId: 6,
          name: "सुनील कुमार",
          fatherName: "महेन्द्र प्रसाद",
          village: "बिहटा",
          district: "पटना",
          block: "बिहटा",
          referenceNumber: "BR-IC-1009",
          service: "EWS आय एवं संपत्ति प्रमाण पत्र",
          submittedAt: "21-10-2026",
          status: "PENDING_REVIEW",
          priority: "सामान्य",
          financialYear: "2025-26",
          declaredIncome: 680000,
          documents: [
            { type: "आवेदन पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "पहचान पत्र (आधार)", supplied: true, verificationStatus: "VERIFIED" },
            { type: "निवास प्रमाण पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "बैंक पासबुक / वेतन पर्ची", supplied: true, verificationStatus: "PENDING" },
          ],
        },
        {
          id: "BR-IC-1014",
          numericId: 7,
          name: "पूजा कुमारी",
          fatherName: "सुरेश राम",
          village: "मसौढ़ी",
          district: "पटना",
          block: "मसौढ़ी",
          referenceNumber: "BR-IC-1014",
          service: "सामान्य आय प्रमाण पत्र",
          submittedAt: "20-10-2026",
          status: "APPROVED",
          priority: "सामान्य",
          financialYear: "2025-26",
          declaredIncome: 120000,
          documents: [
            { type: "आवेदन पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "पहचान पत्र (आधार)", supplied: true, verificationStatus: "VERIFIED" },
            { type: "निवास प्रमाण पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "बैंक पासबुक / वेतन पर्ची", supplied: true, verificationStatus: "VERIFIED" },
          ],
        },
        {
          id: "BR-IC-1005",
          numericId: 8,
          name: "रवि रंजन",
          fatherName: "उमेश प्रसाद",
          village: "फुलवारी",
          district: "पटना",
          block: "फुलवारी शरीफ",
          referenceNumber: "BR-IC-1005",
          service: "सामान्य आय प्रमाण पत्र",
          submittedAt: "19-10-2026",
          status: "REJECTED",
          priority: "सामान्य",
          financialYear: "2025-26",
          declaredIncome: 510000,
          documents: [
            { type: "आवेदन पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "पहचान पत्र (आधार)", supplied: true, verificationStatus: "VERIFIED" },
            { type: "निवास प्रमाण पत्र", supplied: true, verificationStatus: "VERIFIED" },
            { type: "बैंक पासबुक / वेतन पर्ची", supplied: true, verificationStatus: "VERIFIED" },
          ],
        },
      ];

      for (const app of demoApps) {
        await sql`
          INSERT INTO applications (
            id, numeric_id, name, father_name, village, district, block,
            reference_number, service, submitted_at, status, priority,
            financial_year, declared_income
          ) VALUES (
            ${app.id}, ${app.numericId}, ${app.name}, ${app.fatherName}, ${app.village},
            ${app.district}, ${app.block}, ${app.referenceNumber}, ${app.service},
            ${app.submittedAt}, ${app.status}, ${app.priority}, ${app.financialYear},
            ${app.declaredIncome}
          )
          ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            declared_income = EXCLUDED.declared_income,
            updated_at = CURRENT_TIMESTAMP
        `;

        // Delete existing docs for this app if any and insert fresh
        await sql`DELETE FROM documents WHERE application_id = ${app.id}`;

        for (const doc of app.documents) {
          await sql`
            INSERT INTO documents (
              application_id, type, supplied, verification_status, finding
            ) VALUES (
              ${app.id}, ${doc.type}, ${doc.supplied}, ${doc.verificationStatus}, ${doc.finding || null}
            )
          `;
        }
      }

      // Seed audit events for BR-IC-1007
      await sql`DELETE FROM audit_events WHERE application_id = 'BR-IC-1007'`;
      await sql`
        INSERT INTO audit_events (application_id, actor_id, event_type, previous_status, new_status, reason, created_at)
        VALUES 
          ('BR-IC-1007', 'राजेश कुमार (नामित अधिकारी)', 'RETURNED', 'PENDING_REVIEW', 'RETURNED', 'आय संबंधी आवश्यक दस्तावेज़ (बैंक पासबुक/वेतन पर्ची) उपलब्ध नहीं है।', '2026-10-25 11:32:00+05:30'),
          ('BR-IC-1007', 'AI समीक्षा सहायक', 'AI_REVIEW', 'PENDING_REVIEW', 'PENDING_REVIEW', 'सारांश: आय दस्तावेज़ अनुपलब्ध। सुझाव: वापस करें।', '2026-10-25 11:20:00+05:30'),
          ('BR-IC-1007', 'राजेश कुमार (नामित अधिकारी)', 'VERIFICATION', 'NEW', 'PENDING_REVIEW', 'दस्तावेज़ जाँच: आंशिक पूर्ण (पहचान एवं निवास सत्यापित)', '2026-10-25 10:45:00+05:30'),
          ('BR-IC-1007', 'प्रणाली (RTPS Portal)', 'APPLICATION_RECEIVED', 'INITIATED', 'NEW', 'माध्यम: ऑनलाइन (RTPS Portal 2.0)', '2026-10-25 10:02:00+05:30')
      `;

      console.log("Seeding completed successfully!");
    } else {
      console.log("Database already contains data.");
    }

    console.log("DB initialization finished!");
  } catch (err) {
    console.error("Database initialization failed:", err);
    process.exit(1);
  }
}

init();
