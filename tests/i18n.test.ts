import { describe, it, expect } from "vitest";
import {
  translations,
  localizeName,
  localizeService,
  localizeDocument,
  localizeStatus,
} from "@/lib/language/translations";

describe("Language Toggle and i18n Translations", () => {
  it("has valid translation dictionaries for both Hindi and English", () => {
    expect(translations.hi).toBeDefined();
    expect(translations.en).toBeDefined();
  });

  it("contains matching translation keys between Hindi and English", () => {
    const hiKeys = Object.keys(translations.hi).sort();
    const enKeys = Object.keys(translations.en).sort();

    expect(hiKeys).toEqual(enKeys);
    expect(hiKeys.length).toBeGreaterThan(50);
  });

  it("translates primary header and navigation strings properly", () => {
    expect(translations.hi.app_title).toBe("जनसेवा सहायक");
    expect(translations.en.app_title).toBe("JanSeva Sahayak");

    expect(translations.hi.nav_dashboard).toBe("डैशबोर्ड");
    expect(translations.en.nav_dashboard).toBe("Dashboard");

    expect(translations.hi.status_approved).toBe("स्वीकृत");
    expect(translations.en.status_approved).toBe("Approved");

    expect(translations.hi.status_returned).toBe("वापस किया गया");
    expect(translations.en.status_returned).toBe("Returned");
  });

  it("correctly maps domain names, services, documents, and statuses bidirectionally", () => {
    expect(localizeName("संदीप कुमार", "en")).toBe("Sandeep Kumar");
    expect(localizeName("Sandeep Kumar", "hi")).toBe("संदीप कुमार");
    expect(localizeName("रीना देवी", "en")).toBe("Reena Devi");

    expect(localizeService("सामान्य आय प्रमाण पत्र", "en")).toBe("General Income Certificate");
    expect(localizeService("EWS आय एवं संपत्ति प्रमाण पत्र", "en")).toBe("EWS Income & Asset Certificate");

    expect(localizeDocument("आवेदन पत्र", "en")).toBe("Application Form");
    expect(localizeDocument("बैंक पासबुक / वेतन पर्ची", "en")).toBe("Bank Passbook / Salary Slip");

    expect(localizeStatus("लंबित", "en")).toBe("Pending");
    expect(localizeStatus("स्वीकृत", "en")).toBe("Approved");
    expect(localizeStatus("Approved", "hi")).toBe("स्वीकृत");
  });
});


