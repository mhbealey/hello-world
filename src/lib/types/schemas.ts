import { z } from "zod";

// ---- Claude API Response Schemas ----

export const factorScoreSchema = z.object({
  score: z.number().min(1).max(10),
  inputs: z.array(z.string()).default([]),
  reasoning: z.string().default(""),
});

// Lenient factor score: accepts number or object
const lenientFactorScore = z.union([
  factorScoreSchema,
  z.number().min(1).max(10).transform((n) => ({ score: n, inputs: [], reasoning: "" })),
]).default({ score: 5, inputs: [], reasoning: "" });

export const governanceDetailsSchema = z.object({
  board_changes: z.string().default(""),
  ceo_changes: z.string().default(""),
  ma_activity: z.string().default(""),
});

// Lenient bull/bear case: accepts object or string
const lenientCase = z.union([
  z.object({
    headline: z.string().default(""),
    points: z.array(z.string()).default([]),
  }),
  z.string().transform((s) => ({ headline: s, points: [] })),
]).default({ headline: "", points: [] });

export const recommendationItemSchema = z.object({
  ticker: z.string().min(1).max(10),
  company_name: z.string().default("Unknown"),
  asset_class: z.enum(["stock", "etf", "bond", "reit", "commodity", "business", "real_estate", "crypto"]).default("stock"),
  ai_score: z.number().min(1).max(10),
  rating: z.enum(["strong_buy", "buy", "hold", "sell", "strong_sell"]),
  confidence: z.number().min(0).max(1),
  thesis: z.string().default(""),
  bull_case: lenientCase,
  bear_case: lenientCase,
  key_metrics: z.object({
    pe: z.number().nullable().default(null),
    pe_sector_avg: z.number().nullable().default(null),
    ps: z.number().nullable().default(null),
    ev_ebitda: z.number().nullable().default(null),
    debt_equity: z.number().nullable().default(null),
    revenue_growth: z.number().nullable().default(null),
    margins: z.object({
      gross: z.number().nullable().default(null),
      operating: z.number().nullable().default(null),
      net: z.number().nullable().default(null),
    }).default({ gross: null, operating: null, net: null }),
  }).default({ pe: null, pe_sector_avg: null, ps: null, ev_ebitda: null, debt_equity: null, revenue_growth: null, margins: { gross: null, operating: null, net: null } }),
  factor_scores: z.object({
    technical: lenientFactorScore,
    fundamental: lenientFactorScore,
    sentiment: lenientFactorScore,
    momentum: lenientFactorScore,
    earnings: lenientFactorScore,
    governance: lenientFactorScore,
    macro: lenientFactorScore,
  }).default({
    technical: { score: 5, inputs: [], reasoning: "" },
    fundamental: { score: 5, inputs: [], reasoning: "" },
    sentiment: { score: 5, inputs: [], reasoning: "" },
    momentum: { score: 5, inputs: [], reasoning: "" },
    earnings: { score: 5, inputs: [], reasoning: "" },
    governance: { score: 5, inputs: [], reasoning: "" },
    macro: { score: 5, inputs: [], reasoning: "" },
  }),
  governance_details: governanceDetailsSchema.optional(),
  entry_price: z.number().positive(),
  stop_loss: z.number().positive(),
  take_profit: z.number().positive(),
  order_type: z.enum(["market", "limit", "stop_limit"]).default("limit"),
  position_size_pct: z.number().min(0).max(1).default(0.03),
  time_sensitivity: z.enum(["act_today", "this_week", "monitor"]).default("this_week"),
  holding_period: z.string().default("2-4 weeks"),
  catalysts: z.array(
    z.object({
      date: z.string(),
      event: z.string(),
      description: z.string().default(""),
    })
  ).default([]),
  comparable_companies: z.array(
    z.object({
      ticker: z.string(),
      ai_score: z.number(),
      brief: z.string().default(""),
    })
  ).default([]),
  full_analysis: z.string().default(""),
});

export const claudeResponseSchema = z.object({
  recommendations: z.array(recommendationItemSchema),
});

// Also accept a bare array of recommendations (Claude sometimes omits the wrapper)
export const lenientClaudeResponseSchema = z.union([
  claudeResponseSchema,
  z.array(recommendationItemSchema).transform((recs) => ({ recommendations: recs })),
]);

// Custom refinement: stop_loss < entry_price and take_profit > entry_price for buys
export const validatedRecommendationSchema = recommendationItemSchema.refine(
  (rec) => {
    if (rec.rating !== "sell" && rec.rating !== "strong_sell") {
      return rec.stop_loss < rec.entry_price && rec.take_profit > rec.entry_price;
    }
    return true;
  },
  { message: "For buy recommendations: stop_loss must be < entry_price and take_profit must be > entry_price" }
);

// ---- Bundle Response Schema ----

export const bundleAllocationSchema = z.object({
  ticker: z.string().min(1),
  company_name: z.string().min(1),
  asset_class: z.enum(["stock", "etf", "bond", "reit", "commodity", "business", "real_estate", "crypto"]).default("stock"),
  weight_pct: z.number().min(0).max(1),
  benchmark_score: z.number().min(1).max(99),
  ai_score: z.number().min(1).max(10),
  factor_scores: z.object({
    technical: z.number().min(1).max(10),
    fundamental: z.number().min(1).max(10),
    sentiment: z.number().min(1).max(10),
    momentum: z.number().min(1).max(10),
    earnings: z.number().min(1).max(10),
    governance: z.number().min(1).max(10),
    macro: z.number().min(1).max(10).optional(),
  }),
  thesis: z.string(),
  entry_price: z.number().positive(),
  stop_loss: z.number().positive(),
  take_profit: z.number().positive(),
});

export const bundleResponseSchema = z.object({
  bundle_name: z.string().min(1),
  strategy: z.string(),
  total_score: z.number().min(1).max(99),
  rationale: z.string().min(1),
  allocations: z.array(bundleAllocationSchema),
});

// ---- Form Validation Schemas ----

export const profileFormSchema = z.object({
  investing_style: z.enum(["growth", "value", "momentum", "income"]),
  risk_tolerance: z.number().min(1).max(4),
  instruments: z.array(z.string()).min(1),
  portfolio_size_range: z.enum(["10k-25k", "25k-100k", "100k-500k", "500k+"]),
  portfolio_balance: z.number().positive(),
});

export const tradeFormSchema = z.object({
  ticker: z.string().min(1).max(10),
  action: z.enum(["buy", "sell"]),
  shares: z.number().positive(),
  entry_price: z.number().positive(),
  order_type: z.string(),
  stop_loss: z.number().positive().optional(),
  take_profit: z.number().positive().optional(),
  notes: z.string().optional(),
  source: z.enum(["ai_recommendation", "manual"]),
  recommendation_id: z.number().optional(),
});

export const balanceUpdateSchema = z.object({
  portfolio_balance: z.number().positive(),
});

export const closeTradeSchema = z.object({
  exit_price: z.number().positive(),
  exit_date: z.string(),
  shares_to_close: z.number().positive().optional(),
});

export const bundleFilterSchema = z.object({
  size: z.enum(["1", "3", "5", "10", "20"]),
  strategy: z.enum(["growth", "value", "balanced", "income", "aggressive"]).default("balanced"),
  asset_classes: z.array(z.enum(["stock", "etf", "bond", "reit", "commodity", "business", "real_estate", "crypto"])).optional(),
  min_score: z.number().min(1).max(99).optional(),
  sectors: z.array(z.string()).optional(),
});

// ---- Type exports ----
export type RecommendationItem = z.infer<typeof recommendationItemSchema>;
export type ClaudeResponse = z.infer<typeof claudeResponseSchema>;
export type ProfileForm = z.infer<typeof profileFormSchema>;
export type TradeForm = z.infer<typeof tradeFormSchema>;
export type BundleAllocation = z.infer<typeof bundleAllocationSchema>;
export type BundleResponse = z.infer<typeof bundleResponseSchema>;
export type BundleFilter = z.infer<typeof bundleFilterSchema>;
