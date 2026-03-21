"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TrendingUp, Search, Zap, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PillSelector } from "@/components/ui/pill-selector";
import { ONBOARDING } from "@/constants/content";
import { computeArchetype, computeRiskScore } from "@/lib/utils/archetype";

const STYLE_CARDS = [
  { value: "growth", label: ONBOARDING.styles.growth.label, desc: ONBOARDING.styles.growth.description, icon: TrendingUp },
  { value: "value", label: ONBOARDING.styles.value.label, desc: ONBOARDING.styles.value.description, icon: Search },
  { value: "momentum", label: ONBOARDING.styles.momentum.label, desc: ONBOARDING.styles.momentum.description, icon: Zap },
  { value: "income", label: ONBOARDING.styles.income.label, desc: ONBOARDING.styles.income.description, icon: DollarSign },
];

const RISK_OPTIONS = ONBOARDING.riskOptions.map((label, i) => ({ label, value: String(i + 1) }));

const RANGE_MAP: Record<string, number> = {
  "$10K–$25K": 17500, "$25K–$100K": 62500, "$100K–$500K": 300000, "$500K+": 750000,
};
const RANGE_DB_MAP: Record<string, string> = {
  "$10K–$25K": "10k-25k", "$25K–$100K": "25k-100k", "$100K–$500K": "100k-500k", "$500K+": "500k+",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [style, setStyle] = useState("");
  const [risk, setRisk] = useState("");
  const [instruments, setInstruments] = useState<string[]>([]);
  const [portfolioRange, setPortfolioRange] = useState("");
  const [balance, setBalance] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const progress = (step / 5) * 100;

  const archetype = style && risk && instruments.length > 0
    ? computeArchetype({ style, riskTolerance: parseInt(risk), instruments: instruments.map((i) => i.toLowerCase()) })
    : null;
  const riskScore = risk && instruments.length > 0
    ? computeRiskScore(parseInt(risk), instruments.map((i) => i.toLowerCase()))
    : 0;

  async function handleSubmit() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          investing_style: style,
          risk_tolerance: parseInt(risk),
          instruments: instruments.map((i) => i.toLowerCase()),
          portfolio_size_range: RANGE_DB_MAP[portfolioRange] || "25k-100k",
          portfolio_balance: parseFloat(balance) || RANGE_MAP[portfolioRange] || 50000,
        }),
      });
      if (!res.ok) throw new Error("Failed to save profile");
      router.push("/home");
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen max-w-[390px] mx-auto flex flex-col">
      {/* Progress bar */}
      <div className="h-1 bg-bg-surface mx-4 mt-[env(safe-area-inset-top,16px)] rounded-full overflow-hidden">
        <div
          className="h-full bg-accent-blue transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 p-[16px] flex flex-col">
        {/* Step 1: Investing Style */}
        {step === 1 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-[22px] font-semibold text-text-primary mt-6 mb-6">
              {ONBOARDING.step1Header}
            </h1>
            <div className="grid grid-cols-2 gap-3">
              {STYLE_CARDS.map((card) => {
                const Icon = card.icon;
                const selected = style === card.value;
                return (
                  <button
                    key={card.value}
                    onClick={() => {
                      setStyle(card.value);
                      setTimeout(() => setStep(2), 300);
                    }}
                    className={`
                      flex flex-col items-center gap-3 p-4 rounded-[12px] border min-h-[120px]
                      transition-all duration-200
                      ${selected
                        ? "border-accent-blue bg-accent-blue/10"
                        : "border-border-default bg-bg-surface hover:bg-bg-surface-hover"}
                    `}
                  >
                    <Icon className={`h-8 w-8 ${selected ? "text-accent-blue" : "text-text-secondary"}`} />
                    <div className="text-center">
                      <p className="text-[14px] font-medium text-text-primary">{card.label}</p>
                      <p className="text-[12px] text-text-secondary mt-1">{card.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Risk Tolerance */}
        {step === 2 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-[22px] font-semibold text-text-primary mt-6 mb-2">
              {ONBOARDING.step2Header}
            </h1>
            <p className="text-[14px] text-text-secondary mb-6">
              {ONBOARDING.step2Subheader}
            </p>
            <div className="flex flex-col gap-3">
              {RISK_OPTIONS.map((opt) => {
                const selected = risk === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setRisk(opt.value);
                      setTimeout(() => setStep(3), 300);
                    }}
                    className={`
                      w-full p-4 rounded-[12px] border text-left min-h-[52px]
                      transition-all duration-200
                      ${selected
                        ? "border-accent-blue bg-accent-blue/10"
                        : "border-border-default bg-bg-surface hover:bg-bg-surface-hover"}
                    `}
                  >
                    <span className="text-[16px] text-text-primary">{opt.label}</span>
                  </button>
                );
              })}
            </div>
            <button onClick={() => setStep(1)} className="mt-4 text-[14px] text-text-secondary min-h-[44px]">
              ← Back
            </button>
          </div>
        )}

        {/* Step 3: Trading Experience */}
        {step === 3 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-[22px] font-semibold text-text-primary mt-6 mb-6">
              {ONBOARDING.step3Header}
            </h1>
            <p className="text-[14px] text-text-secondary mb-3">What do you trade?</p>
            <PillSelector
              options={ONBOARDING.instruments.map((i) => ({ label: i, value: i }))}
              selected={instruments}
              onChange={(v) => setInstruments(v as string[])}
              multiSelect
            />
            <p className="text-[14px] text-text-secondary mt-6 mb-3">Portfolio size range</p>
            <PillSelector
              options={ONBOARDING.portfolioRanges.map((r) => ({ label: r, value: r }))}
              selected={portfolioRange}
              onChange={(v) => {
                setPortfolioRange(v as string);
                setBalance(String(RANGE_MAP[v as string] || ""));
              }}
            />
            <div className="mt-auto pt-6 flex gap-3">
              <button onClick={() => setStep(2)} className="text-[14px] text-text-secondary min-h-[44px] px-4">
                ← Back
              </button>
              <Button
                fullWidth
                disabled={instruments.length === 0 || !portfolioRange}
                onClick={() => setStep(4)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Portfolio Balance */}
        {step === 4 && (
          <div className="flex-1 flex flex-col">
            <h1 className="text-[22px] font-semibold text-text-primary mt-6 mb-6">
              {ONBOARDING.step4Header}
            </h1>
            <Input
              dollar
              value={balance}
              onChange={setBalance}
              placeholder="50,000"
              helper={ONBOARDING.step4Helper}
            />
            <div className="mt-auto pt-6 flex gap-3">
              <button onClick={() => setStep(3)} className="text-[14px] text-text-secondary min-h-[44px] px-4">
                ← Back
              </button>
              <Button
                fullWidth
                disabled={!balance || parseFloat(balance) <= 0}
                onClick={() => setStep(5)}
              >
                Next
              </Button>
            </div>
          </div>
        )}

        {/* Step 5: Profile Reveal */}
        {step === 5 && archetype && (
          <div className="flex-1 flex flex-col items-center text-center">
            <h1 className="text-[22px] font-semibold text-text-primary mt-6 mb-8">
              {ONBOARDING.step5Header}
            </h1>
            <div className="text-[28px] font-bold text-accent-blue mb-4">
              {archetype.name}
            </div>
            {/* Risk/Return spectrum */}
            <div className="w-full max-w-[300px] mb-4">
              <div className="h-3 rounded-full bg-gradient-to-r from-gain-green via-warning-amber to-loss-red relative">
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-accent-blue shadow-lg transition-all"
                  style={{ left: `${((riskScore - 1) / 9) * 100}%`, transform: "translate(-50%, -50%)" }}
                />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[12px] text-text-tertiary">Conservative</span>
                <span className="text-[12px] text-text-tertiary">Aggressive</span>
              </div>
            </div>
            <p className="text-[16px] text-text-secondary max-w-[320px] mb-8">
              {archetype.description}
            </p>
            <div className="mt-auto w-full flex flex-col gap-3 pb-4">
              <button onClick={() => setStep(4)} className="text-[14px] text-text-secondary min-h-[44px]">
                ← Back
              </button>
              {error && (
                <p className="text-[14px] text-loss-red text-center">{error}</p>
              )}
              <Button fullWidth size="lg" loading={loading} onClick={handleSubmit}>
                {ONBOARDING.step5CTA}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
