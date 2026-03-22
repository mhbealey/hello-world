import { z } from "zod";

// ---- Claude API Response Schemas ----

export const recommendationItemSchema = z.object({
  ticker: z.string().min(1).max(10),
  company_name: z.string().min(1),
  ai_score: z.number().min(1).max(10),
  rating: z.enum(["strong_buy", "buy", "hold", "sell", "strong_sell"]),
  confidence: z.number().min(0).max(1),
  thesis: z.string().min(1),
  entry_price: z.number().positive(),
  stop_loss: z.number().positive(),
  take_profit: z.number().positive(),
  position_size_pct: z.number().min(0.005).max(0.1),
  time_sensitivity: z.enum(["act_today", "this_week", "monitor"]),
});

export const claudeResponseSchema = z.object({
  recommendations: z.array(recommendationItemSchema),
});

// ---- Bundle Response Schema ----

export const bundleAllocationSchema = z.object({
  ticker: z.string().min(1),
  company_name: z.string().min(1),
  weight_pct: z.number().min(0).max(1),
  ai_score: z.number().min(1).max(10),
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
