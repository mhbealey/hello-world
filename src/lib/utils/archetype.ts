interface ArchetypeInput {
  style: string;
  riskTolerance: number;
  instruments: string[];
}

interface ArchetypeResult {
  name: string;
  description: string;
}

const ARCHETYPE_MAP: Record<string, ArchetypeResult> = {
  "growth_4_stocks_options": { name: "Momentum Rider", description: "You seek high-growth stocks with strong momentum, willing to take calculated risks for outsized returns." },
  "growth_3_stocks": { name: "Steady Growth Seeker", description: "You look for quality growth companies with solid fundamentals, holding through volatility with confidence." },
  "value_3_stocks": { name: "Contrarian Alpha", description: "You buy when others are fearful, finding undervalued companies with strong fundamentals and patient conviction." },
  "value_4_stocks": { name: "Contrarian Alpha", description: "You buy when others are fearful, finding undervalued companies with strong fundamentals and patient conviction." },
  "value_2_stocks_etfs": { name: "Cautious Value Hunter", description: "You seek margin of safety in your investments, preferring proven value with downside protection." },
  "value_1_stocks_etfs": { name: "Cautious Value Hunter", description: "You seek margin of safety in your investments, preferring proven value with downside protection." },
  "momentum_4_stocks_options_crypto": { name: "Aggressive Tactician", description: "You thrive on market action, using technical signals and momentum to capture short-term opportunities." },
  "momentum_3_stocks": { name: "Trend Surfer", description: "You ride established trends with disciplined entries and exits, following the market's direction." },
  "income_3_stocks_etfs": { name: "Steady Compounder", description: "You build wealth through consistent dividends and compound growth, focused on reliable income streams." },
  "income_2_stocks_etfs": { name: "Steady Compounder", description: "You build wealth through consistent dividends and compound growth, focused on reliable income streams." },
  "income_4_stocks_etfs": { name: "Dividend Opportunist", description: "You combine dividend investing with opportunistic buying during market dips to maximize income and growth." },
};

export function computeArchetype(input: ArchetypeInput): ArchetypeResult {
  const instrumentKey = input.instruments.sort().join("_");
  const key = `${input.style}_${input.riskTolerance}_${instrumentKey}`;

  if (ARCHETYPE_MAP[key]) return ARCHETYPE_MAP[key];

  // Fallback: match by style + risk tolerance
  const partialKey = `${input.style}_${input.riskTolerance}`;
  const partial = Object.entries(ARCHETYPE_MAP).find(([k]) => k.startsWith(partialKey));
  if (partial) return partial[1];

  // Fallback: match by style only
  const styleMatch = Object.entries(ARCHETYPE_MAP).find(([k]) => k.startsWith(input.style));
  if (styleMatch) return styleMatch[1];

  return { name: "Balanced Investor", description: "You take a balanced approach to investing, weighing risk and reward carefully." };
}

export function computeRiskScore(riskTolerance: number, instruments: string[]): number {
  let score = riskTolerance * 2; // 2-8 base
  if (instruments.includes("options")) score += 1;
  if (instruments.includes("crypto")) score += 1;
  return Math.min(10, Math.max(1, score));
}
