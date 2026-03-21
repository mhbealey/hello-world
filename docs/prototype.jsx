/**
 * PE Cybersecurity Governance Platform — UX Reference Prototype
 *
 * This file serves as the UX reference for exact colors, spacing,
 * animation timing, and data structures. Reference this file when
 * building components and screens.
 *
 * NOTE: The actual prototype source should be copied here when available.
 * For now, this file documents the expected UX patterns from the spec.
 */

// Data structures matching the seed data
export const PROTOTYPE_DATA = {
  assessment: {
    score: 81,
    priorScore: 77,
    asOf: "2026-03-17",
    nextLpReview: "2026-04-28",
    daysToLp: 42,
    overdueCount: 6,
    totalAle: 46_800_000_00, // cents
  },

  funds: [
    {
      name: "Fund I",
      vintage: 2018,
      aum: 1_200_000_000_00,
      nav: 980_000_000_00,
      moic: 1.82,
      irr: 14.2,
      deployedPct: 98,
      cyberScore: 86,
      oddStatus: "complete",
      exitCompanies: 3,
    },
    {
      name: "Fund II",
      vintage: 2021,
      aum: 2_800_000_000_00,
      nav: 2_450_000_000_00,
      moic: 1.56,
      irr: 18.6,
      deployedPct: 87,
      cyberScore: 81,
      oddStatus: "in_progress",
      exitCompanies: 0,
    },
    {
      name: "Fund III",
      vintage: 2024,
      aum: 850_000_000_00,
      nav: 820_000_000_00,
      moic: 1.04,
      irr: null,
      deployedPct: 22,
      cyberScore: 74,
      oddStatus: "not_started",
      exitCompanies: 0,
    },
  ],

  risks: [
    { name: "Exit Value Erosion", ale: 19_800_000_00, plain: "Without proper cyber governance at portfolio companies, exit valuations could be reduced by $15-25M due to unaddressed security gaps discovered during buyer due diligence." },
    { name: "Data Breach", ale: 6_800_000_00 },
    { name: "AI Exposure", ale: 6_500_000_00 },
    { name: "SEC Enforcement", ale: 5_800_000_00 },
    { name: "Vendor Compromise", ale: 4_200_000_00 },
    { name: "Ransomware", ale: 3_700_000_00 },
  ],

  actions: [
    { id: "a0", title: "Establish AI Governance Policy", urgency: "critical", steps: 5 },
    { id: "a1", title: "Close Open Audit Findings", urgency: "high", steps: 5 },
    { id: "a2", title: "Review Cyber Insurance Coverage", urgency: "high", steps: 4 },
    { id: "a3", title: "Implement BC/DR Testing Program", urgency: "medium", steps: 5 },
    { id: "a4", title: "Deploy AI Monitoring Tools", urgency: "medium", steps: 5 },
  ],

  frameworks: [
    { name: "SOC 2", effectivenessPct: 91, effective: 62, total: 68 },
    { name: "NIST CSF", effectivenessPct: 85, effective: 44, total: 52 },
    { name: "CIS v8.1", effectivenessPct: 84, effective: 36, total: 43 },
  ],

  aiFrameworks: [
    { name: "NIST AI RMF", score: 35 },
    { name: "NIST CSF 2.0 AI", score: 58 },
    { name: "CIS v8.1 AI", score: 45 },
    { name: "ISO 42001", score: 15 },
  ],
};
