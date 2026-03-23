"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Loader2,
  TrendingUp,
  Clock,
  Shield,
  DollarSign,
  Lock,
  Unlock,
  Leaf,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface VehicleMatch {
  match_score: number;
  suitability: string;
  risk_alignment: number;
  return_alignment: number;
  liquidity_alignment: number;
  tax_alignment: number;
  reasons: string[];
  commentary: string;
  vehicle: {
    id: number;
    name: string;
    slug: string;
    category: string;
    subcategory: string;
    description: string;
    min_investment: number;
    accreditation: string;
    lockup_years: number;
    liquidity: string;
    target_irr_low: number | null;
    target_irr_high: number | null;
    target_yield: number | null;
    risk_level: string;
    fees_mgmt: number | null;
    fees_perf: number | null;
    tax_form: string;
    key_risks: string[];
    key_benefits: string[];
  };
}

const CATEGORY_LABELS: Record<string, string> = {
  private_equity: "Private Equity",
  hedge_fund: "Hedge Funds",
  real_estate: "Real Estate",
  private_credit: "Private Credit",
  infrastructure: "Infrastructure & Real Assets",
  commodity: "Commodities",
  digital_asset: "Digital Assets",
  collectible: "Collectibles",
  insurance_linked: "Insurance-Linked",
  structured_product: "Structured Products",
  other: "Other / Hybrid",
};

const SUITABILITY_COLORS: Record<string, string> = {
  excellent: "text-gain-green",
  good: "text-accent-blue",
  moderate: "text-warning-amber",
  poor: "text-text-tertiary",
};

const RISK_COLORS: Record<string, string> = {
  low: "text-gain-green",
  medium: "text-warning-amber",
  high: "text-loss-red",
  very_high: "text-loss-red",
};

export default function DDQResultsPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<VehicleMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);
  const [filterSuitability, setFilterSuitability] = useState<string>("all");

  useEffect(() => {
    fetch("/api/ddq/vehicles?matched=true")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setMatches(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-accent-blue" />
      </div>
    );
  }

  const filtered = filterSuitability === "all"
    ? matches
    : matches.filter((m) => m.suitability === filterSuitability);

  const excellent = matches.filter((m) => m.suitability === "excellent").length;
  const good = matches.filter((m) => m.suitability === "good").length;

  // Group by category
  const grouped = new Map<string, VehicleMatch[]>();
  for (const m of filtered) {
    const cat = m.vehicle.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(m);
  }

  return (
    <div className="px-4 pt-2 pb-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => router.push("/ddq")}
          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-text-secondary"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-[20px] font-semibold text-text-primary">
            Your Investment Matches
          </h1>
          <p className="text-[13px] text-text-secondary">
            {excellent + good} strong matches across {grouped.size} categories
          </p>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-bg-surface border border-border-default rounded-[12px] p-3 text-center">
          <p className="text-[20px] font-bold text-gain-green tabular-nums">{excellent}</p>
          <p className="text-[11px] text-text-tertiary">Excellent</p>
        </div>
        <div className="bg-bg-surface border border-border-default rounded-[12px] p-3 text-center">
          <p className="text-[20px] font-bold text-accent-blue tabular-nums">{good}</p>
          <p className="text-[11px] text-text-tertiary">Good</p>
        </div>
        <div className="bg-bg-surface border border-border-default rounded-[12px] p-3 text-center">
          <p className="text-[20px] font-bold text-text-primary tabular-nums">{matches.length}</p>
          <p className="text-[11px] text-text-tertiary">Total Scored</p>
        </div>
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
        {["all", "excellent", "good", "moderate"].map((f) => (
          <button
            key={f}
            onClick={() => setFilterSuitability(f)}
            className={`
              shrink-0 px-3 py-1.5 rounded-full text-[13px] font-medium min-h-[36px]
              transition-colors duration-200
              ${filterSuitability === f
                ? "bg-accent-blue text-white"
                : "bg-bg-surface text-text-secondary hover:bg-bg-surface-hover"
              }
            `}
          >
            {f === "all" ? `All (${matches.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)}`}
          </button>
        ))}
      </div>

      {/* Results by category */}
      {Array.from(grouped.entries()).map(([category, categoryMatches]) => (
        <div key={category} className="mb-6">
          <h3 className="text-[14px] font-medium text-text-secondary mb-2 uppercase tracking-wide">
            {CATEGORY_LABELS[category] || category}
          </h3>

          <div className="flex flex-col gap-2">
            {categoryMatches.map((m) => {
              const expanded = expandedSlug === m.vehicle.slug;

              return (
                <div
                  key={m.vehicle.slug}
                  className="bg-bg-surface border border-border-default rounded-[12px] overflow-hidden"
                >
                  {/* Collapsed view */}
                  <button
                    onClick={() => setExpandedSlug(expanded ? null : m.vehicle.slug)}
                    className="w-full p-3 flex items-center gap-3 text-left min-h-[56px]"
                  >
                    {/* Score badge */}
                    <div className={`
                      w-11 h-11 rounded-[10px] flex items-center justify-center shrink-0 font-bold text-[15px] tabular-nums
                      ${m.match_score >= 80 ? "bg-gain-green/20 text-gain-green"
                        : m.match_score >= 65 ? "bg-accent-blue/20 text-accent-blue"
                        : m.match_score >= 50 ? "bg-warning-amber/20 text-warning-amber"
                        : "bg-bg-elevated text-text-tertiary"
                      }
                    `}>
                      {Math.round(m.match_score)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-text-primary truncate">
                        {m.vehicle.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[12px] font-medium ${SUITABILITY_COLORS[m.suitability]}`}>
                          {m.suitability.toUpperCase()}
                        </span>
                        <span className="text-[11px] text-text-tertiary">·</span>
                        <span className={`text-[11px] ${RISK_COLORS[m.vehicle.risk_level]}`}>
                          {m.vehicle.risk_level} risk
                        </span>
                      </div>
                    </div>

                    {expanded
                      ? <ChevronUp className="h-4 w-4 text-text-tertiary shrink-0" />
                      : <ChevronDown className="h-4 w-4 text-text-tertiary shrink-0" />
                    }
                  </button>

                  {/* Expanded detail */}
                  {expanded && (
                    <div className="px-3 pb-3 border-t border-border-default pt-3">
                      <p className="text-[13px] text-text-secondary mb-3">
                        {m.vehicle.description}
                      </p>

                      {/* AI Commentary */}
                      {m.commentary && (
                        <div className="bg-accent-blue/5 border border-accent-blue/20 rounded-[8px] p-3 mb-3">
                          <p className="text-[13px] text-text-primary italic">{m.commentary}</p>
                        </div>
                      )}

                      {/* Alignment bars */}
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <AlignmentBar label="Risk" value={m.risk_alignment} icon={Shield} />
                        <AlignmentBar label="Returns" value={m.return_alignment} icon={TrendingUp} />
                        <AlignmentBar label="Liquidity" value={m.liquidity_alignment} icon={Clock} />
                        <AlignmentBar label="Tax" value={m.tax_alignment} icon={DollarSign} />
                      </div>

                      {/* Key metrics */}
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        <MetricPill
                          label="Min Investment"
                          value={`$${m.vehicle.min_investment.toLocaleString()}`}
                        />
                        {m.vehicle.target_irr_low && m.vehicle.target_irr_high && (
                          <MetricPill
                            label="Target IRR"
                            value={`${m.vehicle.target_irr_low}-${m.vehicle.target_irr_high}%`}
                          />
                        )}
                        {m.vehicle.target_yield && (
                          <MetricPill label="Yield" value={`${m.vehicle.target_yield}%`} />
                        )}
                        <MetricPill label="Lockup" value={`${m.vehicle.lockup_years} yr`} />
                        <MetricPill label="Tax" value={m.vehicle.tax_form} />
                        {m.vehicle.fees_mgmt && (
                          <MetricPill
                            label="Fees"
                            value={`${(m.vehicle.fees_mgmt * 100).toFixed(1)}/${m.vehicle.fees_perf ? (m.vehicle.fees_perf * 100).toFixed(0) : "0"}`}
                          />
                        )}
                        <MetricPill
                          label="Liquidity"
                          value={m.vehicle.liquidity}
                          icon={m.vehicle.liquidity === "liquid" ? Unlock : Lock}
                        />
                      </div>

                      {/* Match reasons */}
                      {m.reasons.length > 0 && (
                        <div className="mb-3">
                          <p className="text-[12px] font-medium text-text-secondary mb-1">Why this matches:</p>
                          <ul className="space-y-1">
                            {m.reasons.slice(0, 4).map((r, i) => (
                              <li key={i} className="text-[12px] text-text-secondary flex items-start gap-1.5">
                                <span className="text-accent-blue mt-0.5">•</span>
                                {r}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Key benefits & risks */}
                      <div className="grid grid-cols-2 gap-2">
                        {m.vehicle.key_benefits.length > 0 && (
                          <div>
                            <p className="text-[11px] font-medium text-gain-green mb-1">Benefits</p>
                            {m.vehicle.key_benefits.slice(0, 3).map((b, i) => (
                              <p key={i} className="text-[11px] text-text-tertiary">+ {b}</p>
                            ))}
                          </div>
                        )}
                        {m.vehicle.key_risks.length > 0 && (
                          <div>
                            <p className="text-[11px] font-medium text-loss-red mb-1">Risks</p>
                            {m.vehicle.key_risks.slice(0, 3).map((r, i) => (
                              <p key={i} className="text-[11px] text-text-tertiary">– {r}</p>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Improve accuracy CTA */}
      <div className="bg-bg-surface border border-border-default rounded-[12px] p-4 mt-4">
        <p className="text-[14px] text-text-primary font-medium mb-1">
          Want better matches?
        </p>
        <p className="text-[13px] text-text-secondary mb-3">
          Complete more DDQ questions to improve match accuracy.
        </p>
        <Button variant="secondary" fullWidth onClick={() => router.push("/ddq")}>
          Continue Profiling
        </Button>
      </div>
    </div>
  );
}

// ── Sub-components ──

function AlignmentBar({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
      <div className="flex-1">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-[11px] text-text-tertiary">{label}</span>
          <span className="text-[11px] text-text-secondary tabular-nums">{Math.round(value)}%</span>
        </div>
        <div className="h-1.5 bg-bg-elevated rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              value >= 75 ? "bg-gain-green" : value >= 50 ? "bg-accent-blue" : "bg-warning-amber"
            }`}
            style={{ width: `${value}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function MetricPill({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ElementType;
}) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-bg-elevated text-[11px]">
      {Icon && <Icon className="h-3 w-3 text-text-tertiary" />}
      <span className="text-text-tertiary">{label}:</span>
      <span className="text-text-secondary font-medium">{value}</span>
    </span>
  );
}
