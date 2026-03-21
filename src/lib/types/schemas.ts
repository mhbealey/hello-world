import { z } from "zod";

// ---- Claude API Response Schemas ----

export const factorScoreSchema = z.object({
  score: z.number().min(1).max(10),
  inputs: z.array(z.string()),
  reasoning: z.string(),
});

export const recommendationItemSchema = z.object({
  ticker: z.string().min(1).max(10),
  company_name: z.string().min(1),
  ai_score: z.number().min(1).max(10),
  rating: z.enum(["strong_buy", "buy", "hold", "sell", "strong_sell"]),
  confidence: z.number().min(0).max(1),
  thesis: z.string().min(1),
  bull_case: z.object({
    headline: z.string(),
    points: z.array(z.string()).min(2).max(3),
  }),
  bear_case: z.object({
    headline: z.string(),
    points: z.array(z.string()).min(2).max(3),
  }),
  key_metrics: z.object({
    pe: z.number().nullable(),
    pe_sector_avg: z.number().nullable(),
    ps: z.number().nullable(),
    ev_ebitda: z.number().nullable(),
    debt_equity: z.number().nullable(),
    revenue_growth: z.number().nullable(),
    margins: z.object({
      gross: z.number().nullable(),
      operating: z.number().nullable(),
      net: z.number().nullable(),
    }),
  }),
  factor_scores: z.object({
    technical: factorScoreSchema,
    fundamental: factorScoreSchema,
    sentiment: factorScoreSchema,
    momentum: factorScoreSchema,
    earnings: factorScoreSchema,
  }),
  entry_price: z.number().positive(),
  stop_loss: z.number().positive(),
  take_profit: z.number().positive(),
  order_type: z.enum(["market", "limit", "stop_limit"]),
  position_size_pct: z.number().min(0.005).max(0.1),
  time_sensitivity: z.enum(["act_today", "this_week", "monitor"]),
  holding_period: z.string(),
  catalysts: z.array(
    z.object({
      date: z.string(),
      event: z.string(),
      description: z.string(),
    })
  ),
  comparable_companies: z.array(
    z.object({
      ticker: z.string(),
      ai_score: z.number(),
      brief: z.string(),
    })
  ),
  full_analysis: z.string().min(1),
});

export const claudeResponseSchema = z.object({
  recommendations: z.array(recommendationItemSchema),
});

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

// ---- Type exports ----
export type RecommendationItem = z.infer<typeof recommendationItemSchema>;
export type ClaudeResponse = z.infer<typeof claudeResponseSchema>;
export type ProfileForm = z.infer<typeof profileFormSchema>;
export type TradeForm = z.infer<typeof tradeFormSchema>;
