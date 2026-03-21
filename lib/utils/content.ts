/** Single source of truth for UI copy — matches docs/content.md */

export const content = {
  screenTitles: {
    home: "Home",
    risk: "Risk Scenarios",
    actions: "Recommended Actions",
    ai: "AI Posture",
    funds: "Funds",
  },

  sectionLabels: {
    ale: "Annual Loss Exposure",
    controlsEffective: "Controls Effective",
    policyCoverage: "Policy Coverage",
    incidentReadiness: "Incident Readiness",
  },

  buttons: {
    talkToAdvisor: "Talk to Advisor",
    markResolved: "Mark as Resolved",
    scheduleCall: "Schedule a Call",
    viewAll: "View all",
  },

  emptyStates: {
    noFunds: {
      message: "No funds configured yet. Add your first fund to get started.",
      cta: "Add Fund",
    },
    noRisks: {
      message: "No risk scenarios have been assessed. Run your first assessment.",
      cta: "Start Assessment",
    },
    noActions: {
      message: "No recommended actions. Your governance posture is strong.",
      cta: undefined,
    },
    noAITools: {
      message: "No AI tools have been inventoried.",
      cta: "Add Tool",
    },
    noAssessment: {
      message: "Awaiting first assessment. Data will appear once your advisor completes the initial review.",
      cta: "Contact Advisor",
    },
    newOrg: {
      message: "Welcome! Let's set up your governance program.",
      cta: "Start Setup",
    },
  },

  errors: {
    apiTimeout: "Unable to load data. Pull down to refresh or try again in a moment.",
    authFailure: "Session expired. Please log in again.",
    offline: "You're offline. Changes will sync when you reconnect.",
    permissionDenied: "You don't have access to this feature. Contact your administrator.",
    rateLimited: "Too many requests. Please wait a moment.",
    chatError: "Unable to reach the AI assistant. Try again in a few seconds.",
    exportFailed: "PDF generation failed. Please try again.",
    generic: "Something went wrong. Please try again.",
  },

  loading: {
    saving: "Saving…",
    resolving: "Resolving…",
    scheduling: "Scheduling…",
    thinking: "Thinking…",
    exporting: "Generating your report…",
  },

  toasts: {
    resolved: (title: string) => `${title} resolved`,
    undone: (title: string) => `${title} restored`,
    advisorBooked: (time: string) => `Call scheduled for ${time}`,
    exportReady: "Report downloaded",
    error: "Something went wrong. Please try again.",
  },
} as const;
