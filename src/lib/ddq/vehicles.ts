/**
 * Vehicle type definitions for alternative investment vehicles.
 *
 * These types describe the characteristics of funds, PE deals, hedge funds,
 * real-asset vehicles, and other alternatives that investors may be matched to
 * through the DDQ scoring engine.
 */

export type AccreditationRequirement =
  | "non_accredited"
  | "accredited"
  | "qualified_purchaser";

export type VehicleTaxCharacteristic =
  | "tax_exempt"
  | "tax_deferred"
  | "tax_inefficient"
  | "pass_through";

export interface Vehicle {
  /** Unique identifier for the vehicle. */
  id: string;

  /** Human-readable name. */
  name: string;

  /** Brief description of the vehicle strategy. */
  description: string;

  /** Minimum accreditation level required by the offering. */
  accreditation_requirement: AccreditationRequirement;

  /** Minimum investment amount in USD. */
  min_investment: number;

  /** Lock-up period in years (0 for open-ended / daily-liquid). */
  lock_up_years: number;

  /** Expected total lifecycle of the vehicle in years. */
  lifecycle_years: number;

  /**
   * Risk level on a 1-5 scale where:
   *   1 = conservative, 2 = moderate-conservative, 3 = moderate,
   *   4 = moderate-aggressive, 5 = aggressive.
   */
  risk_level: number;

  /** Whether the vehicle requires capital calls from investors. */
  requires_capital_calls: boolean;

  /** Whether the vehicle issues K-1 tax forms. */
  produces_k1: boolean;

  /** Expected gross return range [low, high] as percentages. */
  return_range: [number, number];

  /** Sectors the vehicle is primarily exposed to. */
  sectors: string[];

  /** Whether the vehicle meets ESG criteria. */
  esg: boolean;

  /** Tax characteristics of the vehicle. */
  tax_characteristics: VehicleTaxCharacteristic[];

  /**
   * Complexity score 0-100.
   * Higher values mean a more complex structure (e.g. multi-layer PE vs.
   * a plain interval fund).
   */
  complexity_score: number;

  /**
   * Estimated correlation to the S&P 500 (-1 to 1).
   * Used to evaluate diversification benefit.
   */
  correlation_to_sp500: number;
}
