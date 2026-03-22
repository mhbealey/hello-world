/**
 * Two-pass scoring engine for matching investors to alternative investment vehicles.
 *
 * Pass 1 – Hard eligibility filters (binary gates).
 *   A vehicle that fails any gate is ineligible regardless of suitability.
 *
 * Pass 2 – Seven-dimension suitability scoring (0-100 composite).
 *   Each dimension produces a normalised 0-1 value, weighted and summed to a
 *   0-100 composite. A correlation-benefit bonus can push the effective score
 *   above the base 100 ceiling by up to 10 points.
 *
 * @module scoring
 */

import type { Vehicle, AccreditationRequirement } from "./vehicles";

// ---------------------------------------------------------------------------
// Investor profile
// ---------------------------------------------------------------------------

export interface InvestorProfile {
  accreditation_status: "non_accredited" | "accredited" | "qualified_purchaser";
  liquid_net_worth: number;
  total_net_worth: number;
  annual_income: number;
  time_horizon_years: number;
  /** Willingness to take risk, 0-100. */
  risk_score: number;
  /** Objective ability to absorb loss, 0-100. */
  risk_capacity: number;
  /** Sensitivity to drawdowns, 0-100 (higher = more averse). */
  loss_aversion: number;
  /** Self-assessed / advisor-assessed sophistication, 0-100. */
  sophistication_score: number;
  /** Need for near-term liquidity, 0-100 (higher = greater need). */
  liquidity_need: number;
  /** Target annualised return as a percentage (e.g. 8 for 8%). */
  target_return: number;
  tax_bracket: "low" | "medium" | "high" | "highest";
  k1_tolerance: boolean;
  /** Maximum acceptable peak-to-trough drawdown as a percentage. */
  max_drawdown_pct: number;
  capital_call_ready: boolean;
  existing_allocation: {
    equities: number;
    fixed_income: number;
    alternatives: number;
    cash: number;
    crypto: number;
  };
  sector_exclusions: string[];
  esg_required: boolean;
  experience_years: number;
}

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export interface EligibilityResult {
  eligible: boolean;
  failures: string[];
}

export interface SuitabilityResult {
  score: number;
  dimension_scores: Record<string, number>;
}

export interface MatchResult {
  vehicle_id: string;
  eligible: boolean;
  eligibility_failures: string[];
  suitability_score: number;
  dimension_scores: Record<string, number>;
  /** Top 3 DDQ-traced reasons for or against the match. */
  top_reasons: string[];
  /** Confidence in the composite score (0-1). */
  confidence: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ACCREDITATION_RANK: Record<AccreditationRequirement, number> = {
  non_accredited: 0,
  accredited: 1,
  qualified_purchaser: 2,
};

/** Maximum concentration: min_investment must not exceed this fraction of liquid net worth. */
const MAX_CONCENTRATION = 0.25;

/** Suitability dimension weights (must sum to 1.0). */
const WEIGHTS = {
  risk_match: 0.25,
  liquidity_match: 0.2,
  time_horizon_match: 0.2,
  return_expectation_match: 0.15,
  tax_efficiency_match: 0.1,
  complexity_tolerance_match: 0.1,
} as const;

/** Maximum bonus for correlation benefit. */
const CORRELATION_BONUS_CAP = 10;

/** Threshold for "high equity allocation" when evaluating diversification. */
const HIGH_EQUITY_THRESHOLD = 0.4;

// ---------------------------------------------------------------------------
// Pass 1: Hard eligibility filters
// ---------------------------------------------------------------------------

/**
 * Run all binary eligibility gates.
 *
 * Each gate is independent – we collect *all* failures so the caller can
 * present a complete picture rather than failing fast.
 */
export function runEligibilityFilters(
  profile: InvestorProfile,
  vehicle: Vehicle,
): EligibilityResult {
  const failures: string[] = [];

  // 1. Accreditation
  if (
    ACCREDITATION_RANK[profile.accreditation_status] <
    ACCREDITATION_RANK[vehicle.accreditation_requirement]
  ) {
    failures.push(
      `Investor accreditation "${profile.accreditation_status}" does not meet vehicle requirement "${vehicle.accreditation_requirement}".`,
    );
  }

  // 2. Minimum investment & concentration
  if (profile.liquid_net_worth < vehicle.min_investment) {
    failures.push(
      `Liquid net worth ($${fmt(profile.liquid_net_worth)}) is below the minimum investment ($${fmt(vehicle.min_investment)}).`,
    );
  } else if (vehicle.min_investment > profile.liquid_net_worth * MAX_CONCENTRATION) {
    failures.push(
      `Minimum investment ($${fmt(vehicle.min_investment)}) exceeds ${MAX_CONCENTRATION * 100}% of liquid net worth ($${fmt(profile.liquid_net_worth)}), creating excessive concentration.`,
    );
  }

  // 3. Time horizon
  if (profile.time_horizon_years < vehicle.lock_up_years) {
    failures.push(
      `Investor time horizon (${profile.time_horizon_years}y) is shorter than the vehicle lock-up period (${vehicle.lock_up_years}y).`,
    );
  }

  // 4. Capital call readiness
  if (vehicle.requires_capital_calls && !profile.capital_call_ready) {
    failures.push(
      "Vehicle requires capital calls but investor is not capital-call ready.",
    );
  }

  // 5. K-1 tolerance
  if (vehicle.produces_k1 && !profile.k1_tolerance) {
    failures.push(
      "Vehicle produces K-1 tax forms but investor does not tolerate K-1s.",
    );
  }

  // 6. Sector exclusions
  const excluded = vehicle.sectors.filter((s) =>
    profile.sector_exclusions.some(
      (ex) => ex.toLowerCase() === s.toLowerCase(),
    ),
  );
  if (excluded.length > 0) {
    failures.push(
      `Vehicle sectors [${excluded.join(", ")}] conflict with investor exclusions.`,
    );
  }

  // 7. ESG
  if (profile.esg_required && !vehicle.esg) {
    failures.push(
      "Investor requires ESG compliance but vehicle does not meet ESG criteria.",
    );
  }

  return { eligible: failures.length === 0, failures };
}

// ---------------------------------------------------------------------------
// Pass 2: Suitability scoring
// ---------------------------------------------------------------------------

/**
 * Compute a composite suitability score (0-100, with up to 10 bonus points
 * from correlation benefit) across seven dimensions.
 */
export function computeSuitabilityScore(
  profile: InvestorProfile,
  vehicle: Vehicle,
): SuitabilityResult {
  const dimensions: Record<string, number> = {};

  // 1. Risk match (25%)
  //    Map investor 0-100 risk_score to a 1-5 scale, then compare to vehicle risk_level.
  const investorRiskLevel = profile.risk_score / 20; // 0-5 continuous
  const riskDelta = Math.abs(investorRiskLevel - vehicle.risk_level);
  dimensions.risk_match = clamp01(1 - riskDelta / 4);

  // 2. Liquidity match (20%)
  //    Penalise when the vehicle lock-up exceeds the investor's horizon.
  const horizonOverhang = Math.max(
    0,
    vehicle.lock_up_years - profile.time_horizon_years,
  );
  dimensions.liquidity_match =
    profile.time_horizon_years > 0
      ? clamp01(1 - horizonOverhang / profile.time_horizon_years)
      : vehicle.lock_up_years === 0
        ? 1
        : 0;

  // 3. Time horizon match (20%)
  //    Best when vehicle lifecycle aligns with investor horizon.
  //    Tolerance band: score 1.0 when within +/- 20% of horizon.
  const lifecycleDelta = Math.abs(
    vehicle.lifecycle_years - profile.time_horizon_years,
  );
  const horizonTolerance = Math.max(1, profile.time_horizon_years * 0.2);
  dimensions.time_horizon_match = clamp01(
    1 - Math.max(0, lifecycleDelta - horizonTolerance) / profile.time_horizon_years,
  );

  // 4. Return expectation match (15%)
  //    Compare target return to midpoint of vehicle return range.
  const vehicleMidReturn =
    (vehicle.return_range[0] + vehicle.return_range[1]) / 2;
  const returnSpread = vehicle.return_range[1] - vehicle.return_range[0];
  const maxRange = Math.max(returnSpread, 10); // floor at 10 to avoid division issues
  const returnDelta = Math.abs(profile.target_return - vehicleMidReturn);
  dimensions.return_expectation_match = clamp01(1 - returnDelta / maxRange);

  // 5. Tax efficiency match (10%)
  //    Higher brackets prefer tax-efficient vehicles; lower brackets are indifferent.
  dimensions.tax_efficiency_match = computeTaxEfficiency(
    profile.tax_bracket,
    vehicle.tax_characteristics,
  );

  // 6. Complexity tolerance match (10%)
  //    Asymmetric: undersophisticated is penalised, oversophisticated is fine.
  const sophisticationGap =
    vehicle.complexity_score - profile.sophistication_score;
  if (sophisticationGap > 0) {
    // Vehicle is more complex than investor can handle.
    dimensions.complexity_tolerance_match = clamp01(
      1 - sophisticationGap / 100,
    );
  } else {
    // Investor is at or above the vehicle complexity – no penalty.
    dimensions.complexity_tolerance_match = 1;
  }

  // Weighted base score (0-100).
  let baseScore = 0;
  for (const [dim, weight] of Object.entries(WEIGHTS)) {
    baseScore += (dimensions[dim] ?? 0) * weight * 100;
  }

  // 7. Correlation benefit (bonus up to 10 points)
  //    Rewarded when the investor has high equity allocation and the vehicle
  //    has low correlation to the S&P 500.
  const equityFraction = profile.existing_allocation.equities / 100;
  let correlationBonus = 0;
  if (equityFraction >= HIGH_EQUITY_THRESHOLD) {
    correlationBonus =
      ((1 - Math.abs(vehicle.correlation_to_sp500)) / 2) *
      CORRELATION_BONUS_CAP;
  }
  dimensions.correlation_benefit = correlationBonus / CORRELATION_BONUS_CAP; // normalised 0-1

  const score = Math.round((baseScore + correlationBonus) * 100) / 100;

  return { score, dimension_scores: dimensions };
}

// ---------------------------------------------------------------------------
// Combined orchestrator
// ---------------------------------------------------------------------------

/**
 * Match a single investor profile against a set of vehicles.
 *
 * Returns results sorted by suitability score descending (eligible vehicles
 * first, ineligible vehicles last).
 */
export function matchVehicles(
  profile: InvestorProfile,
  vehicles: Vehicle[],
): MatchResult[] {
  const results: MatchResult[] = vehicles.map((vehicle) => {
    const eligibility = runEligibilityFilters(profile, vehicle);
    const suitability = computeSuitabilityScore(profile, vehicle);
    const topReasons = deriveTopReasons(profile, vehicle, eligibility, suitability);
    const confidence = computeConfidence(profile, suitability);

    return {
      vehicle_id: vehicle.id,
      eligible: eligibility.eligible,
      eligibility_failures: eligibility.failures,
      suitability_score: suitability.score,
      dimension_scores: suitability.dimension_scores,
      top_reasons: topReasons,
      confidence,
    };
  });

  // Sort: eligible first, then by score descending.
  results.sort((a, b) => {
    if (a.eligible !== b.eligible) return a.eligible ? -1 : 1;
    return b.suitability_score - a.suitability_score;
  });

  return results;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function clamp01(value: number): number {
  return Math.max(0, Math.min(1, value));
}

function fmt(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 0 });
}

/**
 * Compute tax efficiency alignment.
 *
 * Investors in higher brackets benefit more from tax-efficient vehicles and
 * are penalised more for tax-inefficient ones.
 */
function computeTaxEfficiency(
  bracket: InvestorProfile["tax_bracket"],
  characteristics: Vehicle["tax_characteristics"],
): number {
  const bracketSensitivity: Record<InvestorProfile["tax_bracket"], number> = {
    low: 0.2,
    medium: 0.4,
    high: 0.7,
    highest: 1.0,
  };

  const sensitivity = bracketSensitivity[bracket];

  // Score each characteristic.
  const charScores: Record<string, number> = {
    tax_exempt: 1.0,
    tax_deferred: 0.75,
    pass_through: 0.4,
    tax_inefficient: 0.1,
  };

  if (characteristics.length === 0) return 0.5; // neutral when unknown

  const avgCharScore =
    characteristics.reduce((sum, c) => sum + (charScores[c] ?? 0.5), 0) /
    characteristics.length;

  // For low-bracket investors, tax efficiency barely matters.
  // For high-bracket investors, it matters a lot.
  // Blend toward 0.5 (neutral) as sensitivity decreases.
  return sensitivity * avgCharScore + (1 - sensitivity) * 0.5;
}

/**
 * Derive the top 3 DDQ-traced reasons for/against the match.
 */
function deriveTopReasons(
  profile: InvestorProfile,
  vehicle: Vehicle,
  eligibility: EligibilityResult,
  suitability: SuitabilityResult,
): string[] {
  const reasons: { text: string; priority: number }[] = [];

  // Eligibility failures are always top reasons.
  for (const f of eligibility.failures) {
    reasons.push({ text: f, priority: 100 });
  }

  // Suitability-driven reasons.
  const dims = suitability.dimension_scores;

  if (dims.risk_match !== undefined && dims.risk_match < 0.5) {
    const investorLevel = (profile.risk_score / 20).toFixed(1);
    reasons.push({
      text: `Risk mismatch: investor risk level (${investorLevel}/5) diverges from vehicle risk level (${vehicle.risk_level}/5).`,
      priority: 80,
    });
  } else if (dims.risk_match !== undefined && dims.risk_match >= 0.8) {
    reasons.push({
      text: `Strong risk alignment between investor and vehicle.`,
      priority: 40,
    });
  }

  if (dims.liquidity_match !== undefined && dims.liquidity_match < 0.5) {
    reasons.push({
      text: `Liquidity concern: vehicle lock-up (${vehicle.lock_up_years}y) strains investor's ${profile.time_horizon_years}y horizon.`,
      priority: 75,
    });
  }

  if (dims.return_expectation_match !== undefined && dims.return_expectation_match < 0.5) {
    const mid = ((vehicle.return_range[0] + vehicle.return_range[1]) / 2).toFixed(1);
    reasons.push({
      text: `Return mismatch: investor targets ${profile.target_return}% but vehicle midpoint is ${mid}%.`,
      priority: 70,
    });
  } else if (dims.return_expectation_match !== undefined && dims.return_expectation_match >= 0.8) {
    reasons.push({
      text: `Return expectations well-aligned with vehicle's projected range.`,
      priority: 35,
    });
  }

  if (dims.complexity_tolerance_match !== undefined && dims.complexity_tolerance_match < 0.5) {
    reasons.push({
      text: `Vehicle complexity (${vehicle.complexity_score}/100) exceeds investor sophistication (${profile.sophistication_score}/100).`,
      priority: 65,
    });
  }

  if (dims.correlation_benefit !== undefined && dims.correlation_benefit > 0.5) {
    reasons.push({
      text: `Low correlation to S&P 500 (${vehicle.correlation_to_sp500.toFixed(2)}) provides diversification for equity-heavy portfolio.`,
      priority: 50,
    });
  }

  if (dims.tax_efficiency_match !== undefined && dims.tax_efficiency_match >= 0.7 && profile.tax_bracket === "highest") {
    reasons.push({
      text: `Tax-efficient structure benefits investor's high tax bracket.`,
      priority: 45,
    });
  }

  if (dims.time_horizon_match !== undefined && dims.time_horizon_match >= 0.8) {
    reasons.push({
      text: `Vehicle lifecycle aligns well with investor's ${profile.time_horizon_years}-year horizon.`,
      priority: 30,
    });
  }

  // Sort by priority descending, take top 3.
  reasons.sort((a, b) => b.priority - a.priority);
  return reasons.slice(0, 3).map((r) => r.text);
}

/**
 * Compute a 0-1 confidence score for the suitability result.
 *
 * Confidence is lower when:
 * - Dimension scores are clustered around 0.5 (ambiguous).
 * - The investor profile has low sophistication or experience (less reliable DDQ answers).
 * - Risk score and risk capacity diverge significantly (conflicting signals).
 */
function computeConfidence(
  profile: InvestorProfile,
  suitability: SuitabilityResult,
): number {
  const dims = Object.values(suitability.dimension_scores);

  // 1. Decisiveness: dimensions far from 0.5 are more informative.
  const decisiveness =
    dims.length > 0
      ? dims.reduce((sum, d) => sum + Math.abs(d - 0.5) * 2, 0) / dims.length
      : 0.5;

  // 2. Profile reliability: higher experience + sophistication = more reliable.
  const experienceFactor = clamp01(profile.experience_years / 10);
  const sophisticationFactor = clamp01(profile.sophistication_score / 100);
  const profileReliability = (experienceFactor + sophisticationFactor) / 2;

  // 3. Internal consistency: risk_score vs risk_capacity agreement.
  const riskConsistency =
    1 - Math.abs(profile.risk_score - profile.risk_capacity) / 100;

  // Weighted blend.
  const confidence =
    0.4 * decisiveness + 0.3 * profileReliability + 0.3 * riskConsistency;

  return Math.round(clamp01(confidence) * 100) / 100;
}
